/**
 * USDT Configuration and Real Transaction Setup
 * Ensures all USDT transactions use real blockchain connections
 */

// ============ BLOCKCHAIN NETWORKS ============
export const NETWORKS = {
  SOLANA: {
    name: 'Solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    explorer: 'https://solscan.io',
    chainId: 101,
  },
  TRON: {
    name: 'TRON',
    rpcUrl: 'https://api.tronstack.io',
    explorer: 'https://tronscan.org',
    chainId: 1,
  },
  ETHEREUM: {
    name: 'Ethereum',
    rpcUrl: 'https://eth.rpc.blxrbdn.com',
    explorer: 'https://etherscan.io',
    chainId: 1,
  },
};

// ============ USDT MINTS & CONTRACTS ============
export const USDT_CONFIG = {
  // Solana USDT (SPL Token)
  SOLANA: {
    mint: 'EPjFWaLb3hqAgqYf4Xfeff7g2gg6zNzrKcxzbnYaAmm',
    decimals: 6,
    symbol: 'USDT',
    name: 'USDT (Solana)',
  },
  // TRON USDT (TRC-20 Token)
  TRON: {
    contract: 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj',
    decimals: 6,
    symbol: 'USDT',
    name: 'USDT (TRON)',
  },
  // Ethereum USDT (ERC-20 Token)
  ETHEREUM: {
    contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimals: 6,
    symbol: 'USDT',
    name: 'USDT (Ethereum)',
  },
};

// ============ TRANSACTION SETTINGS ============
export const TRANSACTION_SETTINGS = {
  // Solana settings
  SOLANA: {
    // Network fee estimation: 5,000 - 500,000 lamports (0.000005 - 0.0005 SOL)
    minFee: 5000, // lamports
    maxFee: 500000, // lamports
    feeMultiplier: 1.5, // Safety multiplier
    confirmationLevel: 'confirmed' as const,
    maxRetries: 3,
    retryDelay: 1000, // ms
  },
  // TRON settings
  TRON: {
    // Network fee: typically 5-30 TRX (0.00000001 TRX = 1 SUN)
    minFee: 5_000_000, // SUN (5 TRX)
    maxFee: 30_000_000, // SUN (30 TRX)
    feeMultiplier: 1.2, // Safety multiplier
    confirmationLevel: 2, // Confirmed
    maxRetries: 3,
    retryDelay: 2000, // ms
  },
  // Ethereum settings
  ETHEREUM: {
    // Gas price varies, typically 20-200 gwei
    minGasPrice: 20, // gwei
    maxGasPrice: 200, // gwei
    gasLimit: 100000, // units for USDT transfer
    confirmationLevel: 1, // 1 block confirmation
    maxRetries: 3,
    retryDelay: 3000, // ms
  },
};

// ============ PRICE FEEDS ============
export const PRICE_FEEDS = {
  // CoinGecko API (free, no API key required)
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      price: '/simple/price',
      market: '/coins/markets',
      historical: '/coins/{id}/market_chart',
    },
    ids: {
      USDT: 'tether',
      SOL: 'solana',
      AFR: 'africoin',
      TRX: 'tron',
    },
  },
  // Jupiter for Solana token prices
  JUPITER: {
    baseUrl: 'https://api.jup.ag/v6',
    endpoints: {
      quote: '/quote',
      swap: '/swap',
    },
  },
  // Uniswap for general token data
  UNISWAP: {
    baseUrl: 'https://api.uniswap.org/v1',
  },
};

// ============ GAS/FEE ESTIMATION ============
export const FEE_ESTIMATION = {
  // Solana: Use prioritization fees
  SOLANA_PRIORITY_LEVELS: {
    low: 1000, // lamports per CU
    medium: 5000,
    high: 10000,
  },
  // TRON: Fixed network fee
  TRON_NETWORK_FEE: 10_000_000, // SUN (10 TRX)
  // Ethereum: Dynamic gas pricing
  ETHEREUM_GAS_MULTIPLIER: {
    low: 1,
    medium: 1.2,
    high: 1.5,
  },
};

