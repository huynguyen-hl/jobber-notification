import { config } from '@/config';
import { emailTemplates } from '@/helpers';
import { IEmailLocals, winstonLogger } from '@huynguyen-hl/jobber-shared';
import { Logger } from 'winston';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationEmailConsumer', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    await emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'NotificationService EmailTransport sendEmail() method error:', error);
  }
}

export { sendEmail };