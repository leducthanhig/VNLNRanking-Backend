import { NextFunction, Request, Response } from 'express';
import { CreateVoteDto } from '../dtos/votes.dto';
import { verify } from 'hcaptcha';
import { HCAPTCHA_SECRET } from '../config';
import VoteModel from '../models/votes.model';

export class VoteController {
    public getVotes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const votes = await VoteModel.find({ ip: req.ip })

            return res.status(200).json({ message: 'findAll', data: votes });
        } catch (error) {
            next(error);
        }
    }

    public getVoteLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await VoteModel.getLeaderboard()

            return res.status(200).json({ message: 'ok', data });
        } catch (error) {
            next(error);
        }
    }

    public getVoteFeedbacks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { limit = 10, page = 1 } = req.query
            const data = {
                results: await VoteModel.find({}, {}, { limit: Number(limit), skip: (Number(page) - 1) * Number(limit) }),
                limit,
                page,
            }
            return res.status(200).json({ message: 'ok', data });
        } catch (error) {
            console.error(error)
            next(error);
        }
    }

    public postVote = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: CreateVoteDto = req.body
            const hcaptchaResult = await verify(HCAPTCHA_SECRET, body.token);

            if (!hcaptchaResult.success) {
                return res.status(403).json({ message: 'invalidCaptcha' })
            }

            if (!!(await VoteModel.findOne({ ip: req.ip }))) {
                return res.status(429).json({ message: 'rateLimit' })
            }

            const userAgent = req.get('User-Agent');

            await VoteModel.create({
                ip: req.ip,
                ua: userAgent,
                favoriteRanobe: body.favoriteRanobe,
                favoriteIllustrator: body.favoriteIllustrator,
                favoritePublisher: body.favoritePublisher,
                feedback: body.feedback,
            })

            return res.status(200).json({ message: 'created' });
        } catch (error) {
            next(error);
        }
    };
}