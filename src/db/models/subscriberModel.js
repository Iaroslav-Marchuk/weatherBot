import { model, Schema } from 'mongoose';

const subscriberModel = new Schema(
  {
    chatId: { type: Number, required: true, unique: true },
    city: { type: String, required: true },
    notifyAt: { type: String, required: true },
    timezone: { type: String, required: true },
  },
  { timestamps: false, versionKey: false },
);

export const SubscriberCollection = model('Subscriber', subscriberModel);
