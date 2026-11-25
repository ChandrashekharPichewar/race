import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Ticket,
  PlusCircle,
  RefreshCw,
  Loader2,
  MessageSquareText,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  fetchMySupportTickets,
  SupportTicket,
  SupportTicketsSummary,
  TicketStatus,
} from '../services/supportService';

interface SupportTicketsPageProps {
  onBackHome: () => void;
  onReportNewIssue: () => void;
}

const STATUS_FILTERS: Array<{ label: string; value: 'ALL' | TicketStatus }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved', value: 'RESOLVED' },
  { label: 'Closed', value: 'CLOSED' },
];

const STATUS_BADGE_STYLES: Record<TicketStatus, string> = {
  OPEN: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const SupportTicketsPage: React.FC<SupportTicketsPageProps> = ({
  onBackHome,
  onReportNewIssue,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | TicketStatus>('ALL');
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [summary, setSummary] = useState<SupportTicketsSummary>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setError('');
      try {
        const data = await fetchMySupportTickets(
          {
            status: statusFilter,
            page,
            limit: 10,
          },
          signal
        );
        setTickets(data.tickets);
        setSummary(data.summary);
        setTotalPages(Math.max(1, data.pagination.totalPages));
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load support tickets.';
        setError(message);
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [statusFilter, page]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadTickets(controller.signal);
    return () => controller.abort();
  }, [loadTickets]);

  const handleStatusChange = (nextStatus: 'ALL' | TicketStatus) => {
    setStatusFilter(nextStatus);
    setPage(1);
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch {
      return iso;
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={onBackHome}
              className="mb-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Ticket className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  My Support Tickets
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Track status updates and replies from the Race support team
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => void loadTickets()}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onReportNewIssue}
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-orange-600 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Report an Issue</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-500">Total Tickets</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-amber-700">Open</p>
            <p className="mt-1 text-2xl font-extrabold text-amber-900">{summary.open}</p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-blue-700">In Progress</p>
            <p className="mt-1 text-2xl font-extrabold text-blue-900">{summary.inProgress}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-700">Resolved</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-900">{summary.resolved}</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleStatusChange(item.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === item.value
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Tickets Content */}
        <div className="mt-5">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-slate-500">
              <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
              <p className="mt-3 text-sm font-medium">Loading your support tickets...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <AlertCircle className="mx-auto h-7 w-7 text-red-500" />
              <p className="mt-2 text-sm font-semibold text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => void loadTickets()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Ticket className="mx-auto h-9 w-9 text-slate-300" />
              <h2 className="mt-3 text-base font-bold text-slate-800">
                No support tickets found
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                {statusFilter === 'ALL'
                  ? "You haven't submitted any issue reports yet."
                  : `No tickets with status "${statusFilter.replace('_', ' ')}".`}
              </p>
              <button
                type="button"
                onClick={onReportNewIssue}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Report an Issue</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-xs font-extrabold text-slate-800">
                          {ticket.ticketCode}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                            STATUS_BADGE_STYLES[ticket.status] ??
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {ticket.issueType}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-slate-900">
                        {ticket.briefDescription}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>

                  {ticket.details && (
                    <p className="mt-2 text-sm text-slate-600">{ticket.details}</p>
                  )}

                  <div className="mt-3 text-xs font-medium text-slate-500">
                    Urgency: <span className="text-slate-700">{ticket.urgency}</span>
                  </div>

                  {ticket.adminReply && (
                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        <span>Support Team Reply</span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-emerald-900">
                        {ticket.adminReply}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-semibold text-slate-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
