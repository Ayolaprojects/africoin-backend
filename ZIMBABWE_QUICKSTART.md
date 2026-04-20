# 🇿🇼 Zimbabwe Features - Quick Start Guide

## Getting Started in 5 Minutes

### 1. **Access Zimbabwe Features**

Navigate to the Zimbabwe page:
```
http://localhost:3000/zimbabwe
```

Or click "🇿🇼 Zimbabwe" in the navigation menu.

---

## 2. Quick Navigation

### Main Routes
```
/zimbabwe          → Zimbabwe landing page
/payments          → Payment gateway (with Zimbabwe support)
/dashboard         → Main dashboard (shows Zimbabwe transactions)
```

### Dashboard Tabs
- 📊 **Overview** - Balance and quick actions
- 📜 **Transactions** - Transaction history
- 💳 **Payment Methods** - Available methods

---

## 3. Using Payment Methods

### EcoCash Transfer

```typescript
// 1. Select EcoCash from payment methods
// 2. Enter phone number: +263-78-xxx-xxxx
// 3. Enter amount in ZWL
// 4. Click "Continue to KYC"
// 5. Verify identity
// 6. Enter PIN when prompted
// 7. Confirm payment
```

**Phone Number Formats:**
- ✅ +263-78-xxx-xxxx
- ✅ 263-78-xxx-xxxx  
- ✅ 0778-xxx-xxxx

### PayZone Withdrawal

```typescript
// 1. Select PayZone from payment methods
// 2. Enter recipient name
// 3. Enter amount
// 4. Find nearby agent
// 5. Complete transaction at agent
```

### Kwese Remittance

```typescript
// 1. Select Kwese Remit
// 2. Choose destination country
// 3. Enter recipient details
// 4. Verify with PIN
// 5. Track remittance
```

---

## 4. Accessing Dashboard Data

### Get Exchange Rates
```typescript
import { zimbabweService } from './services/zimbabweService';

const rates = await zimbabweService.getExchangeRates();
console.log(`1 USD = ZWL ${rates.usdRate}`);
```

### Get Transaction History
```typescript
const txs = await zimbabweService.getZimbabweTransactionHistory(userId);
txs.forEach(tx => {
  console.log(`${tx.method}: ZWL ${tx.amount}`);
});
```

### Get Account Balance
```typescript
const balance = await zimbabweService.getZWLBalance(userId);
console.log(`Balance: ZWL ${balance}`);
```

---

## 5. Quick Code Examples

### Making a Payment
```typescript
import { zimbabweService } from './services/zimbabweService';

async function sendEcoCash() {
  try {
    // Initiate
    const tx = await zimbabweService.initiateEcoCash({
      phoneNumber: '+263-78-123-4567',
      amount: 5000,
      transactionType: 'money_transfer'
    });
    
    // Confirm
    const result = await zimbabweService.confirmEcoCashPin(
      tx.reference,
      '1234' // PIN
    );
    
    console.log('Success:', result);
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

### Currency Conversion
```typescript
const rates = await zimbabweService.getExchangeRates();

// USD to ZWL
const zwlAmount = 100 * rates.usdRate;
console.log(`100 USD = ZWL ${zwlAmount}`);

// ZWL to USD
const usdAmount = 50000 / rates.usdRate;
console.log(`50,000 ZWL = USD ${usdAmount}`);
```

### Transaction Monitoring
```typescript
async function trackTransaction(reference: string) {
  let status = 'pending';
  let attempts = 0;
  
  while (status === 'pending' && attempts < 30) {
    const tx = await zimbabweService.getTransactionStatus(reference);
    status = tx.status;
    
    if (status === 'completed') {
      console.log('✅ Transaction successful!');
      break;
    } else if (status === 'failed') {
      console.log('❌ Transaction failed');
      break;
    }
    
    await new Promise(r => setTimeout(r, 10000));
    attempts++;
  }
}
```

---

## 6. Form Integration

### EcoCash Form in React
```typescript
const [phone, setPhone] = useState('');
const [amount, setAmount] = useState(0);
const [pin, setPin] = useState('');
const [loading, setLoading] = useState(false);

