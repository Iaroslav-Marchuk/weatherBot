import cron from 'node-cron';
import { SubscriberCollection } from '../../db/models/subscriberModel.js';
import { getForecast } from '../../services/weatherService.js';

export const startNotificationCron = (bot) => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const subscribers = await SubscriberCollection.find();

    for (const subscriber of subscribers) {
      const localTime = now.toLocaleTimeString('en-GB', {
        timeZone: subscriber.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      if (localTime === subscriber.notifyAt) {
        try {
          const message = await getForecast(subscriber.city);
          await bot.telegram.sendMessage(
            subscriber.chatId,
            `🌅 Доброго ранку! Ось твій прогноз:\n\n${message}`,
          );
        } catch (error) {
          console.error(`Помилка для ${subscriber.chatId}:`, error.message);
        }
      }
    }
  });

  console.log('Cron запущено ✅');
};
