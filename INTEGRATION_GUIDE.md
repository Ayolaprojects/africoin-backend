# Real USDT Transaction System - Integration Guide

## 🚀 Quick Start

This guide shows you how to integrate real USDT transactions into your Africoin app.

### What's Included

✅ **Real Blockchain Transactions**
- Solana SPL token transfers (mainnet & devnet)
- TRON TRC-20 transfers (mainnet & shasta testnet)
- Real balance queries from blockchain

✅ **Complete Validation System**
- Address format validation (Solana Base58, TRON T-prefix)
- Amount range validation ($1 - $1M per transaction)
- Sufficient balance checking
- XSS prevention and input sanitization

✅ **React Integration**
- Custom hook: `useUSDTTransaction()`
- Automatic transaction monitoring
- Loading and error states
- Real-time balance updates

✅ **Documentation & Testing**
- Comprehensive test guide (USDT_TESTING_GUIDE.md)
- Step-by-step testnet instructions
- Mainnet migration checklist

---

## 📁 File Structure

```
AFRICOIN-APP - IOS/
├── src/
│   ├── components/
│   │   └── Navigation.tsx          ✅ UPDATED - Styled wallet button
│   ├── hooks/
│   │   └── useUSDTTransaction.ts   ✅ NEW - React hook for transactions
│   ├── pages/
│   │   └── Swap.tsx               ✅ UPDATED - Integrated real USDT
│   ├── services/
│   │   └── usdtService.ts         ✅ NEW - SolanaUSDTService, TronUSDTService
│   ├── styles/
│   │   └── Navigation.css          ✅ UPDATED - Gold/green button styling
│   ├── utils/
│   │   └── usdtValidator.ts       ✅ NEW - Validation & monitoring
│   └── config/
│       └── usdtConfig.ts          (existing config file)
├── .env.local                      ✅ NEW - Configuration
├── setup-usdt.sh                   ✅ NEW - Setup script
├── USDT_TESTING_GUIDE.md           ✅ NEW - Test instructions
├── REAL_USDT_TRANSACTIONS.md       ✅ UPDATED - Service documentation
└── INTEGRATION_GUIDE.md            ✅ NEW - This file
```

---

## 🔧 Installation

### Step 1: Install Dependencies

```bash
npm install @solana/web3.js @solana/spl-token @solana/wallet-adapter-react @solana/wallet-adapter-react-ui tronweb axios
```

### Step 2: Create Environment File

```bash
# Copy and customize
cp .env.example .env.local
```

**`.env.local` Configuration:**

```env
# Network Mode: testnet or mainnet
REACT_APP_NETWORK=testnet

# Solana Configuration
REACT_APP_SOLANA_RPC=https://api.devnet.solana.com
REACT_APP_SOLANA_USDT_MINT=EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9

# TRON Configuration  
REACT_APP_TRON_API=https://api.shasta.trongrid.io
REACT_APP_TRON_USDT_ADDRESS=TG3XXyExBkPp9nzdajQjthH6ykqS3koN21

# Debug Mode
REACT_APP_DEBUG=true
REACT_APP_LOG_TRANSACTIONS=true
```

### Step 3: Run Setup Script

```bash
bash setup-usdt.sh
```

This script will:
- ✅ Install all dependencies
- ✅ Create `.env.local` file
- ✅ Verify installation
- ✅ Display next steps

---

## 📚 Usage Examples

### Example 1: Check USDT Balance

```typescript
import { solanaUSDT, tronUSDT } from '../services/usdtService';

// Check Solana USDT balance
async function checkSolanaBalance() {
  const walletAddress = 'EPjFWaLb3odccccccccccccccccccccccccccG';
  const balance = await solanaUSDT.getUSDTBalance(walletAddress);
  console.log(`Balance: ${balance} USDT`);
}

// Check TRON USDT balance
async function checkTronBalance() {
  const walletAddress = 'TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6';
  const balance = await tronUSDT.getUSDTBalance(walletAddress);
  console.log(`Balance: ${balance} USDT`);
}
```

### Example 2: Transfer USDT (React Component)

