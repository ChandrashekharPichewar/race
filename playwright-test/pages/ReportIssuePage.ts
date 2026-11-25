import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReportIssuePage extends BasePage {
  readonly heading: Locator;
  readonly backHomeButton: Locator;
  readonly myTicketsButton: Locator;
  readonly issueTypeSelect: Locator;
  readonly urgencySelect: Locator;
  readonly briefInput: Locator;
  readonly detailsTextarea: Locator;
  readonly beforeSubmitCallout: Locator;
  readonly submitButton: Locator;
  readonly errorBanner: Locator;
  readonly successHeading: Locator;
  readonly viewMyTicketsAfterSubmitButton: Locator;
  readonly submitAnotherButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Report an Issue' });
    this.backHomeButton = page.getByRole('button', { name: 'Back to Home' });
    this.myTicketsButton = page.getByRole('button', { name: 'My Support Tickets' });
    this.issueTypeSelect = page.locator('section select').nth(0);
    this.urgencySelect = page.locator('section select').nth(1);
    this.briefInput = page.getByPlaceholder('Brief description of the issue');
    this.detailsTextarea = page.getByPlaceholder('Tell us what happened');
    this.beforeSubmitCallout = page.locator('section', {
      hasText: 'Before you submit:',
    });
    this.submitButton = page.getByRole('button', { name: 'Submit Issue Report' });
    this.errorBanner = page.locator('section form .bg-red-50');
    this.successHeading = page.getByRole('heading', {
      name: 'Issue Report Submitted',
    });
    this.viewMyTicketsAfterSubmitButton = page.getByRole('button', {
      name: 'View My Support Tickets',
    });
    this.submitAnotherButton = page.getByRole('button', {
      name: 'Submit Another Issue',
    });
  }

  async submitIssue(params: {
    issueType: string;
    urgency: string;
    briefDescription: string;
    details: string;
  }) {
    await this.issueTypeSelect.selectOption(params.issueType);
    await this.urgencySelect.selectOption(params.urgency);
    await this.briefInput.fill(params.briefDescription);
    await this.detailsTextarea.fill(params.details);
    await this.submitButton.click();
  }
}
