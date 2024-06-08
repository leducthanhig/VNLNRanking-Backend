import App from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { VoteRoute } from './routes/votes.route';

ValidateEnv();

const app = new App([new VoteRoute()]);

app.listen();
