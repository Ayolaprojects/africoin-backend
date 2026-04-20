# 🇿🇼 African Coin - Zimbabwe Features Documentation

## Overview
African Coin now includes comprehensive support for Zimbabwe with local payment methods, exchange rates, and financial services tailored for Zimbabwean users.

## Table of Contents
1. [Features](#features)
2. [Components](#components)
3. [Services](#services)
4. [Usage Guide](#usage-guide)
5. [Integration](#integration)
6. [API Endpoints](#api-endpoints)
7. [Best Practices](#best-practices)

---

## Features

### Payment Methods Supported

#### 1. **💚 EcoCash**
- Money transfers to any EcoCash number
- Airtime purchases for all mobile providers
- Instant transactions with SMS confirmation
- Supported formats:
  - +263-78-xxx-xxxx
  - 263-78-xxx-xxxx
  - 0778-xxx-xxxx

#### 2. **🏪 PayZone**
- Withdraw cash from PayZone agents
- No account needed for basic access
- Available at thousands of locations across Zimbabwe
- Find nearby agents through the app

#### 3. **📡 Kwese Remit**
- Send remittances internationally
- Support for 50+ countries
- Competitive exchange rates
- Track remittances in real-time

#### 4. **📱 Mobile Money**
- Multiple providers supported:
  - EcoCash
  - NetOne Money
  - Telecel Money
  - Innbucks
  - ZIPIT
  - OneWallet

#### 5. **🏦 Bank Transfers**
- Direct transfers to Zimbabwean bank accounts
- Supported banks:
  - ZB Bank
  - Eco Bank
  - CABS
  - Stanbic Bank
  - Standard Chartered
  - FBC Bank
  - Steward Bank
  - CBZ Bank
  - POSB
  - ZIMC Bank

### Currencies
- **ZWL** (Zimbabwean Dollar) - Primary currency
- **USD** (US Dollar) - International standard
- **USDT** (Tether) - Stablecoin

---

## Components

### 1. **ZimbabweDashboard.tsx**
Main dashboard component for Zimbabwe-specific features.

```typescript
import ZimbabweDashboard from '../components/ZimbabweDashboard';

<ZimbabweDashboard />
```

**Features:**
- Display current ZWL exchange rates
- Recent transaction history
- Available payment methods
- Account balance in ZWL
- Quick action buttons
- Statistical overview

**Tabs:**
- **Overview** - Balance and quick actions
- **Transactions** - Transaction history
- **Payment Methods** - Available payment methods

### 2. **ZimbabwePage.tsx**
Landing page for Zimbabwe features with hero section and information.

```typescript
import ZimbabwePage from '../pages/ZimbabwePage';

<ZimbabwePage />
```

**Sections:**
- Hero section with call-to-action
- Dashboard integration
- Information about features
- FAQ section
- Exchange rate table

### 3. **PaymentGateway.tsx (Enhanced)**
Updated payment gateway with Zimbabwe support.

```typescript
// Now includes Zimbabwe payment methods
const [country, setCountry] = useState('ZW');
const [currency, setCurrency] = useState<'ZWL' | 'USD' | 'USDT'>('ZWL');
```

**Zimbabwe-Specific Features:**
- EcoCash phone number input
- EcoCash PIN confirmation
- PayZone/Kwese recipient selection
- Exchange rate display
- Multi-step confirmation process

---

## Services

### zimbabweService.ts

Main service for handling Zimbabwe-specific operations.

#### Methods

##### EcoCash Operations
```typescript
// Initiate EcoCash transaction
const tx = await zimbabweService.initiateEcoCash({
  phoneNumber: '+263-78-xxx-xxxx',
  amount: 1000,
  transactionType: 'money_transfer' // or 'airtime'
});

// Confirm with PIN
const confirmed = await zimbabweService.confirmEcoCashPin(
  tx.reference,
  '1234' // PIN
);

// Send money with PIN
const result = await zimbabweService.sendMoneyEcoCash(
  phoneNumber,
  amount,
  pin
);
```

##### Cassava Operations
```typescript
// Initiate PayZone/Kwese
const tx = await zimbabweService.initiateCassava({
  method: 'payzone' or 'kwese_remit',
  amount: 1000,
  recipient: 'John Doe'
});

// Confirm transaction
const confirmed = await zimbabweService.confirmCassavaTransaction(
  tx.reference,
  pin
);
```

##### Exchange Rates
```typescript
// Get current exchange rates
const rates = await zimbabweService.getExchangeRates();
// Returns: { currency, zwlRate, usdRate, timestamp }

// Get balance
const balance = await zimbabweService.getZWLBalance(userId);

// Get transaction history
const txs = await zimbabweService.getZimbabweTransactionHistory(
  userId,
  limit
);
```

##### Utilities
```typescript
// Get available payment methods
const methods = zimbabweService.getAvailablePaymentMethods();
// Returns: ['ecocash', 'ecocash_airtime', 'payzone', 'kwese', ...]

// Get Zimbabwean banks
const banks = zimbabweService.getZimbabweanBanks();

// Get mobile money providers
const providers = zimbabweService.getMobileMoneyProviders();

// Get PayZone agents
const agents = await zimbabweService.getNearbyPayZoneAgents(
  latitude,
  longitude
);

// Get analytics
const analytics = await zimbabweService.getZimbabweAnalytics(userId);
```

---

## Usage Guide

### Setting Up Zimbabwe Mode

1. **In Your App Component:**
```typescript
import ZimbabwePage from './pages/ZimbabwePage';

export default function App() {
  return <ZimbabwePage />;
}
```

2. **Enable Zimbabwe Country:**
```typescript
const [country, setCountry] = useState('ZW');
```

3. **Use Zimbabwe Payment Methods:**
```typescript
if (country === 'ZW') {
  // Show Zimbabwe-specific payment methods
  const methods = zimbabweService.getAvailablePaymentMethods();
  // Render EcoCash, PayZone, Kwese, etc.
}
```

### Making a Payment (EcoCash)

```typescript
const handleEcoCashPayment = async (phoneNumber: string, amount: number, pin: string) => {
  try {
    // Step 1: Initiate
    const tx = await zimbabweService.initiateEcoCash({
      phoneNumber,
      amount,
      transactionType: 'money_transfer'
    });
    
    // Step 2: Confirm PIN
    const result = await zimbabweService.confirmEcoCashPin(
      tx.reference,
      pin
    );
    
    console.log('Payment successful:', result);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

### Getting Exchange Rates

```typescript
const handleGetRates = async () => {
  try {
    const rates = await zimbabweService.getExchangeRates();
    console.log(`1 ZWL = $${1/rates.usdRate}`);
    console.log(`1 USD = ZWL ${rates.usdRate}`);
  } catch (error) {
    console.error('Failed to get rates:', error);
  }
};
```

### Transaction History

```typescript
const loadTransactionHistory = async (userId: string) => {
  try {
    const txs = await zimbabweService.getZimbabweTransactionHistory(
      userId,
      10 // last 10 transactions
    );
    
    txs.forEach(tx => {
      console.log(`${tx.method}: ZWL ${tx.amount} - ${tx.status}`);
    });
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
};
```

---

## Integration

### Step 1: Install Dependencies
```bash
cd AFRICOIN-APP\ -\ IOS
npm install
```

### Step 2: Add Zimbabwe Pages to Routing
```typescript
import ZimbabwePage from './pages/ZimbabwePage';
import PaymentGateway from './pages/PaymentGateway';

const routes = [
  { path: '/zimbabwe', component: ZimbabwePage },
  { path: '/payment', component: PaymentGateway },
];
```

### Step 3: Configure Backend API
Update the zimbabweService API base URL:
```typescript
// In zimbabweService.ts
private apiBaseUrl = 'https://api.africoin.io/v1/zimbabwe';
```

### Step 4: Import Styles
```typescript
import '../styles/ZimbabwePage.css';
import '../styles/ZimbabweDashboard.css';
import '../styles/Dashboard.css';
import '../styles/PaymentGateway.css';
```

---

## API Endpoints

All Zimbabwe-specific endpoints follow this pattern:
```
GET/POST https://api.africoin.io/v1/zimbabwe/{endpoint}
```

### EcoCash Endpoints
- `POST /ecocash/initiate` - Start EcoCash transaction
- `POST /ecocash/confirm` - Confirm with PIN
- `GET /ecocash/status/{reference}` - Check transaction status

### Cassava Endpoints (PayZone/Kwese)
- `POST /cassava/initiate` - Start Cassava transaction
- `POST /cassava/confirm` - Confirm transaction
- `GET /cassava/agents` - Get nearby PayZone agents

### General Endpoints
- `GET /exchange-rates` - Get current rates
- `GET /balance?userId={id}` - Get account balance
- `GET /transactions?userId={id}&limit={n}` - Get transaction history
- `GET /analytics?userId={id}` - Get user analytics
- `POST /bank-accounts` - Save bank account
- `GET /bank-accounts?userId={id}` - Get saved accounts

---

## Best Practices

### 1. **Phone Number Validation**
Always validate phone numbers before processing:
```typescript
const isValidPhone = (phone: string) => {
  const patterns = [
    /^\+263\d{8,9}$/,     // +263xxxxxxxxx
    /^263\d{8,9}$/,       // 263xxxxxxxxx
    /^0\d{9}$/,           // 0xxxxxxxxx
    /^\+263-\d{2}-\d{3}-\d{4}$/, // +263-78-xxx-xxxx
  ];
  return patterns.some(p => p.test(phone.replace(/\s/g, '')));
};
```

### 2. **Error Handling**
```typescript
try {
  // API call
} catch (error) {
  if (error.code === 'PHONE_INVALID') {
    // Show user-friendly error
  } else if (error.code === 'INSUFFICIENT_BALANCE') {
    // Handle balance error
  } else {
    // Generic error handling
  }
}
```

### 3. **Currency Conversion**
```typescript
const convertCurrency = (amount: number, from: string, to: string, rates: any) => {
  if (from === to) return amount;
  
  // Convert to base currency (ZWL)
  const zwlAmount = from === 'ZWL' ? amount : amount * rates.zwlRate;
  
  // Convert to target currency
  return to === 'ZWL' ? zwlAmount : zwlAmount / rates[`${to}Rate`];
};
```

### 4. **Caching Exchange Rates**
```typescript
const cacheKey = 'zimbabwe_exchange_rates';
const cachedRates = localStorage.getItem(cacheKey);
const now = Date.now();

if (cachedRates) {
  const { data, timestamp } = JSON.parse(cachedRates);
  // Update cache if older than 1 hour
  if (now - timestamp < 3600000) {
    return data;
  }
}

// Fetch new rates
const rates = await zimbabweService.getExchangeRates();
localStorage.setItem(cacheKey, JSON.stringify({ data: rates, timestamp: now }));
```

### 5. **Transaction Monitoring**
```typescript
const pollTransactionStatus = async (reference: string) => {
  let attempts = 0;
  const maxAttempts = 30; // 5 minutes with 10s interval
  
  while (attempts < maxAttempts) {
    const tx = await zimbabweService.getTransactionStatus(reference);
    
    if (tx.status === 'completed' || tx.status === 'failed') {
      return tx;
    }
    
    await new Promise(resolve => setTimeout(resolve, 10000));
    attempts++;
  }
  
  throw new Error('Transaction monitoring timeout');
};
```

### 6. **Security Best Practices**
- Never log PINs or sensitive data
- Always use HTTPS for API calls
- Implement rate limiting (3-5 attempts per hour)
- Add 2FA for sensitive operations
- Validate all inputs on both client and server

---

## File Structure

```
src/
├── pages/
│   ├── ZimbabwePage.tsx
│   └── PaymentGateway.tsx (enhanced)
├── components/
│   └── ZimbabweDashboard.tsx
├── services/
│   └── zimbabweService.ts
└── styles/
    ├── ZimbabwePage.css
    ├── ZimbabweDashboard.css
    └── PaymentGateway.css (enhanced)
```

---

## Troubleshooting

### EcoCash Issues
- **Invalid phone number:** Ensure format is correct (e.g., +263-78-xxx-xxxx)
- **PIN rejected:** Verify PIN is 4 digits
- **Transaction pending:** Check status after 2-3 minutes

### Exchange Rate Issues
- **Rates not updating:** Clear cache and refresh
- **Conversion errors:** Verify rate format is numeric

### Payment Gateway Issues
- **Country not showing:** Check if 'ZW' is in country options
- **Methods missing:** Verify `getAvailablePaymentMethods()` is called after country selection

---

## Support

For issues or feature requests:
- GitHub Issues: [AFRICOIN/issues](https://github.com/africoin/issues)
- Email: support@africoin.io
- WhatsApp: +263-78-xxx-xxxx

---

## License

MIT License - See LICENSE file for details

---

**Last Updated:** 2024
**Version:** 1.0.0
