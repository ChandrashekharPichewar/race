import { test, expect } from '../fixtures/raceFixtures';
import {
  API_BASE_URL,
  mockDeviceIdSuccess,
  mockLoginSuccess,
  mockMyTicketsSuccess,
  mockReportIssueSuccess,
  seedAuthenticatedSession,
} from '../utils/testData';

test.describe('Private Routes: Report an Issue & My Support Tickets', { tag: ['@smoke', '@private', '@regression'] }, () => {
  test('35. Blocks direct /reportanIssue URL without accessToken cookie and opens Sign In modal', async ({
    page,
    authModal,
  }) => {
    await page.goto('/reportanIssue');
    await expect(page).toHaveURL(/\/$/);
    await expect(authModal.dialog).toBeVisible();
    await expect(authModal.title).toHaveText('Welcome Back');
  });

  test('36. Blocks direct /my-support-tickets URL without accessToken cookie and opens Sign In modal', async ({
    page,
    authModal,
  }) => {
    await page.goto('/my-support-tickets');
    await expect(page).toHaveURL(/\/$/);
    await expect(authModal.dialog).toBeVisible();
  });

  test('37. Clicking Report an Issue in footer without token opens Sign In modal', async ({
    homePage,
    authModal,
  }) => {
    await homePage.goto('/');
    await homePage.footerReportIssueButton.click();
    await expect(authModal.dialog).toBeVisible();
    await expect(homePage.toast(/Please sign in to access Report an Issue/)).toBeVisible();
  });

  test('38. Clicking My support tickets in footer without token opens Sign In modal', async ({
    homePage,
    authModal,
  }) => {
    await homePage.goto('/');
    await homePage.footerMyTicketsButton.click();
    await expect(authModal.dialog).toBeVisible();
    await expect(homePage.toast(/Please sign in to view your support tickets/)).toBeVisible();
  });

  test('39. Redirects straight to /reportanIssue after signing in from guarded route', async ({
    page,
    homePage,
    authModal,
    reportIssuePage,
  }) => {
    await mockDeviceIdSuccess(page);
    await mockLoginSuccess(page);

    await homePage.goto('/');
    await homePage.footerReportIssueButton.click();
    await expect(authModal.dialog).toBeVisible();

    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
    });

    await reportIssuePage.expectPath(/\/reportanIssue$/);
    await expect(reportIssuePage.heading).toBeVisible();
  });

  test('40. Allows authenticated user with cookie token to open /reportanIssue directly', async ({
    authenticatedPage,
    reportIssuePage,
  }) => {
    await authenticatedPage.goto('/reportanIssue');
    await expect(reportIssuePage.heading).toBeVisible();
    await expect(reportIssuePage.beforeSubmitCallout).toBeVisible();
  });

  test('41. Report an Issue dropdown contains ride-sharing issue options and urgency levels', async ({
    authenticatedPage,
    reportIssuePage,
  }) => {
    await authenticatedPage.goto('/reportanIssue');
    await expect(reportIssuePage.issueTypeSelect).toContainText('Payment / Refund Issue');
    await expect(reportIssuePage.issueTypeSelect).toContainText('Safety Concern');
    await expect(reportIssuePage.urgencySelect).toContainText('High — Impacts an upcoming or recent ride');
  });

  test('42. Validates required fields on Report an Issue form before calling API', async ({
    authenticatedPage,
    reportIssuePage,
  }) => {
    await authenticatedPage.goto('/reportanIssue');
    await reportIssuePage.submitButton.click();
    await expect(reportIssuePage.errorBanner).toContainText(
      'Please select what type of issue this is.'
    );
  });

  test('43. Submits Report an Issue with Bearer token and displays generated ticketCode', async ({
    authenticatedPage,
    reportIssuePage,
  }) => {
    await authenticatedPage.goto('/reportanIssue');
    await reportIssuePage.submitIssue({
      issueType: 'Payment / Refund Issue',
      urgency: 'High — Impacts an upcoming or recent ride',
      briefDescription: 'Double charge on morning commute',
      details: 'Charged twice for ride-101.',
    });

    await expect(reportIssuePage.successHeading).toBeVisible();
    await expect(authenticatedPage.locator('section')).toContainText('RACE-482910');
  });

  test('44. Navigates from Report an Issue confirmation to My Support Tickets', async ({
    authenticatedPage,
    reportIssuePage,
    supportTicketsPage,
  }) => {
    await authenticatedPage.goto('/reportanIssue');
    await reportIssuePage.submitIssue({
      issueType: 'Safety Concern',
      urgency: 'Critical — Urgent safety or payment issue',
      briefDescription: 'Unsafe driving reported',
      details: 'Host exceeded speed limit.',
    });

    await reportIssuePage.viewMyTicketsAfterSubmitButton.click();
    await supportTicketsPage.expectPath(/\/my-support-tickets$/);
    await expect(supportTicketsPage.heading).toBeVisible();
  });

  test('45. Displays summary counts and ticket cards on My Support Tickets page', async ({
    authenticatedPage,
    supportTicketsPage,
  }) => {
    await authenticatedPage.goto('/my-support-tickets');
    await expect(supportTicketsPage.totalCount).toHaveText('3');
    await expect(supportTicketsPage.openCount).toHaveText('1');
    await expect(supportTicketsPage.inProgressCount).toHaveText('1');
    await expect(supportTicketsPage.resolvedCount).toHaveText('1');
    await expect(supportTicketsPage.ticketCards()).toHaveCount(3);
  });

  test('46. Filters tickets by status tab (Open / Resolved)', async ({
    authenticatedPage,
    supportTicketsPage,
  }) => {
    await authenticatedPage.goto('/my-support-tickets');
    await supportTicketsPage.filterButton('Open').click();
    await expect(supportTicketsPage.ticketCards()).toHaveCount(1);
    await expect(authenticatedPage.locator('section')).toContainText('RACE-670731');

    await supportTicketsPage.filterButton('Resolved').click();
    await expect(supportTicketsPage.ticketCards()).toHaveCount(1);
    await expect(authenticatedPage.locator('section')).toContainText('RACE-220198');
  });

  test('47. Renders Support Team Reply callout when adminReply is present', async ({
    authenticatedPage,
    supportTicketsPage,
  }) => {
    await authenticatedPage.goto('/my-support-tickets');
    await expect(authenticatedPage.locator('section')).toContainText('Support Team Reply');
    await expect(authenticatedPage.locator('section')).toContainText(
      'Host confirmed item was returned at DLF Gate 2.'
    );
    await expect(supportTicketsPage.heading).toBeVisible();
  });

  test('48. Handles backend response omitting summary & pagination without crashing', async ({
    page,
    supportTicketsPage,
  }) => {
    await seedAuthenticatedSession(page);
    await mockReportIssueSuccess(page);
    await mockMyTicketsSuccess(page, { omitSummary: true });

    await page.goto('/my-support-tickets');
    await expect(supportTicketsPage.heading).toBeVisible();
    await expect(supportTicketsPage.totalCount).toHaveText('3');
    await expect(supportTicketsPage.ticketCards()).toHaveCount(3);
  });

  test('49. Shows empty state when user has zero support tickets', async ({
    page,
    supportTicketsPage,
  }) => {
    await seedAuthenticatedSession(page);
    await mockMyTicketsSuccess(page, { empty: true });

    await page.goto('/my-support-tickets');
    await expect(supportTicketsPage.emptyStateHeading).toBeVisible();
  });

  test('50. Signing out while on a private route redirects back to public Home page', async ({
    authenticatedPage,
    homePage,
    supportTicketsPage,
  }) => {
    await authenticatedPage.goto('/my-support-tickets');
    await expect(supportTicketsPage.heading).toBeVisible();

    await homePage.signOutButton.click();
    await homePage.expectPath(/\/$/);
    await expect(homePage.heroHeadline).toBeVisible();
  });
});
