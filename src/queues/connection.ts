import { config } from '@/config';
import { winstonLogger } from '@huynguyen-hl/jobber-shared';
import client, { Channel, Connection } from 'amqplib';
import { Logger } from 'winston';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    log.info('Notification server connected to queue successfully...');

    return channel;
  } catch (error) {
    log.log('error', 'NotificationService error createConnection() method:', error);
    return undefined;
  }
}

async function closeConnection(channel: Channel, connection: Connection): Promise<void> {
  await channel.close();
  await connection.close();
}

export { 
  createConnection,
  closeConnection
};