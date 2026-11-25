import { APIRequestContext, APIResponse } from '@playwright/test';
import { envConfig } from '../config/env';

export interface ReportIssueRequest {
  issueType?: string;
  urgency?: string;
  briefDescription?: string;
  details?: string;
  deviceId?: string;
}

export class SupportApiClient {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl = envConfig.apiBaseUrl) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  reportIssue(
    payload: ReportIssueRequest,
    accessToken?: string
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/support/report-issue`, {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
      data: payload,
    });
  }

  getMyTickets(
    params?: { status?: string; page?: number; limit?: number },
    accessToken?: string
  ): Promise<APIResponse> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    const qs = query.toString();

    return this.request.get(
      `${this.baseUrl}/support/my-tickets${qs ? `?${qs}` : ''}`,
      {
        headers: accessToken
          ? { Authorization: `Bearer ${accessToken}` }
          : undefined,
      }
    );
  }
}
