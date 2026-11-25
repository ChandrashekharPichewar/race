import { FullConfig } from '@playwright/test';
import { envConfig } from '../config/env';
import { TestLogger } from '../utils/logger';

const logger = new TestLogger('GlobalSetup');

async function globalSetup(config: FullConfig) {
  logger.info('Starting Race Playwright test suite', {
    env: envConfig.name,
    baseUrl: envConfig.baseUrl,
    apiBaseUrl: envConfig.apiBaseUrl,
    runLiveApi: envConfig.runLiveApi,
    projects: config.projects.map((p) => p.name),
  });
}

export default globalSetup;
