import { test as base, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AuthModalPage } from '../pages/AuthModalPage';
import { ReportIssuePage } from '../pages/ReportIssuePage';
import { SupportTicketsPage } from '../pages/SupportTicketsPage';
import { AuthApiClient } from '../api/AuthApiClient';
import { SupportApiClient } from '../api/SupportApiClient';
import { TestLogger } from '../utils/logger';
import {
  mockMyTicketsSuccess,
  mockReportIssueSuccess,
  seedAuthenticatedSession,
} from '../utils/testData';

type RaceFixtures = {
  homePage: HomePage;
  authModal: AuthModalPage;
  reportIssuePage: ReportIssuePage;
  supportTicketsPage: SupportTicketsPage;
  authApi: AuthApiClient;
  supportApi: SupportApiClient;
  logger: TestLogger;
  authenticatedPage: Page;
};

export const test = base.extend<RaceFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  authModal: async ({ page }, use) => {
    await use(new AuthModalPage(page));
  },
  reportIssuePage: async ({ page }, use) => {
    await use(new ReportIssuePage(page));
  },
  supportTicketsPage: async ({ page }, use) => {
    await use(new SupportTicketsPage(page));
  },
  authApi: async ({ request }, use) => {
    await use(new AuthApiClient(request));
  },
  supportApi: async ({ request }, use) => {
    await use(new SupportApiClient(request));
  },
  logger: async ({}, use, testInfo) => {
    const logger = new TestLogger(testInfo.title);
    await use(logger);
  },
  authenticatedPage: async ({ page }, use) => {
    await seedAuthenticatedSession(page);
    await mockReportIssueSuccess(page);
    await mockMyTicketsSuccess(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
