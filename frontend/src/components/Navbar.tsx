import React, { useState } from 'react';
import {
  Building2,
  User as UserIcon,
  Users,
  Briefcase,
  Map,
  ChevronDown,
  GitBranch,
  PhoneCall,
  Menu,
  X,
  LogOut,
  Navigation,
} from 'lucide-react';
import { AuthModalMode, User } from '../types/ride';

interface NavbarProps {
  user: User | null;
  bookingsCount: number;
  hostedCount: number;
  onOpenAuth: (mode: AuthModalMode) => void;
  onSignOut: () => void;
  onOpenManage: () => void;
  onOpenHostModal: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  bookingsCount,
  hostedCount,
  onOpenAuth,
  onSignOut,
  onOpenManage,
  onOpenHostModal,
  onScrollToSection,
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleNavAction = (action: () => void) => {
    setOpenDropdown(null);
    setMobileOpen(false);
    action();
  };

  const totalManaged = bookingsCount + hostedCount;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo matching reference style */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onScrollToSection('top');
          }}
          className="flex flex-col leading-none group"
        >
          <div className="relative flex items-center">
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">
              Race
            </span>
            <span className="ml-0.5 -mt-3 inline-flex h-4 w-4 items-center justify-center rounded-full bg-race-500 text-white shadow-sm group-hover:scale-110 transition-transform">
              <Navigation className="h-2.5 w-2.5 fill-current rotate-45" />
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wide text-slate-600">
            Ridesharing App
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
          {/* Company */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('company')}
              className="flex items-center gap-1.5 py-2 hover:text-race-600 transition-colors"
            >
              <Building2 className="h-4 w-4 text-slate-500" />
              <span>Company</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {openDropdown === 'company' && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('how-it-works'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  About Race
                </button>
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('commute-impact'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  Safety &amp; Verification
                </button>
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('footer'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  Contact Support
                </button>
              </div>
            )}
          </div>

          {/* For Guest */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('guest')}
              className="flex items-center gap-1.5 py-2 hover:text-race-600 transition-colors"
            >
              <UserIcon className="h-4 w-4 text-slate-500" />
              <span>For Guest</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {openDropdown === 'guest' && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('book-ride'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-race-700 hover:bg-race-50"
                >
                  Book a Ride
                </button>
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('how-it-works'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  How Booking Works
                </button>
              </div>
            )}
          </div>

          {/* For Hosts */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('hosts')}
              className="flex items-center gap-1.5 py-2 hover:text-race-600 transition-colors"
            >
              <Users className="h-4 w-4 text-slate-500" />
              <span>For Hosts</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {openDropdown === 'hosts' && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 mt-1 w-48 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => handleNavAction(onOpenHostModal)}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-race-700 hover:bg-race-50"
                >
                  Host a Ride
                </button>
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('how-it-works'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  Host Benefits
                </button>
              </div>
            )}
          </div>

          {/* Commute Carpool */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('commute')}
              className="flex items-center gap-1.5 py-2 hover:text-race-600 transition-colors"
            >
              <Briefcase className="h-4 w-4 text-slate-500" />
              <span>Commute Carpool</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
            {openDropdown === 'commute' && (
              <div
                onMouseLeave={() => setOpenDropdown(null)}
                className="absolute left-0 mt-1 w-52 rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('book-ride'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  Daily Office Carpool
                </button>
                <button
                  type="button"
                  onClick={() => handleNavAction(() => onScrollToSection('commute-impact'))}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-race-50 hover:text-race-700"
                >
                  Savings &amp; Eco Calculator
                </button>
              </div>
            )}
          </div>

          {/* Popular Rides */}
          <button
            type="button"
            onClick={() => handleNavAction(() => onScrollToSection('popular-rides'))}
            className="flex items-center gap-1.5 py-2 hover:text-race-600 transition-colors"
          >
            <Map className="h-4 w-4 text-slate-500" />
            <span>Popular Rides</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenManage}
            className="relative inline-flex items-center gap-2 rounded-lg bg-race-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-race-600 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>Manage Ride</span>
            {totalManaged > 0 && (
              <span className="ml-0.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-race-700">
                {totalManaged}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-race-200 bg-race-50 px-3 py-1.5 text-sm font-semibold text-race-900">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-race-500 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[110px] truncate">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                title="Sign Out"
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('signin')}
              className="inline-flex items-center gap-2 rounded-lg border border-race-500 bg-white px-4 py-2 text-sm font-semibold text-race-600 hover:bg-race-50 transition-colors"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-2 shadow-lg">
          <button
            type="button"
            onClick={() => handleNavAction(() => onScrollToSection('book-ride'))}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-race-50"
          >
            Book a Ride (For Guest)
          </button>
          <button
            type="button"
            onClick={() => handleNavAction(onOpenHostModal)}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-race-50"
          >
            Host a Ride (For Hosts)
          </button>
          <button
            type="button"
            onClick={() => handleNavAction(() => onScrollToSection('commute-impact'))}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-race-50"
          >
            Commute Carpool
          </button>
          <button
            type="button"
            onClick={() => handleNavAction(() => onScrollToSection('popular-rides'))}
            className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-race-50"
          >
            Popular Rides
          </button>
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleNavAction(onOpenManage)}
              className="w-full rounded-lg bg-race-500 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Manage Ride ({totalManaged})
            </button>
            {user ? (
              <button
                type="button"
                onClick={() => handleNavAction(onSignOut)}
                className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Sign Out ({user.name})
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleNavAction(() => onOpenAuth('signin'))}
                className="w-full rounded-lg border border-race-500 px-4 py-2.5 text-sm font-semibold text-race-600"
              >
                Sign In / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
