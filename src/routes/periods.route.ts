import { Router } from 'express';
import { PeriodController } from '../controllers/periods.controller';
import { Routes } from '../interfaces/routes.interface';

export class PeriodRoute implements Routes {
  public path = '/periods';
  public router = Router();
  public period = new PeriodController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.period.getAllPeriods);
    this.router.get(`${this.path}/current`, this.period.getCurrentPeriod);
    this.router.post(`${this.path}`, this.period.postPeriod);
    this.router.patch(`${this.path}/:id/active`, this.period.togglePeriodActive);
  }
}
