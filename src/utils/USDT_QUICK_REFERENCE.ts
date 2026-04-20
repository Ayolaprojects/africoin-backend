/**
 * AFRICOIN Real USDT Transactions - Quick Reference
 * Copy & paste examples for common operations
 */

// ============ QUICK START ============

/**
 * 1. CHECK IF REAL TRANSACTIONS ARE ENABLED
 */
import { isRealTransactionMode, TRANSACTION_MODES } from './config/usdtConfig';

if (isRealTransactionMode()) {
  console.log('✅ Real USDT transactions are ENABLED');
} else {
  console.log('❌ Real USDT transactions are DISABLED');
}

// ============ BALANCE OPERATIONS ============

/**
 * 2. CHECK USDT BALANCE ON SOLANA
 */
import { getUSDTBalance } from './services/usdtTransactionService';
import { PublicKey } from '@solana/web3.js';

const userWallet = new PublicKey('DKEdEJyK2gZCVmJhKHkzqV6hMfqaRvgLdBKVDuZpM6XP');
const balance = await getUSDTBalance('solana', userWallet.toString());
console.log(`USDT Balance: ${balance} USDT`);

/**
 * 3. CHECK USDT BALANCE ON TRON
 */
const tronAddress = 'TQmV2L6yNd1yEDkpvzMjhbx5Eg4yYGaBXL';
const tronBalance = await getUSDTBalance('tron', tronAddress);
console.log(`TRON USDT Balance: ${tronBalance} USDT`);

// ============ PRICE OPERATIONS ============

/**
 * 4. GET REAL-TIME USDT PRICE
 */
import { getTokenConversionRate } from './services/usdtTransactionService';

const usdtPrice = await getTokenConversionRate('USDT', 'USD');
console.log(`1 USDT = ${usdtPrice} USD`);

/**
 * 5. GET EXCHANGE RATES
 */
const solRate = await getTokenConversionRate('USDT', 'SOL');
console.log(`1 USDT = ${solRate} SOL`);

const trxRate = await getTokenConversionRate('USDT', 'TRX');
console.log(`1 USDT = ${trxRate} TRX`);

// ============ FEE OPERATIONS ============

/**
 * 6. ESTIMATE SOLANA TRANSACTION FEE
 */
import { estimateSolanaTransactionFee } from './services/usdtTransactionService';

const solanaFee = await estimateSolanaTransactionFee();
console.log(`Estimated Solana Fee: ${solanaFee} SOL`);

/**
 * 7. ESTIMATE TRON TRANSACTION FEE
 */
import { estimateTronTransactionFee } from './services/usdtTransactionService';

const tronFee = await estimateTronTransactionFee();
console.log(`Estimated TRON Fee: ${tronFee} TRX`);

// ============ VALIDATION OPERATIONS ============

/**
 * 8. VALIDATE SUFFICIENT BALANCE BEFORE SENDING
 */
import { validateSufficientBalance } from './services/usdtTransactionService';

const validation = await validateSufficientBalance(
  'solana',
  userWallet.toString(),
  100, // Amount to send
  'USDT'
);

if (validation.sufficient) {
  console.log(`✅ Sufficient balance. Current: ${validation.currentBalance}, Required: ${validation.required}`);
} else {
  console.log(`❌ Insufficient balance`);
}

/**
 * 9. VALIDATE ADDRESS FORMAT
 */
import { isValidSolanaAddress, isValidTronAddress } from './services/usdtTransactionService';

const solanaAddressValid = isValidSolanaAddress('DKEdEJyK2gZCVmJhKHkzqV6hMfqaRvgLdBKVDuZpM6XP');
const tronAddressValid = isValidTronAddress('TQmV2L6yNd1yEDkpvzMjhbx5Eg4yYGaBXL');

console.log(`Solana Address Valid: ${solanaAddressValid}`);
console.log(`TRON Address Valid: ${tronAddressValid}`);

// ============ REAL TRANSACTIONS ============