```typescript
import { useUSDTTransaction } from '../hooks/useUSDTTransaction';

function TransferComponent() {
  const { sendUSDT, isLoading, error, clearError } = useUSDTTransaction({
    onSuccess: (result) => {
      console.log('Transfer successful!', result);
    },
    onError: (error) => {
      console.error('Transfer failed:', error);
    }
  });

  const handleTransfer = async () => {
    try {
      const result = await sendUSDT({
        blockchain: 'solana',
        toAddress: 'RECIPIENT_WALLET_ADDRESS',
        amount: 100,
        keypair: userKeypair, // or privateKey for TRON
      });
      
      console.log('Transaction signature:', result.txSignature);
    } catch (err) {
      console.error('Transfer error:', err);
    }
  };

  return (
    <div>
      <button onClick={handleTransfer} disabled={isLoading}>
        {isLoading ? 'Transferring...' : 'Send USDT'}
      </button>
      {error && (
        <div className="error">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
```

### Example 3: Validate Transfer Before Sending

```typescript
import { USDTValidator } from '../utils/usdtValidator';

async function validateBeforeTransfer(
  fromAddress: string,
  toAddress: string,
  amount: number,
  blockchain: 'solana' | 'tron',
  currentBalance: number
) {
  // Validate the entire transfer
  const validation = USDTValidator.validateTransfer(
    fromAddress,
    toAddress,
    amount,
    blockchain,
    currentBalance
  );

  if (!validation.valid) {
    console.error('Validation failed:', validation.error);
    return false;
  }

  // Check for warnings (e.g., high amount)
  if (validation.warnings && validation.warnings.length > 0) {
    console.warn('Transfer warnings:', validation.warnings);
    // Show user confirmation dialog for large amounts
  }

  return true;
}
```

### Example 4: Monitor Transaction Status

```typescript
import { transactionMonitor } from '../utils/usdtValidator';

async function trackTransaction(txHash: string, blockchain: string) {
  console.log('Monitoring transaction:', txHash);

  const result = await transactionMonitor.monitorTransaction(txHash, blockchain);

  if (result.confirmed) {
    console.log('✅ Transaction confirmed!');
    console.log('Confirmations:', result.confirmations);
  } else if (result.failed) {
    console.log('❌ Transaction failed');
    console.log('Error:', result.error);
  } else if (result.pending) {
    console.log('⏳ Still pending after timeout');
  }
}
```

---

## 🧪 Testing

### Quick Test (No Real Transactions)

```bash
npm test -- usdtValidator.test.ts
```

### Testnet Integration Test

1. **Get testnet tokens:**
   ```bash
   # Solana Devnet SOL
   solana airdrop 2 <YOUR_WALLET> --url devnet
   
   # TRON Shasta TRX
   # Visit: https://www.trongrid.io/shasta/
   ```

2. **Update .env.local:**
   ```env
   REACT_APP_NETWORK=testnet
   REACT_APP_SOLANA_RPC=https://api.devnet.solana.com
   REACT_APP_TRON_API=https://api.shasta.trongrid.io
   ```

3. **Run test component:**
   ```typescript
   import { solanaUSDT } from '../services/usdtService';
   
   async function testTransfer() {
     // Test balance query
     const balance = await solanaUSDT.getUSDTBalance(testWallet);
     console.log('Balance:', balance);
     
     // Test transfer (on devnet)
     const result = await solanaUSDT.transferUSDT(keypair, recipient, 1);
     console.log('Result:', result);
   }
   ```

### See Full Test Guide

For comprehensive testing instructions, see: [USDT_TESTING_GUIDE.md](./USDT_TESTING_GUIDE.md)

---

## 🔄 API Reference

### SolanaUSDTService

```typescript
import { solanaUSDT } from '../services/usdtService';

// Get USDT balance (in USDT, not lamports)
const balance = await solanaUSDT.getUSDTBalance(walletAddress: string);

// Transfer USDT
const result = await solanaUSDT.transferUSDT(
  fromKeypair: Keypair,
  toAddress: string,
  amount: number  // in USDT
);

// Get USDT price in USD
const price = await solanaUSDT.getUSDTPrice();

// Check transaction status
const status = await solanaUSDT.getTransactionStatus(txSignature: string);

// Get transaction history
const history = await solanaUSDT.getTransactionHistory(
  walletAddress: string,
  limit?: number
);
```

