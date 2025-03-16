import { NextFunction, Request, Response } from 'express';
import { CreateVoteDto } from '../dtos/votes.dto';
import { verify } from 'hcaptcha';
import { HCAPTCHA_SECRET, SECRET_KEY } from '../config';
import VoteModel from '../models/votes.model';
import VotingPeriodModel from '../models/periods.model';

export class VoteController {
  public getVotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const votes = await VoteModel.find({ ip: req.ip });

      return res.status(200).json({ message: 'findAll', data: votes });
    } catch (error) {
      next(error);
    }
  };

  public getVoteLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const password = req.query.password;
      if (!password || password.toString() !== SECRET_KEY) {
        return res.status(403).json({ message: 'incorrectPassword' });
      }
      const data = await VoteModel.getLeaderboard();

      return res.status(200).json({ message: 'ok', data });
    } catch (error) {
      next(error);
    }
  };

  public getVoteLeaderboardByPeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const password = req.query.password;
      if (!password || password.toString() !== SECRET_KEY) {
        return res.status(403).json({ message: 'incorrectPassword' });
      }

      const periodId = Number(req.params.periodId);

      // Check if period exists
      const period = await VotingPeriodModel.findById(periodId);
      if (!period) {
        return res.status(404).json({ message: 'periodNotFound' });
      }

      const data = await VoteModel.getLeaderboardByPeriod(periodId);

      return res.status(200).json({ message: 'ok', data });
    } catch (error) {
      next(error);
    }
  };

  public getVoteFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      const data = {
        results: await VoteModel.find({}, 'feedback ip createdAt', { limit: Number(limit), skip: (Number(page) - 1) * Number(limit) }),
        limit,
        page,
        total: await VoteModel.countDocuments({}),
      };
      return res.status(200).json({ message: 'ok', data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };

  public postVote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateVoteDto = req.body;
      const hcaptchaResult = await verify(HCAPTCHA_SECRET, body.token);

      if (!hcaptchaResult.success) {
        return res.status(403).json({ message: 'invalidCaptcha' });
      }

      // Get current active voting period
      const now = new Date();
      const currentPeriod = await VotingPeriodModel.findOne({
        startDate: { $lte: now },
        endDate: { $gte: now },
        isActive: true,
      });

      // Check if there's an active period
      if (!currentPeriod) {
        return res.status(400).json({ message: 'noActiveVotingPeriod' });
      }

      if (!!(await VoteModel.findOne({ ip: req.ip, votingPeriodId: currentPeriod._id }))) {
        return res.status(429).json({ message: 'rateLimit' });
      }

      const userAgent = req.get('User-Agent');

      await VoteModel.create({
        votingPeriodId: currentPeriod._id,
        ip: req.ip,
        ua: userAgent,
        favoriteRanobe: body.favoriteRanobe,
        favoriteRookie: body.favoriteRookie,
        favoriteOneshot: body.favoriteOneshot,
        favoritePublisher: body.favoritePublisher,
        feedback: body.feedback,
        userInfo: body.userInfo,
      });

      return res.status(200).json({ message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
