import App from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { VoteRoute } from './routes/votes.route';
import { PeriodRoute } from './routes/periods.route';

ValidateEnv();

const app = new App([new VoteRoute(), new PeriodRoute()]);

app.listen();
