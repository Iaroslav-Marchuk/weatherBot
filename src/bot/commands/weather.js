import { getWeather } from '../../services/weatherService.js';

export function weatherCommand(bot) {
  bot.command('weather', async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' ');

    if (!city) {
      return ctx.reply('Вкажи місто: /weather Київ');
    }

    try {
      const message = await getWeather(city);
      ctx.reply(message);
    } catch (error) {
      console.error(error.message);
      ctx.reply('Не вдалось отримати погоду. Перевір назву міста.');
    }
  });
}
