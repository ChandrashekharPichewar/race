import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { BookRideSection } from './components/BookRideSection';
import { FeaturesAndFooter } from './components/FeaturesAndFooter';
import { AuthModal } from './components/AuthModal';
import { HostRideModal } from './components/HostRideModal';
import { ManageRideModal } from './components/ManageRideModal';
import { INITIAL_RIDES } from './data/mockRides';
import { AuthModalMode, Booking, Ride, User } from './types/ride';

const STORAGE_KEYS = {
  user: 'race_user',
  rides: 'race_rides',
  bookings: 'race_bookings',
};

export function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.user);
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.rides);
    return saved ? (JSON.parse(saved) as Ride[]) : INITIAL_RIDES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.bookings);
    return saved ? (JSON.parse(saved) as Booking[]) : [];
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthModalMode>('signin');
  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.rides, JSON.stringify(rides));
  }, [rides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3500);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuth = (mode: AuthModalMode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    showToast(`Welcome to Race, ${loggedInUser.name}!`);
  };

  const handleSignOut = () => {
    setUser(null);
    showToast('Signed out successfully.');
  };

  const handleConfirmBooking = (ride: Ride, seats: number, pickupNote: string) => {
    if (!user) {
      handleOpenAuth('signin');
      return;
    }

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      rideId: ride.id,
      userId: user.id,
      seatsBooked: seats,
      totalFare: ride.pricePerSeat * seats,
      pickupNote,
      bookedAt: new Date().toISOString(),
      status: 'confirmed',
      rideSnapshot: {
        from: ride.from,
        to: ride.to,
        date: ride.date,
        departureTime: ride.departureTime,
        hostName: ride.hostName,
        vehicle: ride.vehicle,
      },
    };

    setBookings((prev) => [newBooking, ...prev]);
    setRides((prev) =>
      prev.map((r) =>
        r.id === ride.id ? { ...r, seatsAvailable: Math.max(0, r.seatsAvailable - seats) } : r
      )
    );
    showToast(`Booked ${seats} seat(s) from ${ride.from} to ${ride.to}!`);
  };

  const handleCreateRide = (newRide: Ride) => {
    setRides((prev) => [newRide, ...prev]);
    showToast(`Ride published: ${newRide.from} → ${newRide.to}`);
    scrollToSection('book-ride');
  };

  const handleCancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target || target.status === 'cancelled') return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
    setRides((prev) =>
      prev.map((r) =>
        r.id === target.rideId
          ? { ...r, seatsAvailable: Math.min(r.seatsTotal, r.seatsAvailable + target.seatsBooked) }
          : r
      )
    );
    showToast('Booking cancelled and seats restored.');
  };

  const handleDeleteHostedRide = (rideId: string) => {
    setRides((prev) => prev.filter((r) => r.id !== rideId));
    showToast('Hosted ride removed.');
  };

  const userBookings = user ? bookings.filter((b) => b.userId === user.id) : [];
  const userHostedRides = user ? rides.filter((r) => r.hostId === user.id) : [];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar
        user={user}
        bookingsCount={userBookings.filter((b) => b.status === 'confirmed').length}
        hostedCount={userHostedRides.length}
        onOpenAuth={handleOpenAuth}
        onSignOut={handleSignOut}
        onOpenManage={() => setManageModalOpen(true)}
        onOpenHostModal={() => setHostModalOpen(true)}
        onScrollToSection={scrollToSection}
      />

      <main>
        <HeroCarousel
          onBookClick={() => scrollToSection('book-ride')}
          onHostClick={() => setHostModalOpen(true)}
        />

        <BookRideSection
          rides={rides}
          user={user}
          onRequireAuth={() => handleOpenAuth('signin')}
          onConfirmBooking={handleConfirmBooking}
          onOpenHostModal={() => setHostModalOpen(true)}
        />

        <FeaturesAndFooter
          onSelectRoute={() => scrollToSection('book-ride')}
          onOpenHostModal={() => setHostModalOpen(true)}
        />
      </main>

      {/* Sign In / Sign Up Modal */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Host a Ride Modal */}
      <HostRideModal
        isOpen={hostModalOpen}
        user={user}
        onClose={() => setHostModalOpen(false)}
        onRequireAuth={() => handleOpenAuth('signin')}
        onCreateRide={handleCreateRide}
      />

      {/* Manage Ride Modal */}
      <ManageRideModal
        isOpen={manageModalOpen}
        user={user}
        bookings={userBookings}
        hostedRides={userHostedRides}
        onClose={() => setManageModalOpen(false)}
        onRequireAuth={() => handleOpenAuth('signin')}
        onCancelBooking={handleCancelBooking}
        onDeleteHostedRide={handleDeleteHostedRide}
        onOpenHostModal={() => setHostModalOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-race-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
