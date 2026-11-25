import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly brandLogo: Locator;
  readonly loginButton: Locator;
  readonly manageRideButton: Locator;
  readonly signOutButton: Locator;
  readonly heroHeadline: Locator;
  readonly heroNextSlideButton: Locator;
  readonly heroPrevSlideButton: Locator;
  readonly heroBookRideCta: Locator;
  readonly heroHostRideCta: Locator;

  readonly fromInput: Locator;
  readonly toInput: Locator;
  readonly dateInput: Locator;
  readonly seatsSelect: Locator;
  readonly searchResetButton: Locator;
  readonly instantBookChip: Locator;

  readonly footerReportIssueButton: Locator;
  readonly footerMyTicketsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.brandLogo = page.locator('header a', { hasText: 'Race' }).first();
    this.loginButton = page.locator('header button', { hasText: 'Login' });
    this.manageRideButton = page.locator('header button', { hasText: 'Manage Ride' });
    this.signOutButton = page.locator('header button[title="Sign Out"]');

    this.heroHeadline = page.locator('section#top h1');
    this.heroNextSlideButton = page.getByRole('button', { name: 'Next slide' });
    this.heroPrevSlideButton = page.getByRole('button', { name: 'Previous slide' });
    this.heroBookRideCta = page.locator('section#top button', { hasText: 'Book a Ride' });
    this.heroHostRideCta = page.locator('section#top button', { hasText: 'Host a Ride' });

    this.fromInput = page.getByPlaceholder('Leaving from...');
    this.toInput = page.getByPlaceholder('Going to...');
    this.dateInput = page.locator('#book-ride input[type="date"]');
    this.seatsSelect = page.locator('#book-ride select');
    this.searchResetButton = page.locator('#book-ride button', {
      hasText: /Search Rides|Reset Search/,
    });
    this.instantBookChip = page.locator('#book-ride button', { hasText: 'Instant Book' });

    this.footerReportIssueButton = page.locator('footer button', {
      hasText: 'Report an Issue',
    });
    this.footerMyTicketsButton = page.locator('footer button', {
      hasText: 'My support tickets',
    });
  }

  async openLoginModal() {
    await this.loginButton.click();
  }

  async openManageModal() {
    await this.manageRideButton.click();
  }

  async openHostModalFromHero() {
    await this.heroHostRideCta.click();
  }

  async openNavDropdown(name: 'Company' | 'For Guest' | 'For Hosts' | 'Commute Carpool') {
    await this.page.locator('header nav button', { hasText: name }).click();
  }

  rideCards(): Locator {
    return this.page.locator('#book-ride .grid > div').filter({
      has: this.page.getByRole('button', { name: 'Book Seat' }),
    });
  }

  async filterByCategory(label: 'All Rides' | 'Daily Commute' | 'Intercity') {
    await this.page.locator('#book-ride button', { hasText: label }).click();
  }

  async clickQuickRoute(routeText: string) {
    await this.page.locator('#book-ride button', { hasText: routeText }).click();
  }

  async clickBookSeatOnFirstRide() {
    await this.page.getByRole('button', { name: 'Book Seat' }).first().click();
  }
}
