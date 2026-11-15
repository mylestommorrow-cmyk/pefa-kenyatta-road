import React, {Suspense, lazy} from 'react';
import {AppProvider, useApp} from './context/AppContext';
import {Header} from './components/Header';
import {DirectoryDrawer} from './components/DirectoryDrawer';
import {MobileBottomNav} from './components/MobileBottomNav';
import {Footer} from './components/Footer';
import {OfflineIndicator} from './components/PWAComponents';
import {StickySermonPlayer} from './components/StickySermonPlayer';
import {FloatingWhatsApp} from './components/FloatingWhatsApp';
import {LiveCrossBackdrop} from './components/LiveCrossBackdrop';
import {ErrorState, SkeletonCard, Toast} from './components/ui';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({default: m.HomePage})));
const NewHerePage = lazy(() => import('./pages/NewHerePage').then((m) => ({default: m.NewHerePage})));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({default: m.AboutPage})));
const MinistriesPage = lazy(() => import('./pages/MinistriesPage').then((m) => ({default: m.MinistriesPage})));
const SermonsPage = lazy(() => import('./pages/SermonsPage').then((m) => ({default: m.SermonsPage})));
const EventsPage = lazy(() => import('./pages/EventsPage').then((m) => ({default: m.EventsPage})));
const SmallGroupsPage = lazy(() => import('./pages/SmallGroupsPage').then((m) => ({default: m.SmallGroupsPage})));
const GivePage = lazy(() => import('./pages/GivePage').then((m) => ({default: m.GivePage})));
const PrayerPage = lazy(() => import('./pages/PrayerPage').then((m) => ({default: m.PrayerPage})));
const TestimoniesPage = lazy(() => import('./pages/TestimoniesPage').then((m) => ({default: m.TestimoniesPage})));
const NewsPage = lazy(() => import('./pages/NewsPage').then((m) => ({default: m.NewsPage})));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({default: m.ContactPage})));
const MemberPortalPage = lazy(() => import('./pages/MemberPortalPage').then((m) => ({default: m.MemberPortalPage})));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({default: m.AdminDashboardPage})));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({default: m.PrivacyPage})));

const RouteFallback: React.FC = () => (
  <div className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:px-6">
    <SkeletonCard lines={4} />
    <div className="grid gap-6 md:grid-cols-2">
      <SkeletonCard lines={3} />
      <SkeletonCard lines={3} />
    </div>
  </div>
);

const PageRouter: React.FC = () => {
  const {route, bundle, bundleError, refreshBundle} = useApp();

  if (bundleError && !bundle && route !== 'admin' && route !== 'privacy') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <ErrorState message={bundleError} onRetry={refreshBundle} />
      </div>
    );
  }

  return (
    <Suspense fallback={<RouteFallback />}>
      {(() => {
        switch (route) {
          case 'home':
            return <HomePage />;
          case 'visit':
            return <NewHerePage />;
          case 'about':
            return <AboutPage />;
          case 'ministries':
            return <MinistriesPage />;
          case 'sermons':
            return <SermonsPage />;
          case 'events':
            return <EventsPage />;
          case 'groups':
            return <SmallGroupsPage />;
          case 'give':
            return <GivePage />;
          case 'prayer':
            return <PrayerPage />;
          case 'testimonies':
            return <TestimoniesPage />;
          case 'news':
            return <NewsPage />;
          case 'contact':
            return <ContactPage />;
          case 'member':
            return <MemberPortalPage />;
          case 'admin':
            return <AdminDashboardPage />;
          case 'privacy':
            return <PrivacyPage />;
          default:
            return <HomePage />;
        }
      })()}
    </Suspense>
  );
};

const AppShell: React.FC = () => {
  const {toast, dismissToast} = useApp();

  return (
    <div className="relative flex min-h-screen flex-col bg-transparent text-slate-900 dark:text-slate-100">
      <LiveCrossBackdrop />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <DirectoryDrawer />
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
        <PageRouter />
      </main>
      <Footer />
      <MobileBottomNav />
      <StickySermonPlayer />
      <FloatingWhatsApp />
      <OfflineIndicator />
      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
