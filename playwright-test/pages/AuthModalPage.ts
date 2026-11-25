import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AuthModalPage extends BasePage {
  readonly dialog: Locator;
  readonly title: Locator;
  readonly closeButton: Locator;
  readonly errorBanner: Locator;

  readonly usernameInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly countryCodeSelect: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  readonly togglePasswordButton: Locator;
  readonly toggleConfirmPasswordButton: Locator;
  readonly submitButton: Locator;
  readonly switchToSignUpButton: Locator;
  readonly switchToSignInButton: Locator;

  constructor(page: Page) {
    super(page);
    this.dialog = page.getByRole('dialog');
    this.title = page.locator('#auth-modal-title');
    this.closeButton = this.dialog.getByRole('button', { name: 'Close modal' });
    this.errorBanner = this.dialog.locator('.bg-red-50');

    this.usernameInput = this.dialog.getByPlaceholder('john.doe@example.com');
    this.firstNameInput = this.dialog.getByPlaceholder('John', { exact: true });
    this.lastNameInput = this.dialog.getByPlaceholder('Doe', { exact: true });
    this.emailInput = this.dialog.locator('input[type="email"]');
    this.countryCodeSelect = this.dialog.getByLabel('Country code');
    this.phoneInput = this.dialog.getByPlaceholder('Enter your phone number');
    this.passwordInput = this.dialog.getByPlaceholder('••••••••').first();
    this.confirmPasswordInput = this.dialog.getByPlaceholder('••••••••').nth(1);

    this.togglePasswordButton = this.dialog.getByRole('button', {
      name: 'Toggle password visibility',
    });
    this.toggleConfirmPasswordButton = this.dialog.getByRole('button', {
      name: 'Toggle confirm password visibility',
    });
    this.submitButton = this.dialog.locator('button[type="submit"]');
    this.switchToSignUpButton = this.dialog.getByRole('button', { name: 'Sign Up' });
    this.switchToSignInButton = this.dialog.getByRole('button', { name: 'Sign In' });
  }

  async signIn(params: {
    username: string;
    phone: string;
    password: string;
    countryCode?: string;
  }) {
    await this.usernameInput.fill(params.username);
    if (params.countryCode) {
      await this.countryCodeSelect.selectOption(params.countryCode);
    }
    await this.phoneInput.fill(params.phone);
    await this.passwordInput.fill(params.password);
    await this.submitButton.click();
  }

  async signUp(params: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    countryCode?: string;
  }) {
    await this.firstNameInput.fill(params.firstname);
    await this.lastNameInput.fill(params.lastname);
    await this.emailInput.fill(params.email);
    if (params.countryCode) {
      await this.countryCodeSelect.selectOption(params.countryCode);
    }
    await this.phoneInput.fill(params.phone);
    await this.passwordInput.fill(params.password);
    await this.confirmPasswordInput.fill(params.confirmPassword);
    await this.submitButton.click();
  }
}
