import { Scenes } from 'telegraf';

import { Subscriber } from '../../db/models/subscriberModel.js';

export const subscribeScene = new Scenes.WizardScene(
  'subscribe',

  async (ctx) => {
    await ctx.reply('Вкажи своє місто:');
    return ctx.wizard.next();
  },

  async (ctx) => {
    ctx.wizard.state.city = ctx.message.text;
    await ctx.reply('О котрій годині надсилати прогноз?\nФормат: 08:00');
    return ctx.wizard.next();
  },

  async (ctx) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const notifyAt = ctx.message.text;

    if (!timeRegex.test(notifyAt)) {
      await ctx.reply('Невірний формат часу. Спробуй ще раз, наприклад: 08:00');
      return;
    }

    const { city } = ctx.wizard.state;
    const chatId = ctx.chat.id;

    await Subscriber.findOneAndUpdate(
      { chatId },
      { chatId, city, notifyAt },
      { upsert: true },
    );

    await ctx.reply(
      `✅ Підписку оформлено!\n📍 Місто: ${city}\n⏰ Час: ${notifyAt}`,
    );

    return ctx.scene.leave();
  },
);
