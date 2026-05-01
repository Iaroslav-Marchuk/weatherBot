import { Telegraf, Scenes, session } from 'telegraf';
import { getEnvVariable } from '../utils/getEnvVariable.js';

import { weatherCommand } from './commands/weather.js';
import { forecastCommand } from './commands/forecast.js';
import { subscribeScene } from './scenes/subscribeScene.js';
import { startNotificationCron } from './cron/notifySubscribes.js';

const bot = new Telegraf(getEnvVariable('BOT_TOKEN'));

const stage = new Scenes.Stage([subscribeScene]);
bot.use(session());
bot.use(stage.middleware());

bot.command('start', (ctx) => ctx.scene.enter('subscribe'));

weatherCommand(bot);
forecastCommand(bot);
startNotificationCron(bot);

export const startBot = async () => {
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'Налаштувати сповіщення' },
    { command: 'weather', description: 'Поточна погода — /weather Київ' },
    { command: 'forecast', description: 'Прогноз на 5 днів — /forecast Київ' },
  ]);

  bot.launch();
  console.log('Bot is started 🤖');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
