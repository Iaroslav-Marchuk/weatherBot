import 'dotenv/config';
import http from 'http';

import { startBot } from './bot/index.js';
import { initMongoDB } from './db/initMongoDB.js';
import { getEnvVariable } from './utils/getEnvVariable.js';

const PORT = getEnvVariable('PORT') || 8080;

const bootstrap = async () => {
  await initMongoDB();
  await startBot();

  http.createServer((_, res) => res.end('ok')).listen(PORT);
};

bootstrap().catch((error) => console.error(error));
