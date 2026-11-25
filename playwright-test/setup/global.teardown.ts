import { TestLogger } from '../utils/logger';

const logger = new TestLogger('GlobalTeardown');

async function globalTeardown() {
  logger.info('Completed Race Playwright test suite execution');
}

export default globalTeardown;
