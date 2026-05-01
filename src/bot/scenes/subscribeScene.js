import { Scenes } from 'telegraf';

import { SubscriberCollection } from '../../db/models/subscriberModel.js';
import { getCityData } from '../../services/weatherService.js';

export const subscribeScene = new Scenes.WizardScene(
  'subscribe',

  async (ctx) => {
    await ctx.reply('Вкажи своє місто:');
    return ctx.wizard.next();
  },

  async (ctx) => {
    const cityInput = ctx.message.text;

    try {
      const { name, timezone } = await getCityData(cityInput);
      ctx.wizard.state.city = name;
      ctx.wizard.state.timezone = timezone;
    } catch {
      await ctx.reply('Не вдалось знайти місто. Спробуй ще раз:');
      return;
    }

    await ctx.reply('О котрій годині надсилати прогноз?\nФормат: 08:00');
    return ctx.wizard.next();
  },

  async (ctx) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const notifyAt = ctx.message.text;

    if (!timeRegex.test(notifyAt)) {
      await ctx.reply('Невірний формат. Спробуй ще раз, наприклад: 08:00');
      return;
    }

    const { city, timezone } = ctx.wizard.state;
    const chatId = ctx.chat.id;

    await SubscriberCollection.findOneAndUpdate(
      { chatId },
      { chatId, city, notifyAt, timezone },
      { upsert: true },
    );

    await ctx.reply(
      `✅ Підписку оформлено!\n` +
        `📍 Місто: ${city}\n` +
        `⏰ Час: ${notifyAt}`,
    );

    return ctx.scene.leave();
  },
);
