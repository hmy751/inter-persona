import { v4 as uuidv4 } from 'uuid';
import { SESSION_ID_KEY, SESSION_TIMESTAMP_KEY, SESSION_TIMEOUT } from '@/_libs/constant';

export const getSessionId = (): string => {
  const sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  const sessionTimestamp = sessionStorage.getItem(SESSION_TIMESTAMP_KEY);
  const now = Date.now();

  if (sessionId && sessionTimestamp) {
    const isValidTime = now - parseInt(sessionTimestamp) < SESSION_TIMEOUT;

    if (isValidTime) {
      sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());
      return sessionId;
    }
  }

  const newId = uuidv4();

  sessionStorage.setItem(SESSION_ID_KEY, newId);
  sessionStorage.setItem(SESSION_TIMESTAMP_KEY, now.toString());

  return newId;
};

export const clearSessionId = (): void => {
  sessionStorage.removeItem(SESSION_ID_KEY);
  sessionStorage.removeItem(SESSION_TIMESTAMP_KEY);
};
