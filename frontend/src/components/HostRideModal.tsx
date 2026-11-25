import React, { useState } from 'react';
import { X, Car, PlusCircle } from 'lucide-react';
import { Ride, User } from '../types/ride';

interface HostRideModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onRequireAuth: () => void;
  onCreateRide: (ride: Ride) => void;
}

const AMENITY_OPTIONS = ['AC', 'Music', 'Instant Book', 'Luggage Space', 'EV Zero Emission'];

export const HostRideModal: React.FC<HostRideModalProps> = ({
  isOpen,
  user,
  onClose,
  onRequireAuth,
  onCreateRide,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState(today);
  const [departureTime, setDepartureTime] = useState('09:00');
  const [vehicle, setVehicle] = useState('');
  const [seats, setSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(80);
  const [category, setCategory] = useState<'commute' | 'intercity'>('commute');
  const [amenities, setAmenities] = useState<string[]>(['AC', 'Instant Book']);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const formatTime12h = (time24: string) => {
    const [hStr, mStr] = time24.split(':');
    const h = Number(hStr);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12.toString().padStart(2, '0')}:${mStr} ${suffix}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      onRequireAuth();
      return;
    }

    if (!from.trim() || !to.trim() || !vehicle.trim() || pricePerSeat <= 0) {
      setError('Please fill origin, destination, vehicle model, and a valid seat price.');
      return;
    }

    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      hostId: user.id,
      hostName: user.name,
      hostRating: 5.0,
      hostVerified: true,
      from: from.trim(),
      to: to.trim(),
      date,
      departureTime: formatTime12h(departureTime),
      duration: category === 'commute' ? '35 min' : '4h 30m',
      vehicle: vehicle.trim(),
      seatsTotal: seats,
      seatsAvailable: seats,
      pricePerSeat: Number(pricePerSeat),
      co2SavedKg: category === 'commute' ? 3.2 : 18.0,
      amenities,
      instantBook: amenities.includes('Instant Book'),
      category,
      notes: notes.trim() || undefined,
    };

    onCreateRide(newRide);
    setFrom('');
    setTo('');
    setVehicle('');
    setNotes('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="host-modal-title"
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-race-100 text-race-600">
              <Car className="h-5 w-5" />
            </span>
            <div>
              <h2 id="host-modal-title" className="text-lg font-bold text-slate-900">
                Host a Ride
              </h2>
              <p className="text-xs text-slate-500">
                Share empty seats and split your travel cost
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            aria-label="Close host modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {!user && (
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
              <span>You&apos;ll need to sign in before publishing your ride.</span>
              <button
                type="button"
                onClick={onRequireAuth}
                className="font-bold text-amber-900 underline"
              >
                Sign In
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">From</label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g. Madhapur"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">To</label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g. Gachibowli"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Departure Time
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Ride Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'commute' | 'intercity')}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              >
                <option value="commute">Daily Commute</option>
                <option value="intercity">Intercity</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Seats Available
              </label>
              <select
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              >
                {[1, 2, 3, 4, 5, 6].map((s) => (
                  <option key={s} value={s}>
                    {s} {s === 1 ? 'Seat' : 'Seats'}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Price / Seat (₹)
              </label>
              <input
                type="number"
                min={10}
                value={pricePerSeat}
                onChange={(e) => setPricePerSeat(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Vehicle Model
              </label>
              <input
                type="text"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                placeholder="e.g. Swift Dzire"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Amenities &amp; Preferences
            </label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((item) => {
                const selected = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      selected
                        ? 'border-race-500 bg-race-50 text-race-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Pickup / Route Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Starting from Metro Pillar 175, punctual departure."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-race-500"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-race-500 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-race-600 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Publish Ride</span>
          </button>
        </form>
      </div>
    </div>
  );
};
