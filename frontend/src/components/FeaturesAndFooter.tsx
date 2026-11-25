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
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { POPULAR_ROUTES } from '../data/mockRides';

interface FeaturesAndFooterProps {
  onSelectRoute: (from: string, to: string) => void;
  onOpenHostModal: () => void;
  onOpenReportIssue: () => void;
  onOpenSupportTickets: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const FeaturesAndFooter: React.FC<FeaturesAndFooterProps> = ({
  onSelectRoute,
  onOpenHostModal,
  onOpenReportIssue,
  onOpenSupportTickets,
  onScrollToSection,
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

      {/* Dark Footer matching reference */}
      <footer id="footer" className="bg-[#0a101f] text-slate-300">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-6">
            {/* Brand & Contact Column */}
            <div className="lg:col-span-1 space-y-4">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  onScrollToSection('top');
                }}
                className="inline-flex flex-col leading-none group"
              >
                <div className="relative flex items-center">
                  <span className="text-2xl font-extrabold tracking-tight text-white">
                    Race
                  </span>
                  <span className="ml-0.5 -mt-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-race-500 text-white">
                    <Navigation className="h-2.5 w-2.5 fill-current rotate-45" />
                  </span>
                </div>
                <span className="text-[10px] font-semibold tracking-wide text-slate-400">
                  Ridesharing App
                </span>
              </a>

              <p className="text-xs leading-relaxed text-slate-400">
                Smart commuting for everyday travelers. Save more, travel together
                and build better cities.
              </p>

              <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
                <a
                  href="mailto:contact@raceapp.com"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-race-500" />
                  <span>contact@raceapp.com</span>
                </a>
                <a
                  href="tel:+917680938741"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0 text-race-500" />
                  <span>+91 76809 38741</span>
                </a>
                <div className="flex items-center gap-2 text-slate-400">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-race-500" />
                  <span>Available hrs: 8 AM to 10 PM IST</span>
                </div>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-white">Company</h3>
              <div className="mt-1.5 h-0.5 w-8 bg-race-500 rounded-full" />
              <ul className="mt-4 space-y-2.5 text-xs">
                {[
                  { label: 'About Us', target: 'how-it-works' },
                  { label: 'News & Updates', target: 'top' },
                  { label: 'Benefits', target: 'how-it-works' },
                  { label: 'How Race Works', target: 'how-it-works' },
                  { label: 'Safety', target: 'commute-impact' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-500" />
                    <button
                      type="button"
                      onClick={() => onScrollToSection(item.target)}
                      className="text-slate-300 hover:text-white transition text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                  <button
                    type="button"
                    onClick={() => onScrollToSection('commute-impact')}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    Race Green Mobility
                  </button>
                </li>
              </ul>
            </div>

            {/* For Guest */}
            <div>
              <h3 className="text-sm font-bold text-white">For Guest</h3>
              <div className="mt-1.5 h-0.5 w-8 bg-race-500 rounded-full" />
              <ul className="mt-4 space-y-2.5 text-xs">
                {[
                  { label: 'How to book a Ride?', target: 'how-it-works' },
                  { label: 'Find a Ride', target: 'book-ride' },
                  { label: 'Available Rides', target: 'book-ride' },
                  { label: 'Search Ride By Ride Id', target: 'book-ride' },
                  { label: 'Search Ride by Rider', target: 'book-ride' },
                  { label: 'How to Daily Commute', target: 'commute-impact' },
                  { label: 'Commute Calculator (Guest)', target: 'commute-impact' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-500" />
                    <button
                      type="button"
                      onClick={() => onScrollToSection(item.target)}
                      className="text-slate-300 hover:text-white transition text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Hosts */}
            <div>
              <h3 className="text-sm font-bold text-white">For Hosts</h3>
              <div className="mt-1.5 h-0.5 w-8 bg-race-500 rounded-full" />
              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <button
                    type="button"
                    onClick={onOpenHostModal}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    How to Host a Ride?
                  </button>
                </li>
                {[
                  { label: 'Ride Requests', target: 'book-ride' },
                  { label: 'Look up a Ride', target: 'book-ride' },
                  { label: 'How to Daily Commute', target: 'commute-impact' },
                  { label: 'Popular Rides', target: 'popular-rides' },
                  { label: 'Commute Calculator (Host)', target: 'commute-impact' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-500" />
                    <button
                      type="button"
                      onClick={() => onScrollToSection(item.target)}
                      className="text-slate-300 hover:text-white transition text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help and Support */}
            <div>
              <h3 className="text-sm font-bold text-white">Help and Support</h3>
              <div className="mt-1.5 h-0.5 w-8 bg-race-500 rounded-full" />
              <ul className="mt-4 space-y-2.5 text-xs">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <button
                    type="button"
                    onClick={() => onScrollToSection('how-it-works')}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    FAQs
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-race-500" />
                  <button
                    type="button"
                    onClick={onOpenReportIssue}
                    className="font-semibold text-white hover:text-race-400 transition text-left"
                  >
                    Report an Issue
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <button
                    type="button"
                    onClick={onOpenSupportTickets}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    My support tickets
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <button
                    type="button"
                    onClick={onOpenReportIssue}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    Get Help
                  </button>
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-3 w-3 text-slate-500" />
                  <a
                    href="tel:+917680938741"
                    className="text-slate-300 hover:text-white transition"
                  >
                    WhatsApp Support
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" />
                  <button
                    type="button"
                    onClick={() => onScrollToSection('commute-impact')}
                    className="text-slate-300 hover:text-white transition text-left"
                  >
                    Corporate Carpool
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal and Compliance */}
            <div>
              <h3 className="text-sm font-bold text-white">Legal and Compliance</h3>
              <div className="mt-1.5 h-0.5 w-8 bg-race-500 rounded-full" />
              <ul className="mt-4 space-y-2.5 text-xs">
                {[
                  'Terms and Conditions',
                  'Privacy Policy',
                  'Cancellation Policy',
                  'Account Deletion',
                  'Trip Insurance',
                  'Payment Terms and Conditions',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-slate-500" />
                    <button
                      type="button"
                      onClick={() => onScrollToSection('footer')}
                      className="text-slate-300 hover:text-white transition text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Social Bar */}
        <div className="border-t border-slate-800/90">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} Race Ridesharing App. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Follow us on</span>
              <div className="flex items-center gap-2">
                <a
                  href="#footer"
                  aria-label="X"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 transition"
                >
                  𝕏
                </a>
                <a
                  href="#footer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-xs font-bold text-white hover:opacity-90 transition"
                >
                  f
                </a>
                <a
                  href="#footer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-xs font-bold text-white hover:opacity-90 transition"
                >
                  ig
                </a>
                <a
                  href="#footer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-xs font-bold text-white hover:opacity-90 transition"
                >
                  in
                </a>
                <a
                  href="#footer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF0000] text-xs font-bold text-white hover:opacity-90 transition"
                >
                  ▶
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
