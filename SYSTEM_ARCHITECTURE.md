# 🏗️ Africoin Real USDT Transaction System - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     AFRICOIN FRONTEND (React)                   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  React Components                         │   │
│  │  ┌────────────────┐          ┌────────────────┐         │   │
│  │  │   Swap Page    │          │  Navigation    │         │   │
│  │  │   (Updated)    │          │   (Updated)    │         │   │
│  │  └────────────────┘          └────────────────┘         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │            React Hooks & State Management                │   │
│  │                                                            │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │  useUSDTTransaction() Hook  (NEW)                  │ │   │
│  │  │  ├─ sendUSDT()        → Transaction execution      │ │   │
│  │  │  ├─ getBalance()      → Fetch multi-chain balance  │ │   │
│  │  │  ├─ getPrice()        → Get USDT price             │ │   │
│  │  │  ├─ checkStatus()     → Monitor transaction        │ │   │
│  │  │  ├─ isLoading         → Loading state             │ │   │
│  │  │  ├─ error             → Error messages             │ │   │
│  │  │  └─ lastTransaction   → Last result                │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
│                              ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Validation & Utilities Layer                     │   │
│  │  ┌──────────────────────┐      ┌──────────────────────┐ │   │
│  │  │   USDTValidator      │      │ TransactionMonitor   │ │   │
│  │  │   (NEW)              │      │ (NEW)                │ │   │
│  │  │ ├─ validateAddress   │      │ ├─ monitorTx        │ │   │
│  │  │ ├─ validateAmount    │      │ ├─ checkStatus      │ │   │
│  │  │ ├─ validateTransfer  │      │ ├─ trackPolling     │ │   │
│  │  │ ├─ getWarnings       │      │ └─ stopAll          │ │   │
│  │  │ └─ sanitizeInput     │      │                      │ │   │
│  │  └──────────────────────┘      └──────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │  BLOCKCHAIN SERVICES LAYER  (NEW)            │
        │                                               │
        │  ┌────────────────────────────────────────┐  │
        │  │   UnifiedUSDTService                   │  │
        │  │   (Multi-chain abstraction layer)      │  │
        │  │                                        │  │
        │  │  ├─ getMultiChainBalance()             │  │
        │  │  ├─ getUSDTPrice()                     │  │
        │  │  ├─ transferUSDTSolana()               │  │
        │  │  ├─ transferUSDTTron()                 │  │
        │  │  └─ getTransactionStatus()             │  │
        │  └────────────────────────────────────────┘  │
        │    │                                │         │
        │    ├─────────────────┬──────────────┤         │
        │    │                 │              │         │
        │    ▼                 ▼              │         │
        │  ┌──────────────┐  ┌────────────┐  │         │
        │  │SolanaUSDT    │  │ TronUSDT   │  │         │
        │  │Service (NEW) │  │Service(NEW)│  │         │
        │  └──────────────┘  └────────────┘  │         │
        └────────────────────────────────────┘         │
                    │                    │              │
        ┌───────────┴───────────┬───────┴───────┐      │
        │                       │               │      │
        ▼                       ▼               ▼      │
    ┌────────────┐         ┌────────────┐  ┌──────┐   │
    │  Solana    │         │    TRON    │  │Coin  │   │
    │  Devnet    │         │   Shasta   │  │Gecko │   │
    │ (Testnet)  │         │ (Testnet)  │  │API   │   │
    └────────────┘         └────────────┘  └──────┘   │
        ▼                       ▼                       │
    ┌────────────────────────────────────────────┐    │
    │     BLOCKCHAIN NETWORKS                    │    │
    │  ┌──────────────┬──────────────────────┐   │    │
    │  │ SOLANA CHAIN │ TRON CHAIN          │   │    │
    │  │ • Devnet     │ • Shasta Testnet   │   │    │
    │  │ • Mainnet    │ • Mainnet          │   │    │
    │  │ • USDT Mint  │ • USDT Contract    │   │    │
    │  │ • RPC API    │ • RPC API          │   │    │
    │  └──────────────┴──────────────────────┘   │    │
    └────────────────────────────────────────────┘    │
```

---

## Data Flow Diagrams

### 1. Balance Query Flow

```
React Component
      │
      ▼
useUSDTTransaction() Hook
  getBalance()
      │
      ▼
UnifiedUSDTService
  getMultiChainBalance()
      │
      ├─────────────────────────────────┐
      │                                 │
      ▼                                 ▼
SolanaUSDTService               TronUSDTService
  getUSDTBalance()                getUSDTBalance()
      │                                 │
      ▼                                 ▼
