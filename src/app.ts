import express, { Express } from 'express';
import { start } from './server';
import { winstonLogger } from '@huynguyen-hl/jobber-shared';
import { Logger } from 'winston';
import { config } from './config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationApp', 'debug');

function initialize() {
  const app: Express = express();
  start(app);
  log.info('Notification service initialized');
}

initialize();