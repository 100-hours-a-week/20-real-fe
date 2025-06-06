import { logEvent } from 'firebase/analytics';

import { EventName } from './eventNames';
import { analytics } from './init';

interface EventParams {
  description?: string;
}

const isProduction = process.env.NODE_ENV === 'production';

const getCommonParams = (): Record<string, string> => ({
  app_version: '1.0.0',
});

export const firebaseLogging = (eventName: EventName, eventParams?: EventParams): void => {
  if (!isProduction || !analytics) return;

  try {
    logEvent(analytics, eventName as string, {
      ...eventParams,
      ...getCommonParams(),
    });
  } catch (err) {
    console.warn(`[Firebase Logging Error]`, err);
  }
};