Solana RPC API                   TRON RPC API
  getTokenAccount()               queryBalance()
      │                                 │
      ▼                                 ▼
[Balance returned to Component]
```

### 2. Transfer Flow

```
React Component
      │
      ▼
useUSDTTransaction()
  sendUSDT()
      │
      ▼
USDTValidator
  validateTransfer()
      │
      ├─ Valid? Continue
      └─ Invalid? Return Error
      │
      ▼
UnifiedUSDTService
  transferUSDTSolana() or transferUSDTTron()
      │
      ▼
[Blockchain]
      │
      ▼
TransactionMonitor
  monitorTransaction()
      │
      ├─ Poll every 2 seconds
      ├─ Max 1 minute polling
      └─ Return status when confirmed
      │
      ▼
React Component
  [Display result to user]
```

### 3. Transaction Validation Flow

```
User Input (amount, addresses)
      │
      ▼
USDTValidator.validateTransfer()
      │
      ├─ validateAddress(from)
      │  ├─ Check format (Base58, T-prefix)
      │  └─ Return { valid, error }
      │
      ├─ validateAddress(to)
      │  ├─ Check format
      │  └─ Return { valid, error }
      │
      ├─ validateAmount(amount)
      │  ├─ Check $1 - $1M range
      │  └─ Return { valid, error }
      │
      ├─ Check balance sufficiency
      │  ├─ Fetch current balance
      │  └─ Validate amount <= balance
      │
      └─ Return {
            valid: boolean,
            error?: string,
            warnings?: string[]
          }
```

---

## File Dependencies

```
src/pages/Swap.tsx (UPDATED)
    │
    ├─→ src/hooks/useUSDTTransaction.ts (NEW)
    │       │
    │       ├─→ src/services/usdtService.ts (NEW)
    │       │       │
    │       │       ├─→ @solana/web3.js
    │       │       ├─→ @solana/spl-token
    │       │       └─→ tronweb
    │       │
    │       └─→ src/utils/usdtValidator.ts (NEW)
    │
    ├─→ src/utils/usdtValidator.ts
    │       └─→ src/config/usdtConfig.ts
    │
    └─→ src/services/usdtService.ts

src/components/Navigation.tsx (UPDATED)
    └─→ src/styles/Navigation.css (UPDATED)
```

---

## Configuration Flow

```
.env.local (CREATED)
    │
    ├─ REACT_APP_NETWORK
    │  ├─ 'testnet' → Use Devnet/Shasta URLs
    │  └─ 'mainnet' → Use Mainnet URLs
    │
    ├─ REACT_APP_SOLANA_RPC
    │  └─ Runtime Configuration
    │
    ├─ REACT_APP_SOLANA_USDT_MINT
    │  └─ SPL Token Identification
    │
    ├─ REACT_APP_TRON_API
    │  └─ Runtime Configuration
    │
    ├─ REACT_APP_TRON_USDT_ADDRESS
    │  └─ TRC-20 Contract Address
    │
    └─ ... other settings

        ▼

src/config/usdtConfig.ts (EXISTING)
    │
    ├─ NETWORKS object
    │  ├─ solana
    │  │  ├─ mainnet RPC
    │  │  └─ devnet RPC
    │  └─ tron
    │     ├─ mainnet API
    │     └─ shasta API
    │
    ├─ USDT_CONFIG object
    │  ├─ Solana USDT Mint
    │  └─ TRON USDT Contract
    │
    ├─ TRANSACTION_SETTINGS
    │  ├─ Fees
    │  ├─ Timeouts
    │  └─ Confirmations
    │
    └─ VALIDATION
       ├─ Amount ranges
       └─ Address patterns

        ▼

Services/Hooks/Utils
    (Use configuration at runtime)
```

---

## Service Integration Points

### Services Available

```typescript
// 1. Main Services (import from usdtService.ts)
import { 
  solanaUSDT,      // ✅ Solana SPL Service
  tronUSDT,        // ✅ TRON TRC-20 Service  
  unifiedUSDT      // ✅ Multi-chain Wrapper
} from '../services/usdtService';

// 2. React Hook (import from useUSDTTransaction.ts)
import { 
  useUSDTTransaction  // ✅ React Integration Hook
} from '../hooks/useUSDTTransaction';

// 3. Utilities (import from usdtValidator.ts)
import { 
  USDTValidator,      // ✅ Static Validation Methods
  transactionMonitor  // ✅ Transaction Monitor
} from '../utils/usdtValidator';

