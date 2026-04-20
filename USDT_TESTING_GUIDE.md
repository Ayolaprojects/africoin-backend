# USDT Transaction Testing Guide

## Overview
This guide provides step-by-step instructions for testing the real USDT transaction system on Solana and TRON blockchains.

## Table of Contents
1. [Environment Setup](#environment-setup)
2. [Testing Strategy](#testing-strategy)
3. [Testnet Setup](#testnet-setup)
4. [Unit Tests](#unit-tests)
5. [Integration Tests](#integration-tests)
6. [Mainnet Migration](#mainnet-migration)

---

## Environment Setup

### 1. Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)
- Git for version control

### 2. Install Dependencies
```bash
npm install @solana/web3.js @solana/spl-token @solana/wallet-adapter-react tronweb axios
```

### 3. Create .env.local
```env
# Testnet Configuration
REACT_APP_NETWORK=testnet
REACT_APP_SOLANA_RPC=https://api.devnet.solana.com
REACT_APP_SOLANA_USDT_MINT=EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9
REACT_APP_TRON_API=https://api.shasta.trongrid.io
REACT_APP_TRON_USDT_ADDRESS=TG3XXyExBkPp9nzdajQjthH6ykqS3koN21
REACT_APP_DEBUG=true
REACT_APP_LOG_TRANSACTIONS=true
```

---

## Testing Strategy

### Three-Phase Testing Approach

```
Phase 1: Unit Testing (No blockchain)
    ↓
Phase 2: Testnet Integration (Solana Devnet, TRON Shasta)
    ↓
Phase 3: Mainnet Migration (Real transactions, real money)
```

### Phase Characteristics

| Phase | Network | Cost | Risk | Purpose |
|-------|---------|------|------|---------|
| **Unit** | None | Free | None | Validate code logic |
| **Testnet** | Devnet/Shasta | Free | None | Test blockchain integration |
| **Mainnet** | Production | Real SOL/TRON | High | Live transactions |

---

## Testnet Setup

### Solana Devnet Testing

#### Step 1: Get Devnet SOL
```bash
# Using solana-cli (if installed)
solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet

# Or use faucet website: https://faucet.solana.com
# Paste your wallet address and request SOL
```

#### Step 2: Get Devnet USDT
```bash
# Option 1: Mint USDT on devnet (requires devnet token program setup)
# Option 2: Use existing devnet USDT tokens
# Mint: EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9
```

#### Step 3: Test Balance Checking
```typescript
import { solanaUSDT } from '../services/usdtService';

async function testSolanaBalance() {
  try {
    const walletAddress = 'YOUR_DEVNET_WALLET_ADDRESS';
    const balance = await solanaUSDT.getUSDTBalance(walletAddress);
    console.log('USDT Balance:', balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}
```

#### Step 4: Test Transfer
```typescript
import { Keypair } from '@solana/web3.js';
import { solanaUSDT } from '../services/usdtService';

async function testSolanaTransfer() {
  try {
    // Load your keypair (DO NOT expose private keys in code!)
    const keypair = Keypair.fromSecretKey(
      new Uint8Array([/* your secret key */])
    );
    
    const recipientAddress = 'RECIPIENT_WALLET_ADDRESS';
    const amount = 1; // 1 USDT
    
    const result = await solanaUSDT.transferUSDT(
      keypair,
      recipientAddress,
      amount
    );
    
    console.log('Transfer successful!');
    console.log('Signature:', result.txSignature);
    console.log('Explorer:', `https://explorer.solana.com/tx/${result.txSignature}?cluster=devnet`);
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}
```

### TRON Shasta Testnet Testing

#### Step 1: Get Shasta TRX
```bash
# Visit TRON Shasta Faucet:
# https://www.trongrid.io/shasta/

# Request free Shasta TRX (enough for transaction fees)
```

#### Step 2: Get Shasta USDT
```bash
# USDT Contract on Shasta:
# TG3XXyExBkPp9nzdajQjthH6ykqS3koN21

# Can be obtained from:
# 1. Existing testnet holders
# 2. Bridge from mainnet (if available)
# 3. Custom contract deployment
```

#### Step 3: Test Balance Checking
```typescript
import { tronUSDT } from '../services/usdtService';

async function testTronBalance() {
  try {
    const walletAddress = 'TSHASTA_WALLET_ADDRESS';
    const balance = await tronUSDT.getUSDTBalance(walletAddress);
    console.log('USDT Balance:', balance);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}
```

#### Step 4: Test Transfer
```typescript
import { tronUSDT } from '../services/usdtService';

async function testTronTransfer() {
  try {
    const fromAddress = 'YOUR_SHASTA_ADDRESS';
    const toAddress = 'RECIPIENT_SHASTA_ADDRESS';
    const amount = 1; // 1 USDT
    const privateKey = 'YOUR_PRIVATE_KEY'; // DO NOT expose!
    
    const result = await tronUSDT.transferUSDT(
      fromAddress,
      toAddress,
      amount,
      privateKey
    );
    
    console.log('Transfer successful!');
    console.log('Transaction:', result.txHash);
    console.log('Explorer:', `https://shasta.tronscan.org/#/transaction/${result.txHash}`);
  } catch (error) {
    console.error('Transfer failed:', error);
  }
}
```

---

## Unit Tests

### Create Test File: `src/__tests__/usdtValidator.test.ts`

```typescript
import { USDTValidator } from '../utils/usdtValidator';

describe('USDTValidator', () => {
  describe('validateAddress', () => {
    test('accepts valid Solana addresses', () => {
      const result = USDTValidator.validateAddress(
        'EPjFWaLb3odccccccccccccccccccccccccccG',
        'solana'
      );
      expect(result.valid).toBe(true);
    });

    test('accepts valid TRON addresses', () => {
      const result = USDTValidator.validateAddress(
        'TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6',
        'tron'
      );
      expect(result.valid).toBe(true);
    });

    test('rejects invalid addresses', () => {
      const result = USDTValidator.validateAddress(
        'invalid_address_123',
        'solana'
      );
      expect(result.valid).toBe(false);
    });
  });

  describe('validateAmount', () => {
    test('accepts valid amounts', () => {
      const result = USDTValidator.validateAmount(100, 'USDT');
      expect(result.valid).toBe(true);
    });

    test('rejects amounts below minimum', () => {
      const result = USDTValidator.validateAmount(0.001, 'USDT');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('minimum');
    });

    test('rejects amounts above maximum', () => {
      const result = USDTValidator.validateAmount(2000000, 'USDT');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('maximum');
    });
  });

  describe('validateTransfer', () => {
    test('validates complete transfer data', () => {
      const validation = USDTValidator.validateTransfer(
        'EPjFWaLb3odccccccccccccccccccccccccccG',
        'TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6',
        100,
        'solana',
        500
      );
      
      expect(validation.valid).toBe(true);
    });

    test('detects insufficient balance', () => {
      const validation = USDTValidator.validateTransfer(
        'EPjFWaLb3odccccccccccccccccccccccccccG',
        'TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6',
        1000,
        'solana',
        100 // Only 100 balance
      );
      
      expect(validation.valid).toBe(false);
      expect(validation.warnings).toContain('insufficient_balance');
    });
  });
});
```

### Run Unit Tests
```bash
npm test -- usdtValidator.test.ts
```

---

## Integration Tests

### Component Integration Test

```typescript
// src/__tests__/Swap.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Swap from '../pages/Swap';
import { WalletProvider } from '@solana/wallet-adapter-react';

describe('Swap Component Integration', () => {
  test('displays balance on wallet connection', async () => {
    render(
      <WalletProvider wallets={[]}>
        <Swap />
      </WalletProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Balance:/i)).toBeInTheDocument();
    });
  });

  test('validates amount input', async () => {
    render(
      <WalletProvider wallets={[]}>
        <Swap />
      </WalletProvider>
    );

    const input = screen.getByPlaceholderText(/0.00/i);
    fireEvent.change(input, { target: { value: '-100' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid amount/i)).toBeInTheDocument();
    });
  });

  test('shows insufficient balance warning', async () => {
    render(
      <WalletProvider wallets={[]}>
        <Swap />
      </WalletProvider>
    );

    const input = screen.getByPlaceholderText(/0.00/i);
    fireEvent.change(input, { target: { value: '99999' } });
    
    await waitFor(() => {
      expect(screen.getByText(/Insufficient balance/i)).toBeInTheDocument();
    });
  });
});
```

### Run Integration Tests
```bash
npm test -- Swap.integration.test.tsx
```

---

## Mainnet Migration

### Checklist Before Going Live

- [ ] All testnet tests passing
- [ ] Code reviewed by another developer
- [ ] Environment variables set for mainnet
- [ ] Solana USDT mint verified: `EPjFWaLb3od...`
- [ ] TRON USDT contract verified: `TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6`
- [ ] Wallet backup and recovery tested
- [ ] Private key management plan in place
- [ ] Rate limiting implemented
- [ ] Error handling and logging complete
- [ ] Transaction monitoring setup
- [ ] User documentation completed

### Step 1: Update Environment Variables

```env
# Switch to mainnet
REACT_APP_NETWORK=mainnet
REACT_APP_SOLANA_RPC=https://api.mainnet-beta.solana.com
REACT_APP_SOLANA_USDT_MINT=EPjFWaLb3odccccccccccccccccccccccccccG
REACT_APP_TRON_API=https://api.tronstack.io
REACT_APP_TRON_USDT_ADDRESS=TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6
REACT_APP_DEBUG=false
REACT_APP_LOG_TRANSACTIONS=true
```

### Step 2: Enable Production Logging

```typescript
// In your main App.tsx
if (process.env.REACT_APP_LOG_TRANSACTIONS === 'true') {
  console.log('🔴 MAINNET MODE - Logging all transactions');
  // Setup transaction logging service
}
```

### Step 3: Start with Small Transactions

```typescript
async function startWithSmallTransactions() {
  // Begin with $1-$10 transactions
  // Monitor each transaction closely
  // Verify blockchain confirmation
  // Check balance updates
}
```

### Step 4: Gradual Rollout

- Day 1-3: $1-10 transactions only
- Day 4-7: $10-100 transactions
- Week 2+: Full transaction range

### Step 5: Monitor Transactions

```typescript
import { transactionMonitor } from '../utils/usdtValidator';

async function monitorMainnetTransaction(txHash: string, blockchain: string) {
  const status = await transactionMonitor.monitorTransaction(txHash, blockchain);
  
  if (status.confirmed) {
    console.log('✅ Transaction confirmed!');
  } else if (status.failed) {
    console.log('❌ Transaction failed!');
    // Implement retry logic or user notification
  } else {
    console.log('⏳ Still pending...');
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Token account does not exist" Error
**Cause**: Associated Token Account (ATA) not created  
**Solution**: Create ATA first
```typescript
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const ata = getAssociatedTokenAddressSync(
  USDT_MINT,
  userWallet
);
```

#### 2. "Invalid signature" Error
**Cause**: Transaction format issue  
**Solution**: Verify transaction structure
```typescript
const transaction = new Transaction();
transaction.add(instruction);
const { blockhash } = await connection.getLatestBlockhash();
transaction.recentBlockhash = blockhash;
transaction.feePayer = payer;
```

#### 3. "Insufficient SOL for fees"
**Cause**: Need SOL for transaction fees  
**Solution**: Add SOL balance check
```typescript
const solBalance = await connection.getBalance(wallet);
// Ensure balance > transaction fee
```

#### 4. TRON Transaction Timeout
**Cause**: Network congestion  
**Solution**: Increase timeout or retry
```typescript
REACT_APP_TX_TIMEOUT=120000  // 2 minutes
```

---

## Performance Optimization

### Caching Balance Queries
```typescript
const balanceCache = new Map<string, { balance: number; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

async function getCachedBalance(address: string): Promise<number> {
  const cached = balanceCache.get(address);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.balance;
  }

  const balance = await solanaUSDT.getUSDTBalance(address);
  balanceCache.set(address, { balance, timestamp: Date.now() });
  return balance;
}
```

### Rate Limiting
```typescript
const rateLimit = {
  lastRequest: 0,
  minInterval: 1000, // 1 second between requests
};

function canMakeRequest(): boolean {
  const now = Date.now();
  if (now - rateLimit.lastRequest >= rateLimit.minInterval) {
    rateLimit.lastRequest = now;
    return true;
  }
  return false;
}
```

---

## Security Best Practices

1. **Never expose private keys**
   ```typescript
   // ❌ WRONG
   const privateKey = 'abc123...';
   
   // ✅ RIGHT
   const privateKey = process.env.REACT_APP_PRIVATE_KEY;
   ```

2. **Always use HTTPS**
   - Production deployment must use HTTPS
   - Never transmit keys over HTTP

3. **Implement rate limiting**
   - Prevent abuse and accidental mass transfers
   - Add user confirmation dialogs

4. **Log all transactions**
   - Create audit trail
   - Helps with troubleshooting

5. **Use environment variables**
   - Never hardcode network endpoints
   - Never hardcode contract addresses

---

## Conclusion

Following this testing guide ensures a smooth, safe transition from development to production. Always test thoroughly on testnet before mainnet deployment.

For additional support:
- 📖 [Solana Documentation](https://docs.solana.com)
- 🔗 [TRON Developer Guide](https://developers.tron.network)
- 💬 [Community Support](https://github.com/africoin-io/africoin-app/discussions)
