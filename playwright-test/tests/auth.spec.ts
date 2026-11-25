import { test, expect } from '../fixtures/raceFixtures';
import {
  API_BASE_URL,
  MOCK_TOKENS,
  mockDeviceIdSuccess,
  mockLoginSuccess,
  mockSignupSuccess,
} from '../utils/testData';

test.describe('Authentication Modal (Sign In & Sign Up)', { tag: ['@smoke', '@auth', '@regression'] }, () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto('/');
    await homePage.openLoginModal();
  });

  test('19. Opens Sign In modal with Username/Email, Country Code + Phone, and Password', async ({
    authModal,
  }) => {
    await expect(authModal.dialog).toBeVisible();
    await expect(authModal.title).toHaveText('Welcome Back');
    await expect(authModal.usernameInput).toBeVisible();
    await expect(authModal.countryCodeSelect).toBeVisible();
    await expect(authModal.phoneInput).toBeVisible();
    await expect(authModal.passwordInput).toBeVisible();
  });

  test('20. Does NOT display Quick Demo Sign In or OTP controls', async ({
    authModal,
  }) => {
    await expect(authModal.dialog).not.toContainText('Quick Demo Sign In');
    await expect(authModal.dialog).not.toContainText('Send OTP');
  });

  test('21. Switches cleanly between Sign In and Sign Up modes', async ({
    authModal,
  }) => {
    await authModal.switchToSignUpButton.click();
    await expect(authModal.title).toHaveText('Create Account');
    await expect(authModal.firstNameInput).toBeVisible();
    await expect(authModal.lastNameInput).toBeVisible();
    await expect(authModal.emailInput).toBeVisible();
    await expect(authModal.confirmPasswordInput).toBeVisible();

    await authModal.switchToSignInButton.click();
    await expect(authModal.title).toHaveText('Welcome Back');
  });

  test('22. Sign Up form does NOT contain any gender field', async ({ authModal }) => {
    await authModal.switchToSignUpButton.click();
    await expect(authModal.dialog).not.toContainText(/gender/i);
  });

  test('23. Closes modal when clicking the close button', async ({ authModal }) => {
    await authModal.closeButton.click();
    await expect(authModal.dialog).toBeHidden();
  });

  test('24. Toggles password visibility in Sign In mode', async ({ authModal }) => {
    await expect(authModal.passwordInput).toHaveAttribute('type', 'password');
    await authModal.togglePasswordButton.click();
    await expect(authModal.passwordInput).toHaveAttribute('type', 'text');
    await authModal.togglePasswordButton.click();
    await expect(authModal.passwordInput).toHaveAttribute('type', 'password');
  });

  test('25. Validates empty username/email on Sign In submit', async ({ authModal }) => {
    await authModal.submitButton.click();
    await expect(authModal.errorBanner).toContainText(
      'Please enter your username or email.'
    );
  });

  test('26. Validates invalid short phone number on Sign In', async ({ authModal }) => {
    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '1234',
      password: 'Secret@123',
    });
    await expect(authModal.errorBanner).toContainText(
      'Please enter a valid phone number.'
    );
  });

  test('27. Validates mismatched passwords on Sign Up', async ({ authModal }) => {
    await authModal.switchToSignUpButton.click();
    await authModal.signUp({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
      confirmPassword: 'Different@123',
    });
    await expect(authModal.errorBanner).toContainText('Passwords do not match.');
  });

  test('28. Calls /api/deviceId BEFORE /api/auth/login and stores tokens in cookies & userId in sessionStorage', async ({
    page,
    homePage,
    authModal,
  }) => {
    const callOrder: string[] = [];
    await page.route(`${API_BASE_URL}/deviceId`, async (route) => {
      callOrder.push('deviceId');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Successfully saved', deviceID: '+919876543210' }),
      });
    });
    await page.route(`${API_BASE_URL}/auth/login`, async (route) => {
      callOrder.push('login');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 'a7e46406-8d7d-4440-9b8a-9eadc10e71f0',
          accessToken: MOCK_TOKENS.accessToken,
          refreshToken: MOCK_TOKENS.refreshToken,
          firstname: 'John',
          lastname: 'Doe',
        }),
      });
    });

    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
    });

    await expect(authModal.dialog).toBeHidden();
    expect(callOrder).toEqual(['deviceId', 'login']);

    const cookies = await homePage.getCookieMap();
    expect(cookies.accessToken).toBe(MOCK_TOKENS.accessToken);
    expect(cookies.refreshToken).toBe(MOCK_TOKENS.refreshToken);

    const sessionUserId = await homePage.getSessionStorageItem('userId');
    expect(sessionUserId).toBe('a7e46406-8d7d-4440-9b8a-9eadc10e71f0');
    await expect(homePage.toast(/Welcome to Race, John Doe!/)).toBeVisible();
  });

  test('29. Does NOT call /api/auth/login if /api/deviceId fails', async ({
    page,
    authModal,
  }) => {
    let loginCalled = false;
    await page.route(`${API_BASE_URL}/deviceId`, async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Device service unavailable' }),
      });
    });
    await page.route(`${API_BASE_URL}/auth/login`, async (route) => {
      loginCalled = true;
      await route.abort();
    });

    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
    });

    await expect(authModal.errorBanner).toContainText('Device service unavailable');
    expect(loginCalled).toBe(false);
  });

  test('30. Displays 409 conflict error when Sign Up email already exists', async ({
    page,
    authModal,
  }) => {
    await mockDeviceIdSuccess(page);
    await page.route(`${API_BASE_URL}/auth/signup`, async (route) => {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Email already exists. Please use a different email or log in.',
        }),
      });
    });

    await authModal.switchToSignUpButton.click();
    await authModal.signUp({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
      confirmPassword: 'Secret@123',
    });

    await expect(authModal.errorBanner).toContainText('Email already exists');
  });

  test('31. Completes Sign Up via /api/deviceId -> /api/auth/signup and stores session', async ({
    page,
    homePage,
    authModal,
  }) => {
    await mockDeviceIdSuccess(page, '+919876543210');
    await mockSignupSuccess(page);

    await authModal.switchToSignUpButton.click();
    await authModal.signUp({
      firstname: 'Ramn',
      lastname: 'Doe',
      email: 'ramn.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
      confirmPassword: 'Secret@123',
    });

    await expect(authModal.dialog).toBeHidden();
    const cookies = await homePage.getCookieMap();
    expect(cookies.accessToken).toBeTruthy();
    const userJson = await homePage.getSessionStorageItem('race_user');
    expect(userJson).toContain('Ramn Doe');
  });

  test('32. Supports selecting non-India country code (+1) as deviceId', async ({
    page,
    authModal,
  }) => {
    await mockDeviceIdSuccess(page, '+14155552671');
    await mockLoginSuccess(page);

    await authModal.signIn({
      username: 'john.doe@example.com',
      countryCode: '+1',
      phone: '4155552671',
      password: 'Secret@123',
    });

    await expect(authModal.dialog).toBeHidden();
  });

  test('33. Shows backend 401 error message on invalid login credentials', async ({
    page,
    authModal,
  }) => {
    await mockDeviceIdSuccess(page);
    await page.route(`${API_BASE_URL}/auth/login`, async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid username or password.' }),
      });
    });

    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '9876543210',
      password: 'WrongPassword',
    });

    await expect(authModal.errorBanner).toContainText('Invalid username or password.');
  });

  test('34. Sign Out clears accessToken/refreshToken cookies and sessionStorage', async ({
    page,
    homePage,
    authModal,
  }) => {
    await mockDeviceIdSuccess(page);
    await mockLoginSuccess(page);

    await authModal.signIn({
      username: 'john.doe@example.com',
      phone: '9876543210',
      password: 'Secret@123',
    });
    await expect(homePage.signOutButton).toBeVisible();

    await homePage.signOutButton.click();

    const cookies = await homePage.getCookieMap();
    expect(cookies.accessToken).toBeUndefined();
    expect(cookies.refreshToken).toBeUndefined();
    expect(await homePage.getSessionStorageItem('userId')).toBeNull();
    expect(await homePage.getSessionStorageItem('race_user')).toBeNull();
    await expect(homePage.loginButton).toBeVisible();
  });
});
