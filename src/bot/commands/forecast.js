import { getForecast } from '../../services/weatherService.js';

export function forecastCommand(bot) {
  bot.command('forecast', async (ctx) => {
    const city = ctx.message.text.split(' ').slice(1).join(' ');

    if (!city) {
      return ctx.reply('Вкажи місто: /forecast Київ');
    }

    try {
      const message = await getForecast(city);
      ctx.reply(`🗓 Прогноз для ${city}:\n\n${message}`);
    } catch {
      ctx.reply('Не вдалось отримати прогноз. Перевір назву міста.');
    }
  });
}
