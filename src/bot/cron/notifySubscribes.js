import cron from 'node-cron';
import { SubscriberCollection } from '../../db/models/subscriberModel.js';
import { getForecast } from '../../services/weatherService.js';

// export const startNotificationCron = (bot) => {
//   cron.schedule('* * * * *', async () => {
//     const now = new Date();
//     const hours = String(now.getUTCHours()).padStart(2, '0');
//     const minutes = String(now.getUTCMinutes()).padStart(2, '0');
//     const currentTime = `${hours}:${minutes}`;

//     const subscribers = await SubscriberCollection.find({
//       notifyAt: currentTime,
//     });

//     for (const subscriber of subscribers) {
//       try {
//         const message = await getForecast(subscriber.city);
//         await bot.telegram.sendMessage(
//           subscriber.chatId,
//           `🌅 Доброго ранку! Ось твій прогноз:\n\n${message}`,
//         );
//       } catch (error) {
//         console.error(
//           `Помилка відправки для ${subscriber.chatId}:`,
//           error.message,
//         );
//       }
//     }
//   });

//   console.log('Cron запущено ✅');
// };

export const startNotificationCron = (bot) => {
  cron.schedule('* * * * *', async () => {
    const now = new Date();
    const subscribers = await SubscriberCollection.find();

    for (const subscriber of subscribers) {
      // конвертуємо поточний час в часовий пояс користувача
      const localTime = now.toLocaleTimeString('uk-UA', {
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
};
