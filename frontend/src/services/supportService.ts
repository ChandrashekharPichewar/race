import { getAuthToken } from './authService';

const API_BASE_URL = 'https://my-app-backend-4lw0.onrender.com/api';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface SupportTicket {
  id: string;
  ticketCode: string;
  userId?: string;
  issueType: string;
  urgency: string;
  briefDescription: string;
  details?: string;
  status: TicketStatus;
  adminReply?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ReportIssuePayload {
  issueType: string;
  urgency: string;
  briefDescription: string;
  details: string;
  deviceId?: string;
}

export interface ReportIssueResponse {
  message: string;
  ticket: SupportTicket;
}

export interface SupportTicketsSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}

export interface SupportTicketsResponse {
  summary: SupportTicketsSummary;
  tickets: SupportTicket[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const buildAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Unauthorized. Please sign in to continue.');
  }
  return {
    accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const extractError = async (response: Response, fallback: string) => {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error || data.message || fallback;
  } catch {
    return fallback;
  }
};

export const submitIssueReport = async (
  payload: ReportIssuePayload
): Promise<ReportIssueResponse> => {
  const response = await fetch(`${API_BASE_URL}/support/report-issue`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const msg = await extractError(
      response,
      `Failed to submit issue report (${response.status}).`
    );
    throw new Error(msg);
  }

  return (await response.json()) as ReportIssueResponse;
};

export const fetchMySupportTickets = async (
  params?: {
    status?: string;
    page?: number;
    limit?: number;
  },
  signal?: AbortSignal
): Promise<SupportTicketsResponse> => {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  const url = `${API_BASE_URL}/support/my-tickets${qs ? `?${qs}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: buildAuthHeaders(),
    signal,
  });

  if (!response.ok) {
    const msg = await extractError(
      response,
      `Failed to fetch support tickets (${response.status}).`
    );
    throw new Error(msg);
  }

  const raw = (await response.json()) as Partial<SupportTicketsResponse>;
  const tickets = Array.isArray(raw.tickets) ? raw.tickets : [];

  const summary: SupportTicketsSummary = raw.summary ?? {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'OPEN').length,
    inProgress: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter((t) => t.status === 'RESOLVED').length,
  };

  const pagination = raw.pagination ?? {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
    totalItems: tickets.length,
    totalPages: 1,
  };

  return { summary, tickets, pagination };
};
