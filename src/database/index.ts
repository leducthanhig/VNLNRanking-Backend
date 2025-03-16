import { connect, set } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } from '@config';

export const dbConnection = async () => {
  const dbConfing = {
    url: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=admin`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfing.url);
};