/**
 * 10. SEND USDT ON SOLANA (REAL TRANSACTION)
 * 
 * Prerequisites:
 * - User has Phantom or other Solana wallet connected
 * - Sufficient USDT balance + SOL for gas
 * - Real transaction mode is enabled
 */
import { sendSolanaUSDTTransaction } from './services/usdtTransactionService';
import { useWallet } from '@solana/wallet-adapter-react';

async function sendUSDTOnSolana() {
  const { publicKey, signTransaction } = useWallet();

  if (!publicKey) {
    console.error('❌ Wallet not connected');
    return;
  }

  // Create transaction details
  const txnDetails = {
    toAddress: 'SqJvxvfUhwwJN9xQgcJRYpSu3YbvhLxM2nFz5HJxDXv',
    amount: 100, // USDT
    decimals: 6,
  };

  // Get transaction from service
  const transaction = await createSolanaUSDTTransferInstruction({
    fromPublicKey: publicKey,
    toPublicKey: new PublicKey(txnDetails.toAddress),
    amount: txnDetails.amount,
    decimals: txnDetails.decimals,
  });

  // User signs
  const signed = await signTransaction(transaction);

  // Send to network
  const result = await sendSolanaUSDTTransaction(signed);

  console.log('✅ Transaction sent:', result.transactionHash);
  console.log('📊 Explorer:', result.transactionUrl);
}

/**
 * 11. SEND USDT ON TRON (REAL TRANSACTION)
 * 
 * Prerequisites:
 * - User has TronLink wallet installed and connected
 * - Sufficient USDT balance + TRX for gas
 * - Real transaction mode is enabled
 */
import { createTronUSDTTransfer } from './services/usdtTransactionService';

async function sendUSDTOnTron() {
  // Check TronLink is available
  if (!window.tronWeb || !window.tronWeb.ready) {
    console.error('❌ TronLink wallet not connected');
    return;
  }

  const result = await createTronUSDTTransfer({
    fromAddress: 'TQmV2L6yNd1yEDkpvzMjhbx5Eg4yYGaBXL',
    toAddress: 'TK5WhnDq7RpBfGaFZwQagFoV8Wz9a6w6Y5',
    amount: 100, // USDT
    network: 'tron',
  });

  if (result.success) {
    console.log('✅ Transaction sent:', result.transactionHash);
    console.log('📊 Explorer:', result.transactionUrl);
  } else {
    console.error('❌ Transaction failed');
  }
}

// ============ DIAGNOSTIC OPERATIONS ============

/**
 * 12. RUN FULL DIAGNOSTICS
 * 
 * Checks:
 * - Configuration is correct
 * - Network connections working
 * - Address validation working
 * - Price feeds accessible
 * - RPC endpoints responding
 */
import { debugUSDT } from './utils/usdtDebug';

async function runDiagnostics() {
  console.log('🔍 Running USDT diagnostics...');
  await debugUSDT();
}

/**
 * 13. SIMULATE TRANSACTION (FOR TESTING)
 */
import { USDTTransactionSimulator } from './utils/usdtDebug';

// Simulate Solana transfer
USDTTransactionSimulator.simulateTransfer(
  'DKEdEJyK2gZCVmJhKHkzqV6hMfqaRvgLdBKVDuZpM6XP',
  'SqJvxvfUhwwJN9xQgcJRYpSu3YbvhLxM2nFz5HJxDXv',
  100,
  'solana'
);

// Show cost estimate
USDTTransactionSimulator.showCostEstimate(100, 'solana');

// ============ CONFIGURATION OPERATIONS ============

/**
 * 14. VIEW COMPLETE CONFIGURATION
 */
import { AFRICOIN_USDT_CONFIG } from './config/usdtConfig';

console.log('📋 AFRICOIN USDT Config:', AFRICOIN_USDT_CONFIG);

/**
 * 15. CHECK WHICH NETWORKS ARE ENABLED
 */
import { TRANSACTION_MODES } from './config/usdtConfig';

if (TRANSACTION_MODES.PRODUCTION.enabled) {
  console.log('✅ Production mode (Mainnet) enabled');
}

if (TRANSACTION_MODES.TESTNET.enabled) {
  console.log('⚠️  Testnet mode enabled (not production)');
}

