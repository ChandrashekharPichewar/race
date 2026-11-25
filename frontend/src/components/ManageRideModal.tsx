import React, { useState } from 'react';
import { X, Ticket, Car, Trash2, PlusCircle } from 'lucide-react';
import { Booking, Ride, User } from '../types/ride';

interface ManageRideModalProps {
  isOpen: boolean;
  user: User | null;
  bookings: Booking[];
  hostedRides: Ride[];
  onClose: () => void;
  onRequireAuth: () => void;
  onCancelBooking: (bookingId: string) => void;
  onDeleteHostedRide: (rideId: string) => void;
  onOpenHostModal: () => void;
}

export const ManageRideModal: React.FC<ManageRideModalProps> = ({
  isOpen,
  user,
  bookings,
  hostedRides,
  onClose,
  onRequireAuth,
  onCancelBooking,
  onDeleteHostedRide,
  onOpenHostModal,
}) => {
  const [tab, setTab] = useState<'bookings' | 'hosted'>('bookings');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-modal-title"
    >
      <div className="relative max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id="manage-modal-title" className="text-lg font-bold text-slate-900">
              Manage Your Rides
            </h2>
            <p className="text-xs text-slate-500">
              View your booked seats and rides you&apos;re hosting
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            aria-label="Close manage modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-100 px-6 pt-3">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setTab('bookings')}
              className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
                tab === 'bookings'
                  ? 'border-race-500 text-race-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Ticket className="h-4 w-4" />
              <span>My Bookings ({bookings.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('hosted')}
              className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
                tab === 'hosted'
                  ? 'border-race-500 text-race-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Car className="h-4 w-4" />
              <span>My Hosted Rides ({hostedRides.length})</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!user ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm font-semibold text-slate-800">
                Sign in to view and manage your rides
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Your booked seats and hosted rides are synced to your account.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequireAuth();
                }}
                className="mt-4 rounded-xl bg-race-500 px-5 py-2 text-sm font-bold text-white hover:bg-race-600"
              >
                Sign In / Sign Up
              </button>
            </div>
          ) : tab === 'bookings' ? (
            bookings.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm font-semibold text-slate-700">No bookings yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Browse available rides on the landing page and reserve a seat.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {b.rideSnapshot.from} → {b.rideSnapshot.to}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            b.status === 'confirmed'
                              ? 'bg-race-100 text-race-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {b.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {b.rideSnapshot.date} at {b.rideSnapshot.departureTime} • Host:{' '}
                        {b.rideSnapshot.hostName} ({b.rideSnapshot.vehicle})
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-700">
                        {b.seatsBooked} {b.seatsBooked === 1 ? 'seat' : 'seats'} • Total: ₹
                        {b.totalFare}
                        {b.pickupNote ? ` • Note: ${b.pickupNote}` : ''}
                      </p>
                    </div>

                    {b.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => onCancelBooking(b.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenHostModal();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-race-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-race-600"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Host New Ride</span>
                </button>
              </div>

              {hostedRides.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    You haven&apos;t hosted any rides yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Share your next commute or highway trip to earn and save fuel!
                  </p>
                </div>
              ) : (
                hostedRides.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {r.from} → {r.to}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {r.date} at {r.departureTime} • {r.vehicle}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-race-700">
                        {r.seatsAvailable}/{r.seatsTotal} seats left • ₹{r.pricePerSeat}/seat
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteHostedRide(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
