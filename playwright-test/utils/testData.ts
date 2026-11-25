import { Page } from '@playwright/test';
import { envConfig } from '../config/env';

export const API_BASE_URL = envConfig.apiBaseUrl;

export const MOCK_TOKENS = {
  accessToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhN2U0NjQwNi04ZDdkLTQ0NDAtOWI4YS05ZWFkYzEwZTcxZjAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImFjY2VzcyJ9.mockSignature',
  refreshToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhN2U0NjQwNi04ZDdkLTQ0NDAtOWI4YS05ZWFkYzEwZTcxZjAiLCJ0eXBlIjoicmVmcmVzaCJ9.mockRefreshSignature',
};

export const MOCK_USER = {
  id: 'a7e46406-8d7d-4440-9b8a-9eadc10e71f0',
  userId: 'a7e46406-8d7d-4440-9b8a-9eadc10e71f0',
  firstname: 'John',
  lastname: 'Doe',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  deviceId: '+919876543210',
  role: 'both',
};

export const MOCK_TICKETS = [
  {
    id: 'afeae52f-c5d3-4de0-912f-38f04a2060e6',
    ticketCode: 'RACE-670731',
    issueType: 'Payment / Refund Issue',
    urgency: 'Low — General question or minor feedback',
    briefDescription: 'Duplicate UPI charge for morning commute',
    details: 'Paid twice via UPI for ride-101 from Gachibowli to HITEC City.',
    status: 'OPEN',
    adminReply: null,
    createdAt: '2026-11-25T20:12:50.596Z',
  },
  {
    id: '9f2d7c10-3a44-4b88-8c21-112233445566',
    ticketCode: 'RACE-391044',
    issueType: 'Ride Booking / Cancellation',
    urgency: 'High — Impacts an upcoming or recent ride',
    briefDescription: 'Host cancelled 5 minutes before pickup',
    details: 'Need urgent reassignment or refund for my morning office commute.',
    status: 'IN_PROGRESS',
    adminReply: 'We are reviewing your trip log with the host.',
    createdAt: '2026-11-24T09:15:00.000Z',
  },
  {
    id: '4c1b2a90-1122-4455-8899-aabbccddeeff',
    ticketCode: 'RACE-220198',
    issueType: 'Lost Item in Vehicle',
    urgency: 'Medium — Needs attention within 24–48 hours',
    briefDescription: 'Left umbrella in Hyundai Creta',
    details: 'Left a black folding umbrella on the back seat.',
    status: 'RESOLVED',
    adminReply: 'Host confirmed item was returned at DLF Gate 2.',
    createdAt: '2026-11-22T14:20:00.000Z',
  },
];

export async function mockDeviceIdSuccess(page: Page, expectedDeviceId?: string) {
  await page.route(`${API_BASE_URL}/deviceId`, async (route) => {
    const body = route.request().postDataJSON() as { deviceID?: string } | null;
    if (expectedDeviceId && body?.deviceID !== expectedDeviceId) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid deviceID' }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Successfully saved',
        deviceID: body?.deviceID ?? '+919876543210',
      }),
    });
  });
}

export async function mockLoginSuccess(page: Page) {
  await page.route(`${API_BASE_URL}/auth/login`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: MOCK_USER.userId,
        accessToken: MOCK_TOKENS.accessToken,
        refreshToken: MOCK_TOKENS.refreshToken,
        firstname: MOCK_USER.firstname,
        lastname: MOCK_USER.lastname,
      }),
    });
  });
}

export async function mockSignupSuccess(page: Page) {
  await page.route(`${API_BASE_URL}/auth/signup`, async (route) => {
    const body = route.request().postDataJSON() as {
      firstname?: string;
      lastname?: string;
    } | null;
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        userId: '8a5ecf46-9466-4728-b837-ddc31ed7c4d6',
        accessToken: MOCK_TOKENS.accessToken,
        refreshToken: MOCK_TOKENS.refreshToken,
        firstname: body?.firstname ?? 'John',
        lastname: body?.lastname ?? 'Doe',
      }),
    });
  });
}

export async function mockReportIssueSuccess(page: Page) {
  await page.route(`${API_BASE_URL}/support/report-issue`, async (route) => {
    const body = route.request().postDataJSON() as Record<string, string>;
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Issue report submitted successfully',
        ticket: {
          id: 'c4b1e8a2-7f3d-4c11-9b5a-2e8d910f3a12',
          ticketCode: 'RACE-482910',
          userId: MOCK_USER.userId,
          issueType: body.issueType,
          urgency: body.urgency,
          briefDescription: body.briefDescription,
          details: body.details,
          status: 'OPEN',
          createdAt: '2026-11-26T01:30:00.000Z',
        },
      }),
    });
  });
}

export async function mockMyTicketsSuccess(
  page: Page,
  options?: { omitSummary?: boolean; empty?: boolean; totalPages?: number }
) {
  await page.route(`${API_BASE_URL}/support/my-tickets*`, async (route) => {
    const url = new URL(route.request().url());
    const status = url.searchParams.get('status') ?? 'ALL';
    const pageNum = Number(url.searchParams.get('page') ?? '1');

    const source = options?.empty ? [] : MOCK_TICKETS;
    const filtered =
      status === 'ALL' ? source : source.filter((t) => t.status === status);

    const payload: Record<string, unknown> = {
      tickets: filtered,
    };

    if (!options?.omitSummary) {
      payload.summary = {
        total: source.length,
        open: source.filter((t) => t.status === 'OPEN').length,
        inProgress: source.filter((t) => t.status === 'IN_PROGRESS').length,
        resolved: source.filter((t) => t.status === 'RESOLVED').length,
      };
      payload.pagination = {
        page: pageNum,
        limit: 10,
        totalItems: filtered.length,
        totalPages: options?.totalPages ?? 1,
      };
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(payload),
    });
  });
}

export async function seedAuthenticatedSession(page: Page) {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: MOCK_TOKENS.accessToken,
      url: envConfig.baseUrl,
    },
    {
      name: 'refreshToken',
      value: MOCK_TOKENS.refreshToken,
      url: envConfig.baseUrl,
    },
  ]);

  await page.addInitScript((user) => {
    window.sessionStorage.setItem('race_user', JSON.stringify(user));
    window.sessionStorage.setItem('userId', user.userId);
  }, MOCK_USER);
}
