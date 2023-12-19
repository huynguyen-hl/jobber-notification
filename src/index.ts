import express from 'express';
import { winstonLogger } from '@huynguyen-hl/jobber-shared';
import { config } from './config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

const app = express();

app.listen(2000, () => {
  const world = 'world';
  console.log(`Hello ${world}!!! `);
  log.info('Notification service initialized');
});


