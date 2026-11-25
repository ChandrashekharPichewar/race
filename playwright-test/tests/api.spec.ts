import { test, expect } from '../fixtures/raceFixtures';
import { envConfig } from '../config/env';

const RUN_LIVE_API = envConfig.runLiveApi;

test.describe('Backend API Contract & Integration Tests', { tag: ['@api', '@regression'] }, () => {
  test('51. POST /api/deviceId saves deviceID and returns 200', async ({ authApi }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await authApi.registerDeviceId('+919876543210');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.message).toBe('Successfully saved');
    expect(body.deviceID).toBe('+919876543210');
  });

  test('52. POST /api/deviceId rejects empty body with 4xx', async ({ authApi }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await authApi.registerDeviceId('');
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('53. POST /api/auth/signup returns 409 for duplicate email', async ({ authApi }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await authApi.signup({
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    expect(res.status()).toBe(409);
    const body = await res.json();
    expect(body.error).toContain('Email already exists');
  });

  test('54. POST /api/auth/signup creates a new user and returns 201 with JWT tokens', async ({
    authApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const uniqueEmail = `race.user.${Date.now()}@example.com`;
    const res = await authApi.signup({
      firstname: 'Test',
      lastname: 'Rider',
      email: uniqueEmail,
      password: 'Secret@123',
      deviceId: '+919876543210',
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('userId');
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body.firstname).toBe('Test');
  });

  test('55. POST /api/auth/login returns 200 with userId, accessToken, refreshToken', async ({
    authApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await authApi.login({
      username: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.userId).toBeTruthy();
    expect(body.accessToken).toBeTruthy();
    expect(body.refreshToken).toBeTruthy();
  });

  test('56. POST /api/auth/login rejects invalid password with 401', async ({ authApi }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await authApi.login({
      username: 'john.doe@example.com',
      password: 'WrongPassword123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    expect(res.status()).toBe(401);
  });

  test('57. POST /api/support/report-issue rejects unauthenticated requests with 401', async ({
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await supportApi.reportIssue({
      issueType: 'Safety Concern',
      urgency: 'High',
      briefDescription: 'Test',
      details: 'Test details',
    });
    expect(res.status()).toBe(401);
  });

  test('58. GET /api/support/my-tickets rejects unauthenticated requests with 401', async ({
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const res = await supportApi.getMyTickets();
    expect(res.status()).toBe(401);
  });

  test('59. POST /api/support/report-issue creates ticket when valid Bearer token provided', async ({
    authApi,
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const loginRes = await authApi.login({
      username: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    const { accessToken } = await loginRes.json();

    const res = await supportApi.reportIssue(
      {
        issueType: 'Payment / Refund Issue',
        urgency: 'Medium — Needs attention within 24–48 hours',
        briefDescription: 'Playwright API test ticket',
        details: 'Automated verification of ticket creation.',
      },
      accessToken
    );
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.ticket).toHaveProperty('ticketCode');
    expect(body.ticket.status).toBe('OPEN');
  });

  test('60. POST /api/support/report-issue returns 400 when required fields are missing', async ({
    authApi,
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const loginRes = await authApi.login({
      username: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    const { accessToken } = await loginRes.json();

    const res = await supportApi.reportIssue(
      { issueType: 'Safety Concern' },
      accessToken
    );
    expect(res.status()).toBe(400);
  });

  test('61. GET /api/support/my-tickets returns tickets array for authenticated user', async ({
    authApi,
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const loginRes = await authApi.login({
      username: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    const { accessToken } = await loginRes.json();

    const res = await supportApi.getMyTickets(
      { status: 'ALL', page: 1, limit: 10 },
      accessToken
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.tickets)).toBe(true);
  });

  test('62. GET /api/support/my-tickets filters by status=OPEN', async ({
    authApi,
    supportApi,
  }) => {
    test.skip(!RUN_LIVE_API, 'Set RUN_LIVE_API=true to hit live Render backend');
    const loginRes = await authApi.login({
      username: 'john.doe@example.com',
      password: 'Secret@123',
      deviceId: 'device-ios-9f8c2a1b',
    });
    const { accessToken } = await loginRes.json();

    const res = await supportApi.getMyTickets({ status: 'OPEN' }, accessToken);
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const ticket of body.tickets) {
      expect(ticket.status).toBe('OPEN');
    }
  });

  test('63. Authenticated UI flow verifies Host a Ride modal adds a new ride to list', async ({
    authenticatedPage,
    homePage,
  }) => {
    await homePage.goto('/');
    await homePage.openHostModalFromHero();

    const dialog = authenticatedPage.getByRole('dialog');
    await dialog.getByPlaceholder('e.g. Madhapur').fill('Kondapur');
    await dialog.getByPlaceholder('e.g. Gachibowli').fill('Airport');
    await dialog.getByPlaceholder('e.g. Swift Dzire').fill('Toyota Innova');
    await dialog.getByRole('button', { name: 'Publish Ride' }).click();

    await expect(homePage.toast(/Ride published: Kondapur → Airport/)).toBeVisible();
    await expect(authenticatedPage.locator('#book-ride')).toContainText('Toyota Innova');
  });

  test('64. Authenticated UI flow books a seat and updates Manage Ride bookings count', async ({
    authenticatedPage,
    homePage,
  }) => {
    await homePage.goto('/');
    await homePage.clickBookSeatOnFirstRide();

    const dialog = authenticatedPage.getByRole('dialog');
    await expect(dialog.getByRole('heading', { name: 'Confirm Your Seat' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Confirm Booking' }).click();

    await expect(homePage.toast(/Booked 1 seat/)).toBeVisible();
    await expect(homePage.manageRideButton).toContainText('1');
  });
});
