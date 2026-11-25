import { test, expect } from '../fixtures/raceFixtures';
import authVariations from '../test-data/authVariations.json';
import rideSearchVariations from '../test-data/rideSearchVariations.json';
import supportIssueVariations from '../test-data/supportIssueVariations.json';
import { mockDeviceIdSuccess, mockLoginSuccess } from '../utils/testData';

test.describe('Data-Driven JSON Variations', { tag: ['@regression'] }, () => {
  for (const tc of authVariations.invalidSignInCases) {
    test(`DD Auth Invalid SignIn: ${tc.label}`, async ({ homePage, authModal }) => {
      await homePage.goto('/');
      await homePage.openLoginModal();
      await authModal.signIn({
        username: tc.username,
        phone: tc.phone,
        password: tc.password,
      });
      await expect(authModal.errorBanner).toContainText(tc.expectedError);
    });
  }

  for (const tc of authVariations.validSignInCases) {
    test(`DD Auth Valid SignIn: ${tc.label}`, async ({
      page,
      homePage,
      authModal,
    }) => {
      await mockDeviceIdSuccess(page, tc.expectedDeviceId);
      await mockLoginSuccess(page);

      await homePage.goto('/');
      await homePage.openLoginModal();
      await authModal.signIn({
        username: tc.username,
        countryCode: tc.countryCode,
        phone: tc.phone,
        password: tc.password,
      });

      await expect(authModal.dialog).toBeHidden();
      expect(await homePage.getSessionStorageItem('userId')).toBeTruthy();
    });
  }

  for (const tc of rideSearchVariations.searchFilters) {
    test(`DD Ride Search: ${tc.label}`, async ({ homePage }) => {
      await homePage.goto('/');
      if (tc.from) await homePage.fromInput.fill(tc.from);
      if (tc.to) await homePage.toInput.fill(tc.to);
      await expect(homePage.rideCards()).toHaveCount(tc.expectedCount);
    });
  }

  for (const tc of supportIssueVariations.reportIssuePayloads) {
    test(`DD Support Issue Submit: ${tc.issueType}`, async ({
      authenticatedPage,
      reportIssuePage,
    }) => {
      await authenticatedPage.goto('/reportanIssue');
      await reportIssuePage.submitIssue(tc);
      await expect(reportIssuePage.successHeading).toBeVisible();
    });
  }
});
