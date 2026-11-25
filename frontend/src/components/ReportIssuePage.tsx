import React, { useState } from 'react';
import {
  FilePenLine,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Ticket,
} from 'lucide-react';
import { User } from '../types/ride';
import { submitIssueReport } from '../services/supportService';

interface ReportIssuePageProps {
  user: User | null;
  onBackHome: () => void;
  onViewTickets: () => void;
  onSubmitted: (ticketCode: string) => void;
}

const ISSUE_TYPES = [
  'Ride Booking / Cancellation',
  'Payment / Refund Issue',
  'Driver / Host Behavior',
  'Guest / Co-Rider Behavior',
  'Safety Concern',
  'Lost Item in Vehicle',
  'App / Technical Bug',
  'Account / Verification Issue',
  'Other',
];

const URGENCY_LEVELS = [
  'Low — General question or minor feedback',
  'Medium — Needs attention within 24–48 hours',
  'High — Impacts an upcoming or recent ride',
  'Critical — Urgent safety or payment issue',
];

export const ReportIssuePage: React.FC<ReportIssuePageProps> = ({
  user,
  onBackHome,
  onViewTickets,
  onSubmitted,
}) => {
  const [issueType, setIssueType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [briefDescription, setBriefDescription] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedTicketCode, setSubmittedTicketCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!issueType) {
      setError('Please select what type of issue this is.');
      return;
    }
    if (!urgency) {
      setError('Please select how urgent this issue is.');
      return;
    }
    if (!briefDescription.trim()) {
      setError('Please provide a brief description of the issue.');
      return;
    }
    if (!details.trim()) {
      setError('Please tell us what happened.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitIssueReport({
        issueType,
        urgency,
        briefDescription: briefDescription.trim(),
        details: details.trim(),
        deviceId: user?.deviceId,
      });

      const ticketCode = response.ticket.ticketCode;
      setSubmittedTicketCode(ticketCode);
      onSubmitted(ticketCode);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to submit issue report. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIssueType('');
    setUrgency('');
    setBriefDescription('');
    setDetails('');
    setError('');
    setSubmittedTicketCode(null);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-orange-50/40 via-white to-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Top Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={onViewTickets}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-orange-300 hover:text-orange-600 transition"
          >
            <Ticket className="h-3.5 w-3.5" />
            <span>My Support Tickets</span>
          </button>
        </div>

        {/* Page Title & Subtitle matching reference */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-2.5">
            <FilePenLine className="h-7 w-7 text-orange-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Report an Issue
            </h1>
          </div>
          <p className="mx-auto mt-2.5 max-w-lg text-sm text-slate-600">
            Facing a problem? Please fill out the form below and our support team
            will get back to you within 24–48 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
          {submittedTicketCode ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">
                Issue Report Submitted
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Thank you{user?.name ? `, ${user.name}` : ''}. Your ticket{' '}
                <span className="font-bold text-slate-900">{submittedTicketCode}</span>{' '}
                has been saved. Our support team will respond within 24–48 hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={onViewTickets}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition"
                >
                  <Ticket className="h-4 w-4" />
                  <span>View My Support Tickets</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Submit Another Issue
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
                  {error}
                </div>
              )}

              {/* Issue Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  What type of issue is this? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={issueType}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setIssueType(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 disabled:bg-slate-50 ${
                      issueType ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {ISSUE_TYPES.map((type) => (
                      <option key={type} value={type} className="text-slate-900">
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  How urgent is this? <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={urgency}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setUrgency(e.target.value);
                      if (error) setError('');
                    }}
                    className={`w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 disabled:bg-slate-50 ${
                      urgency ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {URGENCY_LEVELS.map((level) => (
                      <option key={level} value={level} className="text-slate-900">
                        {level}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Brief description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Brief description of the issue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSubmitting}
                  value={briefDescription}
                  onChange={(e) => {
                    setBriefDescription(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Brief description of the issue"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 disabled:bg-slate-50"
                />
              </div>

              {/* Tell us what happened */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Tell us what happened <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  disabled={isSubmitting}
                  value={details}
                  onChange={(e) => {
                    setDetails(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Tell us what happened"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 disabled:bg-slate-50"
                />
              </div>

              {/* Before you submit callout */}
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-4 py-3.5">
                <div className="flex items-start gap-2.5 text-sm text-slate-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <span className="font-semibold">Before you submit:</span>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Include your ride route, date, or booking ID if applicable so our
                      team can investigate and resolve your issue faster.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 transition"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting Issue Report...</span>
                  </>
                ) : (
                  <span>Submit Issue Report</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