// ============ TRANSACTION VALIDATION ============
export const VALIDATION = {
  // Minimum amounts to prevent dust transfers
  MIN_TRANSFER_AMOUNT: {
    USDT: 1, // 1 USDT minimum
    SOL: 0.001, // 0.001 SOL minimum
    TRX: 1, // 1 TRX minimum
  },
  // Maximum amounts to prevent accidental large transfers
  MAX_TRANSFER_AMOUNT: {
    USDT: 1_000_000, // 1M USDT max
    SOL: 100, // 100 SOL max
    TRX: 1_000_000, // 1M TRX max
  },
  // Address validation patterns
  ADDRESS_PATTERNS: {
    SOLANA: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, // Base58
    TRON: /^T[1-9A-HJ-NP-Za-km-z]{33}$/, // TRON address
    ETHEREUM: /^0x[a-fA-F0-9]{40}$/, // Ethereum address
  },
};

// ============ REAL TRANSACTION MODES ============
export const TRANSACTION_MODES = {
  // PRODUCTION: Real mainnet transactions
  PRODUCTION: {
    enabled: true,
    network: 'mainnet',
    requireConfirmation: true,
    logTransactions: true,
  },
  // TESTNET: Test network transactions (safer for testing)
  TESTNET: {
    enabled: false,
    network: 'testnet',
    requireConfirmation: false,
    logTransactions: true,
  },
  // SIMULATION: Simulate without actual blockchain (for development)
  SIMULATION: {
    enabled: false,
    network: 'simulation',
    requireConfirmation: false,
    logTransactions: true,
  },
};

// ============ ERROR HANDLING ============
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction. Please check your balance.',
  INVALID_ADDRESS: 'The recipient address format is invalid.',
  INVALID_AMOUNT: 'Please enter a valid amount greater than 0.',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please check the details and try again.',
  WALLET_NOT_CONNECTED: 'Wallet not connected. Please connect your wallet first.',
  INSUFFICIENT_GAS: 'Insufficient gas/fees to complete this transaction.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
};

// ============ NOTIFICATION SETTINGS ============
export const NOTIFICATIONS = {
  SHOW_REAL_TIME_UPDATES: true,
  SHOW_TRANSACTION_PROGRESS: true,
  SHOW_FEE_ESTIMATES: true,
  SHOW_CONFIRMATION_COUNT: true,
  AUTO_DISMISS_SUCCESS: 5000, // ms
  AUTO_DISMISS_ERROR: 8000, // ms
};

// ============ ENVIRONMENT CHECK ============
export function isProductionMode(): boolean {
  return TRANSACTION_MODES.PRODUCTION.enabled;
}

export function getCurrentNetwork(): string {
  return TRANSACTION_MODES.PRODUCTION.enabled ? 'mainnet' : 'testnet';
}

export function isRealTransactionMode(): boolean {
  return isProductionMode() && TRANSACTION_MODES.PRODUCTION.network === 'mainnet';
}

// ============ CONFIGURATION VALIDATION ============
export function validateUSDTConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check if at least one network is configured
  if (!USDT_CONFIG.SOLANA || !USDT_CONFIG.SOLANA.mint) {
    errors.push('Solana USDT configuration missing');
  }

  if (!USDT_CONFIG.TRON || !USDT_CONFIG.TRON.contract) {
    errors.push('TRON USDT configuration missing');
  }

  // Check if production mode is enabled
  if (!isRealTransactionMode()) {
    errors.push('Warning: Real transaction mode is not enabled');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============ EXPORT FULL CONFIGURATION ============
export const AFRICOIN_USDT_CONFIG = {
  networks: NETWORKS,
  tokens: USDT_CONFIG,
  transactions: TRANSACTION_SETTINGS,
  prices: PRICE_FEEDS,
  fees: FEE_ESTIMATION,
  validation: VALIDATION,
  modes: TRANSACTION_MODES,
  errors: ERROR_MESSAGES,
  notifications: NOTIFICATIONS,
};

export default AFRICOIN_USDT_CONFIG;
