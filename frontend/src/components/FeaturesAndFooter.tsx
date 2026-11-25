import React, { useState } from 'react';
import {
  ShieldCheck,
  Leaf,
  Wallet,
  Clock,
  ArrowRight,
  Navigation,
  Users,
  Car,
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockRides';

interface FeaturesAndFooterProps {
  onSelectRoute: (from: string, to: string) => void;
  onOpenHostModal: () => void;
}

export const FeaturesAndFooter: React.FC<FeaturesAndFooterProps> = ({
  onSelectRoute,
  onOpenHostModal,
}) => {
  const [dailyKm, setDailyKm] = useState(25);
  const [daysPerWeek, setDaysPerWeek] = useState(5);

  const monthlySavings = Math.round(dailyKm * 2 * daysPerWeek * 4 * 4.5);
  const monthlyCo2Kg = Math.round(dailyKm * 2 * daysPerWeek * 4 * 0.14);

  return (
    <>
      {/* How It Works: For Guest & For Hosts */}
      <section id="how-it-works" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-race-100 px-3 py-1 text-xs font-bold text-race-700">
              Simple &amp; Reliable
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Built for both Daily Guests &amp; Verified Hosts
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Whether you need a comfortable morning commute or want to share empty seats on your
              drive, Race makes it effortless.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* For Guest */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-race-500 text-white">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Guests (Riders)</h3>
                  <p className="text-xs text-slate-500">Affordable, verified, door-to-door</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Verified hosts with ratings, car details, and live seat counts.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Wallet className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Up to 60% cheaper than solo cabs with transparent per-seat fares.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Instant Book option for zero-wait morning office commutes.</span>
                </li>
              </ul>
              <a
                href="#book-ride"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-race-600 hover:text-race-700"
              >
                <span>Browse available rides</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* For Hosts */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Car className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Hosts (Car Owners)</h3>
                  <p className="text-xs text-slate-500">Offset fuel costs &amp; drive with company</p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <Wallet className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Publish your route in 30 seconds and set your own per-seat price.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Choose co-riders along your exact route with pickup notes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Leaf className="h-5 w-5 shrink-0 text-race-500" />
                  <span>Reduce city traffic congestion and track your monthly CO₂ impact.</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={onOpenHostModal}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-race-600 hover:text-race-700"
              >
                <span>Host a ride now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Commute Carpool Savings & Eco Impact Calculator */}
      <section id="commute-impact" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 rounded-3xl bg-gradient-to-br from-[#0e2d1d] to-[#17462d] p-8 sm:p-10 text-white shadow-xl">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-race-100">
                <Leaf className="h-3.5 w-3.5 text-race-400" />
                <span>Commute Carpool Calculator</span>
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">
                See how much you save every month with Race
              </h2>
              <p className="mt-2 text-sm text-slate-200">
                Adjust your one-way commute distance and weekly office days to estimate your
                monthly savings and carbon footprint reduction.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span>One-way commute distance</span>
                    <span className="text-race-400">{dailyKm} km</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={80}
                    value={dailyKm}
                    onChange={(e) => setDailyKm(Number(e.target.value))}
                    className="w-full accent-race-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span>Commute days per week</span>
                    <span className="text-race-400">{daysPerWeek} days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                    className="w-full accent-race-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Est. Monthly Savings
                </p>
                <p className="mt-2 text-3xl font-extrabold text-race-400">
                  ₹{monthlySavings.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-slate-300">vs. solo cab / fuel spend</p>
              </div>

              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm border border-white/15">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  CO₂ Prevented
                </p>
                <p className="mt-2 text-3xl font-extrabold text-white">{monthlyCo2Kg} kg</p>
                <p className="mt-1 text-xs text-slate-300">per month of shared rides</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rides */}
      <section id="popular-rides" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Popular Rides</h2>
              <p className="text-sm text-slate-500">
                Click any corridor to filter live rides immediately
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {POPULAR_ROUTES.map((route) => (
              <button
                key={`${route.from}-${route.to}`}
                type="button"
                onClick={() => onSelectRoute(route.from, route.to)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-race-400 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-race-50 px-2.5 py-0.5 text-xs font-bold text-race-700">
                    {route.ridesCount} daily rides
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-race-500 group-hover:translate-x-0.5 transition" />
                </div>
                <div className="mt-3 text-base font-bold text-slate-900">
                  {route.from} → {route.to}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Avg. fare <span className="font-bold text-slate-800">₹{route.avgPrice}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-race-500 text-white">
              <Navigation className="h-3.5 w-3.5 fill-current rotate-45" />
            </span>
            <span className="text-lg font-extrabold text-slate-900">Race</span>
            <span className="text-xs text-slate-500">• Daily Commute &amp; Ride Sharing</span>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Race Ridesharing App. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
};