// 4. Configuration (already exists)
import { 
  usdtConfig          // Configuration constants
} from '../config/usdtConfig';
```

---

## Network Architecture

```
DEVELOPMENT ENVIRONMENT (Testnet)
┌─────────────────────────────────────────────────┐
│ Solana Devnet              TRON Shasta           │
│ RPC: api.devnet.solana.com │ RPC: api.shasta...  │
│ USDT: EhYXq3bff...         │ USDT: TG3XXyEx...   │
│ Free SOL via Faucet        │ Free TRX via Faucet │
└─────────────────────────────────────────────────┘


PRODUCTION ENVIRONMENT (Mainnet)
┌─────────────────────────────────────────────────┐
│ Solana Mainnet             TRON Mainnet          │
│ RPC: api.mainnet...        │ RPC: api.tronstack  │
│ USDT: EPjFWaLb3o...        │ USDT: TR7NHqjeK...  │
│ Real SOL Required          │ Real TRX Required   │
└─────────────────────────────────────────────────┘
```

---

## Component Interaction Map

```
Swap Page Component
    │
    ├─→ Render
    │   ├─ From Token Input
    │   ├─ To Token Selector
    │   └─ Amount Input
    │
    ├─→ useUSDTTransaction Hook
    │   ├─ Initialize on mount
    │   ├─ Setup error callbacks
    │   └─ Return transaction functions
    │
    ├─→ User clicks "Swap"
    │   │
    │   ├─→ USDTValidator.validateTransfer()
    │   │   ├─ Check addresses
    │   │   ├─ Check amount
    │   │   └─ Check balance
    │   │
    │   ├─→ sendUSDT() from hook
    │   │   ├─ Call appropriate service
    │   │   └─ Handle response
    │   │
    │   ├─→ TransactionMonitor
    │   │   ├─ Poll blockchain
    │   │   └─ Update status
    │   │
    │   └─→ Display result
    │       ├─ Show tx hash
    │       ├─ Show explorer link
    │       └─ Reset form
    │
    └─→ Display error (if any)
```

---

## Security Architecture

```
INPUT VALIDATION
├─ USDTValidator.sanitizeInput()      → XSS Prevention
├─ USDTValidator.validateAddress()    → Format Checking
├─ USDTValidator.validateAmount()     → Range Checking
└─ USDTValidator.isHighRiskAddress()  → Compliance Check

TRANSACTION HANDLING
├─ useUSDTTransaction Hook            → Error Management
├─ Try/Catch Blocks                   → Exception Handling
├─ Timeout Protection                 → Network Safety
└─ Confirmation Polling               → Status Verification

SENSITIVE DATA
├─ Private Keys                       → Never logged
├─ Environment Variables              → .env.local
├─ HTTPS Only                         → Production
└─ No Console Logs                    → Production builds

AUDIT TRAIL
├─ Transaction Logging                → History
├─ Error Logging                      → Debugging
├─ User Actions                       → Monitoring
└─ Balance Changes                    → Verification
```

---

## Performance Considerations

```
API CALL OPTIMIZATION
├─ Balance Caching (30s TTL)
├─ Price Caching (60s TTL)
├─ Rate Limiting (1 req/sec)
└─ Batch Queries When Possible

TRANSACTION MONITORING
├─ Poll every 2 seconds
├─ Max 60 second timeout
├─ Exponential backoff on errors
└─ Early termination on confirmation

MEMORY MANAGEMENT
├─ Clear transaction listeners
├─ Stop polling on unmount
├─ Clean up event handlers
└─ Release old cached data
```

---

## Error Handling Flow

```
Operation Initiated
    │
    ▼
Try Block
    │
    ├─ Success
    │  └─→ Return result
    │
    └─ Error Caught
       │
       ├─→ Error Type Check
       │   ├─ Network Error
       │   ├─ Validation Error
       │   ├─ Blockchain Error
       │   └─ Unknown Error
       │
       ├─→ Format Error Message
       │   (User-friendly)
       │
       ├─→ Log for Debugging
       │
       ├─→ Call onError Callback
       │
       └─→ Return Error to UI
           └─→ Display to User
```

---

## Deployment Strategy

```
PHASE 1: Development
├─ Use Testnet Configuration
├─ Test with Free Tokens
├─ Run Unit Tests
└─ Verify Logic Locally

PHASE 2: Staging
├─ Test on Devnet/Shasta
├─ Run Integration Tests
├─ Test Error Scenarios
└─ Performance Testing

PHASE 3: Production
├─ Switch to Mainnet Config
├─ Start with Small Amounts
├─ Monitor Transactions
├─ Gradual Amount Increase
└─ Setup Monitoring Alerts
```

---

*Architecture Diagram - Last Updated 2024*
