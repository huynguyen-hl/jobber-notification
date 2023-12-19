import * as connection from '@/queues/connection';
import * as amqp from 'amqplib';
import { consumeAuthEmail, consumeOrderEmail } from '@/queues/email.consumer';

jest.mock('@/queues/connection');
jest.mock('@huynguyen-hl/jobber-shared');
jest.mock('amqplib');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() =>{
    jest.clearAllMocks();
  });

  describe('consumeAuthEmail method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        sendEmail: jest.fn(),
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as any);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeAuthEmail(connectionChannel!);
      expect(connectionChannel?.assertExchange).toHaveBeenCalledWith('jobber-auth-notification', 'direct');
      expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'jobber-auth-notification', 'auth-email');
    });
  });

  describe('consumeOrderEmail method', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        sendEmail: jest.fn(),
      };

      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'order-email-queue', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel as any);
      const connectionChannel: amqp.Channel | undefined = await connection.createConnection();
      await consumeOrderEmail(connectionChannel!);
      expect(connectionChannel?.assertExchange).toHaveBeenCalledWith('jobber-order-notification', 'direct');
      expect(connectionChannel?.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.consume).toHaveBeenCalledTimes(1);
      expect(connectionChannel?.bindQueue).toHaveBeenCalledWith('order-email-queue', 'jobber-order-notification', 'order-email');
    });
  });
}); 