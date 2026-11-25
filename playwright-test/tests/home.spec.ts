import { test, expect } from '../fixtures/raceFixtures';

test.describe('Public Home Page & Ride Sharing Features', { tag: ['@smoke', '@regression'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto('/');
  });

  test('01. Renders public landing page by default with Race logo and navbar', async ({
    homePage,
  }) => {
    await expect(homePage.brandLogo).toBeVisible();
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.manageRideButton).toBeVisible();
  });

  test('02. Displays all navbar links: Company, For Guest, For Hosts, Commute Carpool, Popular Rides', async ({
    page,
  }) => {
    for (const label of [
      'Company',
      'For Guest',
      'For Hosts',
      'Commute Carpool',
      'Popular Rides',
    ]) {
      await expect(page.locator('header nav button', { hasText: label })).toBeVisible();
    }
  });

  test('03. Opens Company dropdown menu items', async ({ homePage, page }) => {
    await homePage.openNavDropdown('Company');
    await expect(page.getByRole('button', { name: 'About Race' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Safety & Verification' })).toBeVisible();
  });

  test('04. Opens For Guest dropdown and displays Book a Ride option', async ({
    homePage,
    page,
  }) => {
    await homePage.openNavDropdown('For Guest');
    await expect(page.getByRole('button', { name: 'Book a Ride' }).first()).toBeVisible();
  });

  test('05. Opens For Hosts dropdown and opens Host a Ride modal', async ({
    homePage,
    page,
  }) => {
    await homePage.openNavDropdown('For Hosts');
    await page.locator('header nav button', { hasText: 'Host a Ride' }).click();
    await expect(page.getByRole('heading', { name: 'Host a Ride' })).toBeVisible();
  });

  test('06. Hero carousel displays default headline and cycles slides on Next/Prev click', async ({
    homePage,
  }) => {
    await expect(homePage.heroHeadline).toContainText('daily commute carpool');
    await homePage.heroNextSlideButton.click();
    await expect(homePage.heroHeadline).toContainText('host a ride & earn');
    await homePage.heroPrevSlideButton.click();
    await expect(homePage.heroHeadline).toContainText('daily commute carpool');
  });

  test('07. Hero displays Google Play and App Store download badges', async ({ page }) => {
    await expect(page.locator('section#top', { hasText: 'Google Play' })).toBeVisible();
    await expect(page.locator('section#top', { hasText: 'App Store' })).toBeVisible();
  });

  test('08. Displays initial list of available rides on public landing page', async ({
    homePage,
  }) => {
    const count = await homePage.rideCards().count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('09. Filters rides by origin ("Gachibowli")', async ({ homePage }) => {
    await homePage.fromInput.fill('Gachibowli');
    await expect(homePage.rideCards()).toHaveCount(1);
    await expect(homePage.rideCards().first()).toContainText('HITEC City');
  });

  test('10. Filters rides by destination ("Bengaluru")', async ({ homePage }) => {
    await homePage.toInput.fill('Bengaluru');
    await expect(homePage.rideCards()).toHaveCount(1);
    await expect(homePage.rideCards().first()).toContainText('Hyderabad');
  });

  test('11. Filters rides by category chips (Intercity vs Daily Commute)', async ({
    homePage,
  }) => {
    await homePage.filterByCategory('Intercity');
    await expect(homePage.rideCards()).toHaveCount(1);
    await homePage.filterByCategory('Daily Commute');
    await expect(homePage.rideCards()).toHaveCount(4);
    await homePage.filterByCategory('All Rides');
    await expect(homePage.rideCards()).toHaveCount(5);
  });

  test('12. Filters rides by Instant Book toggle chip', async ({ homePage }) => {
    await homePage.instantBookChip.click();
    await expect(homePage.rideCards()).toHaveCount(4);
  });

  test('13. Quick route chip populates search inputs and filters rides', async ({
    homePage,
  }) => {
    await homePage.clickQuickRoute('Miyapur → Financial District');
    await expect(homePage.fromInput).toHaveValue('Miyapur');
    await expect(homePage.toInput).toHaveValue('Financial District');
    await expect(homePage.rideCards()).toHaveCount(1);
  });

  test('14. Shows empty state when no rides match and resets filters cleanly', async ({
    homePage,
    page,
  }) => {
    await homePage.fromInput.fill('NonExistentCityXYZ');
    await expect(page.getByText('No rides match your filters')).toBeVisible();
    await page.getByRole('button', { name: 'Clear Filters' }).click();
    await expect(homePage.rideCards()).toHaveCount(5);
  });

  test('15. Clicking Book Seat while unauthenticated opens Sign In modal', async ({
    homePage,
    authModal,
  }) => {
    await homePage.clickBookSeatOnFirstRide();
    await expect(authModal.dialog).toBeVisible();
    await expect(authModal.title).toHaveText('Welcome Back');
  });

  test('16. Commute Carpool Calculator updates monthly savings on slider change', async ({
    page,
  }) => {
    const calculator = page.locator('#commute-impact');
    await expect(calculator).toContainText('Commute Carpool Calculator');
    const rangeInput = calculator.locator('input[type="range"]').first();
    await rangeInput.fill('50');
    await expect(calculator).toContainText('50 km');
  });

  test('17. Manage Ride modal prompts sign in when unauthenticated', async ({
    homePage,
    page,
  }) => {
    await homePage.openManageModal();
    await expect(
      page.getByText('Sign in to view and manage your rides')
    ).toBeVisible();
  });

  test('18. Renders dark 6-column footer with contact info, links, and social icons', async ({
    page,
  }) => {
    const footer = page.locator('footer#footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('contact@raceapp.com');
    await expect(footer).toContainText('+91 76809 38741');
    for (const heading of [
      'Company',
      'For Guest',
      'For Hosts',
      'Help and Support',
      'Legal and Compliance',
    ]) {
      await expect(footer.getByRole('heading', { name: heading })).toBeVisible();
    }
  });
});
