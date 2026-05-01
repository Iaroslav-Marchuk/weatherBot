import 'dotenv/config';

import { startBot } from './bot/index.js';
import { initMongoDB } from './db/initMongoDB.js';

const bootstrap = async () => {
  await initMongoDB();
  await startBot();
};

bootstrap().catch((error) => console.error(error));
