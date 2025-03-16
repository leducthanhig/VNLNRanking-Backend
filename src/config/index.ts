import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, HCAPTCHA_SECRET } = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

export const ROOKIE_RANOBE_IDS = [2, 6, 13, 17, 19, 22, 24, 38, 39, 40, 41, 43, 47];

export const ONESHOT_RANOBE_IDS = [
  17, 22, 38, 39, 40, 41, 43, 48, 51, 61, 65, 68, 69, 72, 75, 82, 83, 85, 92, 95, 96, 105, 108, 113, 114, 118, 124, 131, 132, 133, 134, 136, 137, 138,
  139, 141, 142, 143, 145, 147, 148, 149, 152, 153, 155, 156, 157, 158, 160, 161, 165, 167, 170, 171, 172, 174, 175, 176, 177, 181, 185, 186, 187,
  188, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 204, 205, 206, 209, 210, 211, 213, 214, 215, 216, 217, 218,
];
