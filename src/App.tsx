import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory) as React.LazyExoticComponent<T> & {
    preload: () => Promise<{ default: T }>;
  };

  Component.preload = factory;
  return Component;
}

const Home = lazyWithPreload(() => import('./pages/Home'));
const Dashboard = lazyWithPreload(() => import('./pages/Dashboard'));
const Services = lazyWithPreload(() => import('./pages/Services'));
const Swap = lazyWithPreload(() => import('./pages/Swap'));
const PaymentGateway = lazyWithPreload(() => import('./pages/PaymentGateway'));
const Transactions = lazyWithPreload(() => import('./pages/Transactions'));
const Banking = lazyWithPreload(() => import('./pages/Banking'));
const ZimbabwePage = lazyWithPreload(() => import('./pages/ZimbabwePage'));
const WalletRoutes = lazyWithPreload(() => import('./routes/WalletRoutes'));

const routePreloaders = {
  '/': Home.preload,
  '/dashboard': () => Promise.all([WalletRoutes.preload(), Dashboard.preload()]),
  '/services': Services.preload,
  '/swap': () => Promise.all([WalletRoutes.preload(), Swap.preload()]),
  '/payments': PaymentGateway.preload,
  '/transactions': Transactions.preload,
  '/banking': Banking.preload,
  '/zimbabwe': ZimbabwePage.preload,
};

type RoutePath = keyof typeof routePreloaders;

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 200px)',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
      }}
    >
      <div>Loading...</div>
    </div>
  );
}

function App() {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if ('requestIdleCallback' in window && 'cancelIdleCallback' in window) {
      const job = window.requestIdleCallback(() => {
        void routePreloaders['/dashboard']();
        void Services.preload();
        void PaymentGateway.preload();
      });

      return () => window.cancelIdleCallback(job);
    }

    const timeoutId = globalThis.setTimeout(() => {
      void routePreloaders['/dashboard']();
      void Services.preload();
      void PaymentGateway.preload();
    }, 300);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  return (
    <BrowserRouter>
      <Navigation
        preloadRoute={(path) => {
          if (path in routePreloaders) {
            void routePreloaders[path as RoutePath]();
          }
        }}
      />
      <Suspense fallback={<RouteFallback />}>
        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/payments" element={<PaymentGateway />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/zimbabwe" element={<ZimbabwePage />} />
            <Route element={<WalletRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/swap" element={<Swap />} />
            </Route>
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
