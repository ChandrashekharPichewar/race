import { Locator, Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async getSessionStorageItem(key: string): Promise<string | null> {
    return this.page.evaluate((k) => window.sessionStorage.getItem(k), key);
  }

  async getCookieMap(): Promise<Record<string, string>> {
    const cookies = await this.page.context().cookies();
    return cookies.reduce<Record<string, string>>((acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    }, {});
  }

  toast(text?: string | RegExp): Locator {
    const container = this.page.locator('.fixed.bottom-5.right-5');
    return text ? container.filter({ hasText: text }) : container;
  }

  async expectPath(pattern: RegExp) {
    await expect(this.page).toHaveURL(pattern);
  }
}
