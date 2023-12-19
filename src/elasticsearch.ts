import { winstonLogger } from '@huynguyen-hl/jobber-shared';
import { Logger } from 'winston';
import { config } from './config';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const { Client } = require('@elastic/elasticsearch');

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_URL}`,
  'notificationElasticSearch',
  'debug',
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkElasticsearchConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(
        `NotificationService Elasticsearch health status - ${health.status}`,
      );
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elastic Search failed. Retrying....');
      log.log('error', 'NotificationService checkConnection() method:', error);
    }
  }
}
