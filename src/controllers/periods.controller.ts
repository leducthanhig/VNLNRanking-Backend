import { NextFunction, Request, Response } from 'express';
import { SECRET_KEY } from '../config';
import VotingPeriodModel from '../models/periods.model';

export class PeriodController {
  public getAllPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const periods = await VotingPeriodModel.find().sort({ startDate: -1 });

      return res.status(200).json({ message: 'findAll', data: periods });
    } catch (error) {
      next(error);
    }
  };

  public getCurrentPeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const now = new Date();
      const currentPeriod = await VotingPeriodModel.findOne({
        startDate: { $lte: now },
        endDate: { $gte: now },
        isActive: true,
      });

      if (!currentPeriod) {
        return res.status(404).json({ message: 'noActiveVotingPeriod' });
      }

      return res.status(200).json({ message: 'findCurrent', data: currentPeriod });
    } catch (error) {
      next(error);
    }
  };

  public postPeriod = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const password = req.query.password;
      if (!password || password.toString() !== SECRET_KEY) {
        return res.status(403).json({ message: 'incorrectPassword' });
      }

      const period = await VotingPeriodModel.create(req.body);

      return res.status(201).json({ message: 'created', data: period });
    } catch (error) {
      next(error);
    }
  };

  public togglePeriodActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const password = req.query.password;
      if (!password || password.toString() !== SECRET_KEY) {
        return res.status(403).json({ message: 'incorrectPassword' });
      }

      const periodId = Number(req.params.id);
      const { isActive } = req.body;

      if (isActive === undefined) {
        return res.status(400).json({ message: 'isActiveRequired' });
      }

      const updatedPeriod = await VotingPeriodModel.findByIdAndUpdate(periodId, { isActive }, { new: true });

      if (!updatedPeriod) {
        return res.status(404).json({ message: 'periodNotFound' });
      }

      return res.status(200).json({ message: 'updated', data: updatedPeriod });
    } catch (error) {
      next(error);
    }
  };
}
