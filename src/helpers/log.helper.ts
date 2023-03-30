/* eslint-disable no-console */
import { LOG_ENABLED } from '../setting';

const logger = (message: string, label = 'LOG:::::') => {
  const l = String(LOG_ENABLED).toLowerCase() === 'true';
  if (l) {
    console.log(`${label}${message}`);
  }
};

export { logger };
