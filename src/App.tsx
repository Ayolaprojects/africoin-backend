import { useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import './styles/global.css';

// Pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Services from './pages/Services';
import Swap from './pages/Swap';
import PaymentGateway from './pages/PaymentGateway';
import Transactions from './pages/Transactions';
import Banking from './pages/Banking';
import ZimbabwePage from './pages/ZimbabwePage';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <BrowserRouter>
            <Navigation />
            <main style={{ minHeight: 'calc(100vh - 200px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/services" element={<Services />} />
                <Route path="/swap" element={<Swap />} />
                <Route path="/payments" element={<PaymentGateway />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/banking" element={<Banking />} />
                <Route path="/zimbabwe" element={<ZimbabwePage />} />
              </Routes>
            </main>
            <Footer />
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
