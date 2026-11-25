import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Star,
  ShieldCheck,
  Leaf,
  Clock,
  Car,
  Zap,
  X,
  CheckCircle2,
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockRides';
import { Ride, User } from '../types/ride';

interface BookRideSectionProps {
  rides: Ride[];
  user: User | null;
  onRequireAuth: () => void;
  onConfirmBooking: (ride: Ride, seats: number, pickupNote: string) => void;
  onOpenHostModal: () => void;
}

export const BookRideSection: React.FC<BookRideSectionProps> = ({
  rides,
  user,
  onRequireAuth,
  onConfirmBooking,
  onOpenHostModal,
}) => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'commute' | 'intercity'>('all');
  const [instantOnly, setInstantOnly] = useState(false);

  // Booking confirmation modal state
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [pickupNote, setPickupNote] = useState('');

  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (ride.seatsAvailable < seatsNeeded) return false;
      if (fromQuery && !ride.from.toLowerCase().includes(fromQuery.toLowerCase())) return false;
      if (toQuery && !ride.to.toLowerCase().includes(toQuery.toLowerCase())) return false;
      if (dateQuery && ride.date !== dateQuery) return false;
      if (categoryFilter !== 'all' && ride.category !== categoryFilter) return false;
      if (instantOnly && !ride.instantBook) return false;
      return true;
    });
  }, [rides, fromQuery, toQuery, dateQuery, seatsNeeded, categoryFilter, instantOnly]);

  const handleOpenBook = (ride: Ride) => {
    if (!user) {
      onRequireAuth();
      return;
    }
    setSelectedRide(ride);
    setBookingSeats(Math.min(seatsNeeded, ride.seatsAvailable));
    setPickupNote('');
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRide) return;
    onConfirmBooking(selectedRide, bookingSeats, pickupNote);
    setSelectedRide(null);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
  };

  const clearFilters = () => {
    setFromQuery('');
    setToQuery('');
    setDateQuery('');
    setSeatsNeeded(1);
    setCategoryFilter('all');
    setInstantOnly(false);
  };

  return (
    <section id="book-ride" className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-10 pb-16">
      {/* Floating Search Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Find &amp; Book a Ride</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Search verified daily carpools or intercity rides near you
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenHostModal}
            className="text-xs sm:text-sm font-semibold text-race-600 hover:text-race-700 underline underline-offset-4"
          >
            Driving somewhere? Host a ride →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-race-500" />
            <input
              type="text"
              value={fromQuery}
              onChange={(e) => setFromQuery(e.target.value)}
              placeholder="Leaving from..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-race-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={toQuery}
              onChange={(e) => setToQuery(e.target.value)}
              placeholder="Going to..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-race-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={dateQuery}
              onChange={(e) => setDateQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-race-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={seatsNeeded}
              onChange={(e) => setSeatsNeeded(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-race-500 focus:bg-white"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Seat' : 'Seats'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            <Search className="h-4 w-4" />
            <span>{fromQuery || toQuery || dateQuery ? 'Reset Search' : 'Search Rides'}</span>
          </button>
        </div>

        {/* Filter Chips & Quick Routes */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'commute', 'intercity'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                  categoryFilter === cat
                    ? 'bg-race-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Rides' : cat === 'commute' ? 'Daily Commute' : 'Intercity'}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setInstantOnly((v) => !v)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition ${
                instantOnly
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap className="h-3 w-3" />
              <span>Instant Book</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Quick:</span>
            {POPULAR_ROUTES.slice(0, 3).map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                type="button"
                onClick={() => handleQuickRoute(r.from, r.to)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:border-race-400 hover:text-race-700 transition"
              >
                {r.from} → {r.to}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Rides List */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Available Rides ({filteredRides.length})
          </h3>
          {!user && (
            <span className="text-xs text-slate-500">
              Sign in when ready to confirm your seat
            </span>
          )}
        </div>

        {filteredRides.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <p className="text-base font-semibold text-slate-800">No rides match your filters</p>
            <p className="mt-1 text-sm text-slate-500">
              Try clearing your filters or host this route yourself!
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Clear Filters
              </button>
              <button
                type="button"
                onClick={onOpenHostModal}
                className="rounded-xl bg-race-500 px-4 py-2 text-sm font-semibold text-white hover:bg-race-600"
              >
                Host This Ride
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredRides.map((ride) => (
              <div
                key={ride.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-race-300 hover:shadow-md transition"
              >
                <div>
                  {/* Top Route & Price */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                        <span>{ride.from}</span>
                        <span className="text-race-500">→</span>
                        <span>{ride.to}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {ride.departureTime} ({ride.duration})
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {ride.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-extrabold text-race-600">
                        ₹{ride.pricePerSeat}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400">per seat</div>
                    </div>
                  </div>

                  {/* Host & Vehicle */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-race-100 text-sm font-bold text-race-700">
                        {ride.hostName.charAt(0)}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                          <span>{ride.hostName}</span>
                          {ride.hostVerified && (
                            <span title="Verified Host">
                              <ShieldCheck className="h-4 w-4 text-race-500" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-0.5 font-semibold text-amber-600">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {ride.hostRating.toFixed(1)}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <Car className="h-3 w-3" />
                            {ride.vehicle}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          ride.seatsAvailable > 1
                            ? 'bg-race-100 text-race-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ride.seatsAvailable} {ride.seatsAvailable === 1 ? 'seat' : 'seats'} left
                      </span>
                    </div>
                  </div>

                  {ride.notes && (
                    <p className="mt-3 text-xs text-slate-600 line-clamp-2">{ride.notes}</p>
                  )}
                </div>

                {/* Amenities & CTA */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ride.amenities.map((item) => (
                      <span
                        key={item}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {item}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      <Leaf className="h-3 w-3" />
                      {ride.co2SavedKg}kg CO₂ saved
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBook(ride)}
                    className="rounded-xl bg-race-500 px-4 py-2 text-xs sm:text-sm font-bold text-white hover:bg-race-600 transition shadow-sm"
                  >
                    Book Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {selectedRide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Confirm Your Seat</h3>
              <button
                type="button"
                onClick={() => setSelectedRide(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirm} className="mt-4 space-y-4">
              <div className="rounded-xl bg-race-50 p-3.5 text-sm">
                <div className="font-bold text-slate-900">
                  {selectedRide.from} → {selectedRide.to}
                </div>
                <div className="mt-1 text-xs text-slate-600">
                  {selectedRide.date} at {selectedRide.departureTime} • Host: {selectedRide.hostName}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Seats to Book
                </label>
                <select
                  value={bookingSeats}
                  onChange={(e) => setBookingSeats(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
                >
                  {Array.from({ length: selectedRide.seatsAvailable }, (_, i) => i + 1).map(
                    (num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Seat' : 'Seats'}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Pickup Point Note (Optional)
                </label>
                <input
                  type="text"
                  value={pickupNote}
                  onChange={(e) => setPickupNote(e.target.value)}
                  placeholder="e.g. Near Main Metro Gate"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-600">Total Fare</span>
                <span className="text-lg font-extrabold text-race-600">
                  ₹{selectedRide.pricePerSeat * bookingSeats}
                </span>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-race-500 py-2.5 text-sm font-bold text-white hover:bg-race-600 transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Confirm Booking</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