const handleEcoCashPayment = async () => {
  setLoading(true);
  try {
    const tx = await zimbabweService.initiateEcoCash({
      phoneNumber: phone,
      amount,
      transactionType: 'money_transfer'
    });
    
    const result = await zimbabweService.confirmEcoCashPin(
      tx.reference,
      pin
    );
    
    alert('Payment successful!');
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

return (
  <div>
    <input 
      value={phone}
      onChange={e => setPhone(e.target.value)}
      placeholder="+263-78-xxx-xxxx"
    />
    <input 
      type="number"
      value={amount}
      onChange={e => setAmount(Number(e.target.value))}
      placeholder="Amount in ZWL"
    />
    <input 
      type="password"
      value={pin}
      onChange={e => setPin(e.target.value)}
      placeholder="PIN"
      maxLength="4"
    />
    <button onClick={handleEcoCashPayment} disabled={loading}>
      {loading ? 'Processing...' : 'Send Money'}
    </button>
  </div>
);
```

---

## 7. Available Payment Methods

| Method | Code | Status | Min Amount | Max Amount |
|--------|------|--------|-----------|-----------|
| EcoCash | `ecocash` | ✅ Active | ZWL 50 | ZWL 500,000 |
| EcoCash Airtime | `ecocash_airtime` | ✅ Active | ZWL 50 | ZWL 50,000 |
| PayZone | `payzone` | ✅ Active | ZWL 100 | ZWL 1,000,000 |
| Kwese Remit | `kwese` | ✅ Active | USD 1 | USD 10,000 |
| Bank Transfer | `bank_transfer` | ✅ Active | ZWL 100 | ZWL 5,000,000 |

---

## 8. Supported Banks

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

---

## 9. Troubleshooting

### ❌ "Invalid phone number"
**Solution:** Use format +263-78-xxx-xxxx or 0778-xxx-xxxx

### ❌ "Transaction pending"
**Solution:** Wait 2-3 minutes and check status

### ❌ "Insufficient balance"
**Solution:** Add funds to your EcoCash account first

### ❌ "PIN rejected"
**Solution:** Ensure PIN is 4 digits, try again

### ❌ "Exchange rate not loading"
**Solution:** Check internet connection, try refresh

---

## 10. Development Tips

### Testing Locally
```bash
# Start development server
npm run dev

# Access Zimbabwe page
# http://localhost:3000/zimbabwe

# Open DevTools
# Press F12
```

### Mock Data
```typescript
// Use these for testing without real backend
const mockRates = {
  currency: 'ZWL',
  zwlRate: 1,
  usdRate: 850,
  timestamp: new Date().toISOString()
};

const mockTransaction = {
  reference: 'ECO-123456-ABC123',
  status: 'completed',
  amount: 5000,
  currency: 'ZWL',
  method: 'ecocash',
  createdAt: new Date().toISOString()
};
```

### Console Debugging
```typescript
// Enable debug logging
localStorage.setItem('debug', 'zimbabwe:*');

// Check exchange rates
window.zimbabweService.getExchangeRates().then(r => console.log(r));

// Check transactions
window.zimbabweService.getZimbabweTransactionHistory('test-user').then(t => console.log(t));
```

---

## 11. Environment Setup

### Required Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "typescript": "^4.5.0"
}
```

### Optional Dependencies
```bash
npm install sentry  # Error tracking
npm install datadog # Performance monitoring
npm install mixpanel # Analytics
```

---

## 12. File Structure Reference

```
src/
├── pages/
│   ├── ZimbabwePage.tsx ................. Main landing page
│   └── PaymentGateway.tsx ............... Enhanced payment gateway
├── components/
│   └── ZimbabweDashboard.tsx ............ Dashboard component
├── services/
│   └── zimbabweService.ts .............. Zimbabwe operations
└── styles/
    ├── ZimbabwePage.css
    ├── ZimbabweDashboard.css
    └── PaymentGateway.css
```

---

## 13. Best Practices

✅ **DO:**
- Validate phone numbers before submission
- Cache exchange rates locally
- Implement proper error handling
- Use TypeScript for type safety
- Test on real devices

❌ **DON'T:**
- Store PINs in localStorage
- Make API calls without error handling
- Log sensitive user data
- Use old exchange rates
- Ignore HTTPS requirement

---

## 14. API Response Examples

### Exchange Rates
```json
{
  "currency": "ZWL",
  "zwlRate": 1,
  "usdRate": 850,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### EcoCash Transaction
```json
{
  "reference": "ECO-123456-ABC123",
  "status": "completed",
  "amount": 5000,
  "currency": "ZWL",
  "method": "ecocash",
  "createdAt": "2024-01-15T10:25:00Z"
}
```

### Transaction History
```json
[
  {
    "reference": "ECO-111111-AAA111",
    "method": "ecocash",
    "amount": 2000,
    "status": "completed",
    "date": "2024-01-15T09:00:00Z"
  },
  {
    "reference": "PZO-222222-BBB222",
    "method": "payzone",
    "amount": 5000,
    "status": "completed",
    "date": "2024-01-14T15:30:00Z"
  }
]
```

---

## 15. Support & Resources

### Documentation
- [Complete Feature Guide](./ZIMBABWE_FEATURES.md)
- [Implementation Summary](./ZIMBABWE_IMPLEMENTATION_SUMMARY.md)
- [README](./README.md)

### Code Examples
- In-component examples in source code
- Type definitions in zimbabweService.ts
- Styled components in styles/

### Getting Help
```
📧 Email: dev@africoin.io
💬 Discord: https://discord.gg/africoin
🐛 Issues: https://github.com/africoin/issues
📱 WhatsApp: +263-78-xxx-xxxx
```

---

## Checklist for Getting Started

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `/zimbabwe`
- [ ] Test EcoCash form
- [ ] Check Dashboard tabs
- [ ] Review exchange rates
- [ ] Read ZIMBABWE_FEATURES.md
- [ ] Check zimbabweService.ts examples
- [ ] Set up error handling
- [ ] Deploy to production

---

## Next Steps

1. ✅ Set up local development environment
2. ✅ Test Zimbabwe features locally
3. ✅ Review component structure
4. ✅ Integrate with your backend
5. ✅ Test with real data
6. ✅ Deploy to staging
7. ✅ User acceptance testing
8. ✅ Deploy to production

---

**Ready to go!** 🚀

Questions? Check the [Full Feature Guide](./ZIMBABWE_FEATURES.md) or reach out to the team.

Happy coding! 💻