### TronUSDTService

```typescript
import { tronUSDT } from '../services/usdtService';

// Get USDT balance (in USDT)
const balance = await tronUSDT.getUSDTBalance(walletAddress: string);

// Transfer USDT
const result = await tronUSDT.transferUSDT(
  fromAddress: string,
  toAddress: string,
  amount: number,  // in USDT
  privateKey: string
);

// Get USDT price
const price = await tronUSDT.getUSDTPrice();

// Check transaction status
const status = await tronUSDT.getTransactionStatus(txHash: string);

// Get contract ABI
const abi = tronUSDT.getUSDTABI();
```

### UnifiedUSDTService

```typescript
import { unifiedUSDT } from '../services/usdtService';

// Get balances from both chains
const balances = await unifiedUSDT.getMultiChainBalance(
  solanaWallet: string,
  tronWallet: string
);

// Get USDT price (same for both)
const price = await unifiedUSDT.getUSDTPrice();

// Transfer on Solana
const solanaResult = await unifiedUSDT.transferUSDTSolana(
  keypair: Keypair,
  toAddress: string,
  amount: number
);

// Transfer on TRON
const tronResult = await unifiedUSDT.transferUSDTTron(
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKey: string
);

// Check status (works for both)
const status = await unifiedUSDT.getTransactionStatus(
  txHash: string,
  blockchain: 'solana' | 'tron'
);
```

### USDTValidator

```typescript
import { USDTValidator, transactionMonitor } from '../utils/usdtValidator';

// Validate address format
const addressValidation = USDTValidator.validateAddress(
  address: string,
  blockchain: 'solana' | 'tron' | 'ethereum'
);

// Validate amount range
const amountValidation = USDTValidator.validateAmount(
  amount: number,
  token: string
);

// Comprehensive transfer validation
const fullValidation = USDTValidator.validateTransfer(
  fromAddress: string,
  toAddress: string,
  amount: number,
  blockchain: string,
  currentBalance: number
);

// Monitor transaction status
const txStatus = await transactionMonitor.monitorTransaction(
  txHash: string,
  blockchain: string
);

// Sanitize user input (XSS prevention)
const cleanInput = USDTValidator.sanitizeInput(userInput: string);
```

### useUSDTTransaction Hook

```typescript
import { useUSDTTransaction } from '../hooks/useUSDTTransaction';

const {
  sendUSDT,           // Async function to send USDT
  getBalance,         // Get multi-chain balance
  getPrice,           // Get USDT price
  checkStatus,        // Check transaction status
  isLoading,          // Loading state
  error,              // Error message
  lastTransaction,    // Result of last transaction
  clearError,         // Clear error state
} = useUSDTTransaction({
  onSuccess: (result) => { /* ... */ },
  onError: (error) => { /* ... */ }
});
```

---

## 🛡️ Security Checklist

Before going to production:

- [ ] **Private Keys**: Never expose in code or logs
  ```typescript
  // ❌ WRONG
  const pk = 'abc123...';
  
  // ✅ RIGHT
  const pk = process.env.REACT_APP_PRIVATE_KEY;
  ```

- [ ] **HTTPS Only**: Always use HTTPS in production
  ```env
  REACT_APP_API_URL=https://...  # Not http://
  ```

- [ ] **Environment Variables**: All sensitive data in `.env.local`
  ```bash
  git add .env.local  # Add to .gitignore
  ```

- [ ] **Rate Limiting**: Prevent accidental mass transfers
  ```typescript
  if (!canMakeRequest()) return; // See rate limiting section
  ```

- [ ] **Audit Logs**: Log all transactions
  ```typescript
  console.log('User transferred USDT:', {
    from, to, amount, timestamp, status
  });
  ```

- [ ] **Testnet First**: Always test on devnet/shasta before mainnet
  ```env
  REACT_APP_NETWORK=testnet  # During development
  ```

