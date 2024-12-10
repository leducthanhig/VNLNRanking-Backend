import { Router } from 'express';
import { VoteController } from '@controllers/votes.controller';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateVoteDto } from '../dtos/votes.dto';

export class VoteRoute implements Routes {
  public path = '/votes';
  public router = Router();
  public vote = new VoteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/all`, this.vote.getVotes);
    this.router.get(`${this.path}/leaderboard`, this.vote.getVoteLeaderboard);
    this.router.get(`${this.path}/feedbacks`, this.vote.getVoteFeedbacks);
    this.router.post(`${this.path}`, ValidationMiddleware(CreateVoteDto), this.vote.postVote);
  }
}