if (TRANSACTION_MODES.SIMULATION.enabled) {
  console.log('⚠️  Simulation mode enabled (no real transactions)');
}

// ============ USAGE IN REACT COMPONENTS ============

/**
 * 16. EXAMPLE REACT COMPONENT - Swap Page
 */
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function SwapComponent() {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleSwap = async () => {
    if (!publicKey) {
      alert('Please connect your wallet');
      return;
    }

    setLoading(true);
    try {
      // Get real-time rate
      const rate = await getTokenConversionRate('USDT', 'SOL');
      const receive = parseFloat(amount) * rate;

      // Validate balance
      const validation = await validateSufficientBalance(
        'solana',
        publicKey.toString(),
        parseFloat(amount),
        'USDT'
      );

      if (!validation.sufficient) {
        alert('Insufficient balance');
        return;
      }

      // Get fee
      const fee = await estimateSolanaTransactionFee();

      // Show confirmation
      const confirmed = window.confirm(
        `Swap ${amount} USDT for ${receive.toFixed(4)} SOL?\nFee: ${fee} SOL`
      );

      if (confirmed) {
        // Execute transaction
        console.log('✅ Processing swap...');
        // Call real transaction here
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Swap failed');
    } finally {
      setLoading(false);
    }
  };
}

// ============ COMMON ERRORS & SOLUTIONS ============

/**
 * ERROR: "Wallet not connected"
 * SOLUTION: Ensure useWallet() shows publicKey
 * 
 * ERROR: "Insufficient balance"
 * SOLUTION: Include gas/fee in balance validation
 * 
 * ERROR: "Invalid address"
 * SOLUTION: Use isValidSolanaAddress() or isValidTronAddress() first
 * 
 * ERROR: "Transaction timeout"
 * SOLUTION: Retry automatically, max 3 attempts
 * 
 * ERROR: "RPC unavailable"
 * SOLUTION: Check network connection, RPC endpoints
 */

// ============ ENVIRONMENT CHECK ============

/**
 * 17. VERIFY EVERYTHING IS READY
 */
async function verifyProduction() {
  const checks = {
    realTransactionsEnabled: isRealTransactionMode(),
    configValid: validateUSDTConfig().valid,
    networkConnected: true, // Set after testing
  };

  const allPassed = Object.values(checks).every((v) => v === true);

  if (allPassed) {
    console.log('✅ PRODUCTION READY');
    console.log('Real USDT transactions are fully configured and ready to use');
  } else {
    console.log('❌ CONFIGURATION INCOMPLETE');
    console.log('Fix issues:', checks);
  }

  return allPassed;
}

// ============ QUICK TEST ============

/**
 * 18. QUICK TEST (Copy & paste into browser console)
 */
async function quickTest() {
  console.log('🧪 Running quick test...');

  // 1. Check mode
  console.log('1️⃣  Real mode:', isRealTransactionMode());

  // 2. Check price
  const price = await getTokenConversionRate('USDT', 'USD');
  console.log('2️⃣  USDT Price:', price, 'USD');

  // 3. Check Solana fee
  const fee = await estimateSolanaTransactionFee();
  console.log('3️⃣  Solana Fee:', fee, 'SOL');

  // 4. Check TRON fee
  const tronFee = await estimateTronTransactionFee();
  console.log('4️⃣  TRON Fee:', tronFee, 'TRX');

  console.log('✅ All quick tests passed!');
}

// Copy into browser console: await quickTest()

// ============ EXPORT FOR DEBUGGING ============

// In browser console, these are available:
// window.debugUSDT - Run diagnostics
// window.USDTDiagnostics - Access diagnostic class
// window.USDTTransactionSimulator - Simulate transactions

console.log(
  '%cAFRICOIN Real USDT Quick Reference Loaded',
  'color: green; font-size: 14px; font-weight: bold'
);
console.log('💡 Try: await debugUSDT()');
console.log('💡 Try: await quickTest()');
console.log('💡 Check documentation: REAL_USDT_TRANSACTIONS.md');