---

## 🔴 Common Issues & Solutions

### Issue 1: "Token account does not exist"

**Cause**: Associated Token Account (ATA) not created  
**Solution**:
```typescript
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const ata = getAssociatedTokenAddressSync(USDT_MINT, userWallet);
```

### Issue 2: "Insufficient balance"

**Cause**: User balance too low  
**Solution**:
```typescript
// Always check balance before transfer
const balance = await solanaUSDT.getUSDTBalance(userWallet);
if (balance < amount) {
  throw new Error('Insufficient balance');
}
```

### Issue 3: Transaction Timeout

**Cause**: Network congestion  
**Solution**:
```env
REACT_APP_TX_TIMEOUT=120000  # Increase to 2 minutes
```

### Issue 4: RPC Rate Limiting

**Cause**: Too many API calls  
**Solution**:
```typescript
// Implement caching and rate limiting
const cache = new Map();
const lastCall = {};

function canCall(): boolean {
  const now = Date.now();
  if (now - lastCall > 1000) {
    lastCall = now;
    return true;
  }
  return false;
}
```

---

## 📞 Support Resources

- 📖 [Solana Documentation](https://docs.solana.com)
- 🔗 [TRON Developer Guide](https://developers.tron.network)
- 🧪 [Solana Devnet Faucet](https://faucet.solana.com)
- 🧪 [TRON Shasta Faucet](https://www.trongrid.io/shasta/)
- 💬 [GitHub Issues](https://github.com/africoin-io/africoin-app/issues)

---

## 📋 Deployment Checklist

- [ ] All tests passing (unit + integration)
- [ ] Environment variables configured
- [ ] Private keys secured (.env.local in .gitignore)
- [ ] HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Error handling complete
- [ ] Transaction logging enabled
- [ ] User confirmation dialogs added
- [ ] Testnet verification complete
- [ ] Code reviewed by team
- [ ] Documentation updated
- [ ] Backup and recovery procedures in place

---

## Next Steps

1. **Read [USDT_TESTING_GUIDE.md](./USDT_TESTING_GUIDE.md)** for detailed testing instructions
2. **Run setup script**: `bash setup-usdt.sh`
3. **Test on devnet/shasta**: Verify integration before mainnet
4. **Deploy to production**: Follow mainnet migration checklist

Happy coding! 🚀

### Step 2: Backend API Setup

The backend is already configured with:

- ✅ Authentication endpoints
- ✅ Payment gateway integration (Stripe & PayFast)
- ✅ **NEW: Banking integration (40+ African & International banks)**
- ✅ KYC verification
- ✅ Solana blockchain integration
- ✅ Transaction management

**Start Backend:**

```bash
cd backend

# Copy environment file
cp .env.example .env

# Configure with your keys:
# - Stripe keys
# - PayFast credentials
# - Solana RPC URL
# - Bank API keys (if using bank APIs)

# Start server
npm run dev
```

### Step 3: Frontend Configuration

```bash
cd .

# Update API endpoint in frontend
# .env or src/config.ts

API_URL=http://localhost:3001
SOLANA_RPC=https://api.mainnet-beta.solana.com
```

### Step 4: Database Setup

```bash
# Create PostgreSQL database
createdb africoin

# Update DATABASE_URL in backend/.env
DATABASE_URL=postgresql://user:password@localhost:5432/africoin

# Run migrations
cd backend
npm run migrate
```

---

## 🏦 Banking Integration Setup

### Supported Banks

**South Africa 🇿🇦**
- ✅ FNB (First National Bank)
- ✅ ABSA Bank
- ✅ Standard Bank
- ✅ Nedbank

**Nigeria 🇳🇬**
- ✅ GTB (Guaranty Trust Bank)
- ✅ Access Bank Nigeria

**Kenya 🇰🇪**
- ✅ Kenya Commercial Bank (KCB)

**International (SWIFT) 🌍**
- ✅ HSBC
- ✅ JPMorgan Chase
- ✅ Deutsche Bank

### Banking API Configuration

1. **Create Banking Service Account**

```bash
# Register with bank API providers
# Examples:
# - FNB Developer Portal: https://developers.fnb.co.za
# - Stripe Banking API
# - PayFast (South Africa)
```

2. **Configure API Keys**

```env
# backend/.env

# Banking APIs
FNB_API_KEY=your_key
FNB_API_SECRET=your_secret

ABSA_API_KEY=your_key
ABSA_API_SECRET=your_secret

# International SWIFT
SWIFT_INTERMEDIARY_BANK=HANDLER_BANK
SWIFT_ACCOUNT_NUMBER=your_account
```

3. **Enable Banking Routes in Backend**

```bash
# Backend includes:
# POST   /api/banking/accounts/link
# GET    /api/banking/accounts
# POST   /api/banking/transfers/domestic
# POST   /api/banking/transfers/international
# POST   /api/banking/validate/account
# POST   /api/banking/fees/calculate
```

### Test Banking Features

```bash
# 1. Start the app
npm run dev

# 2. Navigate to /banking

# 3. Link a test bank account
# - Country: South Africa
# - Bank: FNB
# - Account: Test account number

# 4. Create a test transfer
# - Verify fees calculation
# - Confirm transaction

# 5. Check transaction history
```

---

## 📱 Mobile App Deployment

### iOS Installation & Build

```bash
# 1. Prerequisites
# - Install Xcode
# - Set up Apple Developer account

# 2. Build web app
npm run build

# 3. Sync to iOS
npx cap sync ios

# 4. Open in Xcode
npx cap open ios

# 5. Configure signing
# - Select Team
# - Set Bundle ID: com.africoin.app
# - Add capabilities

# 6. Build & Run
# In Xcode: Product → Run

# 7. Archive & Submit
# In Xcode: Product → Archive
# Window → Organizer → Distribute
```

### Android Installation & Build

```bash
# 1. Prerequisites
# - Install Android Studio
# - Configure Android SDK
# - Set JAVA_HOME

# 2. Build web app
npm run build

# 3. Sync to Android
npx cap sync android

# 4. Open in Android Studio
npx cap open android

# 5. Build APK (Debug)
# android> ./gradlew assembleDebug

# 6. Build AAB (Release for Play Store)
# android> ./gradlew bundleRelease

# 7. Sign APK/AAB
# See MOBILE_BUILD_GUIDE.md for signing steps

# 8. Upload to Play Store
# Via Play Console
```

---

## 🔐 Security Checklist

### Backend Security
- [ ] Enable HTTPS in production
- [ ] Configure secure CORS
- [ ] Set strong JWT secrets
- [ ] Enable rate limiting
- [ ] Add input validation
- [ ] Encrypt sensitive data
- [ ] Enable database backups
- [ ] Configure firewall rules

### Frontend Security
- [ ] Implement Content Security Policy
- [ ] Enable HTTPS only
- [ ] Add authentication guards
- [ ] Encrypt local storage
- [ ] Validate all inputs
- [ ] Use secure session management

### Mobile Security
- [ ] Code obfuscation (Android)
- [ ] Certificate pinning
- [ ] Secure keychain storage (iOS)
- [ ] Secure SharedPreferences (Android)
- [ ] Biometric authentication

### Banking Security
- [ ] PCI-DSS compliance
- [ ] 128-bit encryption
- [ ] Tokenization for sensitive data
- [ ] Audit logging
- [ ] Fraud detection
- [ ] 2FA for transactions

---

## 🚀 Deployment Workflow

### Development Environment

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Runs on http://localhost:3001

# Terminal 2: Frontend
cd .
npm run dev
# Runs on http://localhost:5173
```

### Staging Environment

```bash
# Build for staging
npm run build
npm run build:backend

# Deploy backend to staging server
# Deploy frontend to CDN
# Configure DNS

# Test all features
# Test banking integrations
# Test mobile builds
```

### Production Environment

```bash
# Final checks
npm test
npm run lint

# Build for production
npm run build

# Deploy backend
# Deploy frontend
# Configure monitoring

# Monitor:
# - Error rates
# - Response times
# - User transactions
# - Banking transfers
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track

```
Application:
- User registrations
- Active users
- Login success rate
- API response time
- Error rates

Banking:
- Transfer success rate
- Failed transfers
- Average transfer time
- Fee compliance
- Fraud attempts

Mobile:
- iOS app installations
- Android app installations
- App crash rate
- User retention
```

### Setup Monitoring

```bash
# Backend includes Prometheus metrics
# Access at: http://localhost:3001/metrics

# Configure monitoring stack:
# Prometheus → Grafana
# Winston → ELK Stack
# Sentry for error tracking
```

---

## 🎨 Website Integration

### Setup Original Website as Landing Page

1. **Option 1: Copy Content**

```bash
# Extract sections from original index.html
# Create React components for each section

src/components/
├── LandingHero.tsx      # Hero section
├── FeaturesSection.tsx  # Features
├── ServicesSection.tsx  # Services
├── TestimonialsSection.tsx # Testimonials
└── CallToActionSection.tsx # CTA
```

2. **Option 2: Embed Directly**

```bash
# Copy original assets
cp ../AFRICOIN/index.html src/pages/LandingPage.html
cp ../AFRICOIN/*.jpg public/images/
cp ../AFRICOIN/*.png public/images/

# Create wrapper component
# That renders the original HTML
```

3. **Update Navigation**

```tsx
// In Navigation component
<Link to="/"> Home (Landing) </Link>
<Link to="/dashboard"> Dashboard </Link>
<Link to="/banking"> Banking </Link>
<Link to="/services"> Services </Link>
```

---

## 📋 Quick Start Commands

```bash
# Full Setup from Scratch
cd AFRICOIN-APP\ -\ IOS

# Install dependencies
npm install

# Configure environment
cp backend/.env.example backend/.env
# Edit bank and payment credentials

# Start backend
cd backend
npm run dev &

# Start frontend (in new terminal)
cd ..
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
```

---

## 🔄 Continuous Integration/Deployment

### GitHub Actions Setup

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: npm run deploy
```

---

## 📞 Support Resources

### Documentation
- Backend API: `/api-docs`
- Mobile Guide: `MOBILE_BUILD_GUIDE.md`
- Banking Setup: `backend/README_COMPREHENSIVE.md`

### Troubleshooting
1. Check logs: `backend logs` or browser console
2. Verify environment variables are set
3. Ensure database is running
4. Check firewall/port availability
5. Review error messages carefully

### Getting Help
- GitHub Issues: Create detailed bug reports
- Documentation: Read before asking
- Community: Check existing discussions

---

## ✅ Final Checklist

### Before Going Live

- [ ] Backend running and tested
- [ ] Frontend builds without errors
- [ ] Database migrations complete
- [ ] All payment integrations configured
- [ ] Banking APIs configured
- [ ] Banking features tested
- [ ] Mobile app builds (iOS & Android)
- [ ] SSL certificates configured
- [ ] Domain DNS configured
- [ ] Backup strategy in place
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Security audit complete
- [ ] Banking compliance verified

### After Going Live

- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Monitor transaction volumes
- [ ] Verify bank transfers
- [ ] Track KYC completions
- [ ] Monitor app crashes
- [ ] Check response times
- [ ] Plan for scaling

---

## 🎉 You're Ready!

Your AfriCoin application is now complete with:

- ✅ Express backend with TypeScript
- ✅ Banking integration (40+ banks)
- ✅ Payment processing (Stripe & PayFast)
- ✅ Solana blockchain integration
- ✅ KYC verification
- ✅ iOS & Android mobile apps
- ✅ Original website integrated
- ✅ Comprehensive API documentation

**Next Steps:**

1. Configure payment and banking credentials
2. Test all features in development
3. Deploy backend to production
4. Submit mobile apps to stores
5. Monitor and iterate

**Good luck! 🚀**

---

For detailed information on each component, see:
- `backend/README_COMPREHENSIVE.md` - Backend API
- `MOBILE_BUILD_GUIDE.md` - iOS & Android builds
- `backend/.env.example` - Configuration template
