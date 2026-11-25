import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class SupportTicketsPage extends BasePage {
  readonly heading: Locator;
  readonly backHomeButton: Locator;
  readonly refreshButton: Locator;
  readonly reportIssueButton: Locator;

  readonly totalCount: Locator;
  readonly openCount: Locator;
  readonly inProgressCount: Locator;
  readonly resolvedCount: Locator;

  readonly emptyStateHeading: Locator;
  readonly errorBanner: Locator;
  readonly tryAgainButton: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'My Support Tickets' });
    this.backHomeButton = page.getByRole('button', { name: 'Back to Home' });
    this.refreshButton = page.getByRole('button', { name: 'Refresh' });
    this.reportIssueButton = page
      .locator('section button', { hasText: 'Report an Issue' })
      .first();

    this.totalCount = page.locator('section div', { hasText: /^Total Tickets/ }).locator('p').nth(1);
    this.openCount = page.locator('section div', { hasText: /^Open/ }).locator('p').nth(1);
    this.inProgressCount = page.locator('section div', { hasText: /^In Progress/ }).locator('p').nth(1);
    this.resolvedCount = page.locator('section div', { hasText: /^Resolved/ }).locator('p').nth(1);

    this.emptyStateHeading = page.getByRole('heading', {
      name: 'No support tickets found',
    });
    this.errorBanner = page.locator('section .bg-red-50');
    this.tryAgainButton = page.getByRole('button', { name: 'Try Again' });
    this.nextPageButton = page.getByRole('button', { name: 'Next' });
    this.prevPageButton = page.getByRole('button', { name: 'Previous' });
  }

  filterButton(label: 'All' | 'Open' | 'In Progress' | 'Resolved' | 'Closed'): Locator {
    return pageFilterButton(this.page, label);
  }

  ticketCards(): Locator {
    return this.page.locator('section h3');
  }
}

function pageFilterButton(page: Page, label: string): Locator {
  return page.locator('section button.rounded-full', { hasText: new RegExp(`^${label}$`) });
}
