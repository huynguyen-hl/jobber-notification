import { Logger } from 'winston';
import { config } from '@/config';
import { Application } from 'express';
import { healthRoutes } from './routes';
import { checkElasticsearchConnection } from './elasticsearch';
import { winstonLogger } from '@huynguyen-hl/jobber-shared';
import { createConnection } from './queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmail, consumeOrderEmail } from './queues/email.consumer';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationServer', 'debug');

export function start(app: Application): void {
  startServer(app);
  app.use(healthRoutes);

  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = await createConnection() as Channel;
  const orderChannel: Channel = await createConnection() as Channel;
  await consumeAuthEmail(emailChannel);
  await consumeOrderEmail(orderChannel);
}

function startElasticSearch(): void {
  checkElasticsearchConnection();
}

function startServer(app: Application): void {
  try {
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    app.listen(SERVER_PORT, () => {
      log.info(`Notification server running on port ${SERVER_PORT}`)
    });
  } catch (error) {
    log.log('error', 'NotificationService startServer() method:', error);
  }
}