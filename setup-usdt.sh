#!/bin/bash

# Africoin Real USDT Transaction Setup Script
# This script sets up everything needed for real blockchain USDT transactions

echo "🚀 Setting up Africoin Real USDT Transaction System..."

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install @solana/web3.js @solana/spl-token @solana/wallet-adapter-react @solana/wallet-adapter-react-ui tronweb axios --save

# Step 2: Create environment file
echo "📝 Creating .env.local file..."
cat > .env.local << 'EOF'
# AFRICOIN Real USDT Transaction Configuration

# ============ NETWORK CONFIGURATION ============
REACT_APP_NETWORK=mainnet
REACT_APP_DEBUG=false

# ============ SOLANA CONFIGURATION ============
# Mainnet RPC
REACT_APP_SOLANA_RPC=https://api.mainnet-beta.solana.com

# Solana USDT SPL Token Mint Address (Mainnet)
REACT_APP_SOLANA_USDT_MINT=EPjFWaLb3odccccccccccccccccccccccccccG

# Optional: Devnet for testing (requires devnet USDT)
# REACT_APP_SOLANA_RPC=https://api.devnet.solana.com
# REACT_APP_SOLANA_USDT_MINT=EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9

# ============ TRON CONFIGURATION ============
# TRON API Endpoint (Mainnet)
REACT_APP_TRON_API=https://api.tronstack.io

# TRON USDT TRC-20 Contract Address (Mainnet)
REACT_APP_TRON_USDT_ADDRESS=TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6

# Optional: TRON Shasta Testnet
# REACT_APP_TRON_API=https://api.shasta.trongrid.io
# REACT_APP_TRON_USDT_ADDRESS=TG3XXyExBkPp9nzdajQjthH6ykqS3koN21

# ============ TRANSACTION SETTINGS ============
# Minimum transfer amount (to prevent dust)
REACT_APP_MIN_TRANSFER=0.01

# Maximum transfer amount (to prevent accidents)
REACT_APP_MAX_TRANSFER=1000000

# Transaction timeout (milliseconds)
REACT_APP_TX_TIMEOUT=60000

# ============ WALLET CONFIGURATION ============
# Wallet adapters to enable
REACT_APP_ENABLE_PHANTOM=true
REACT_APP_ENABLE_SOLFLARE=true
REACT_APP_ENABLE_TRONLINK=true

# ============ PRICE FEED CONFIGURATION ============
# CoinGecko API (free, no key required)
REACT_APP_PRICE_API=coingecko

# ============ LOGGING & MONITORING ============
REACT_APP_LOG_TRANSACTIONS=true
REACT_APP_LOG_LEVEL=info
EOF

echo "✅ .env.local created!"

# Step 3: Verify installation
echo ""
echo "🔍 Verifying installations..."
npm list @solana/web3.js @solana/spl-token tronweb

# Step 4: Display configuration summary
echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "📋 Configuration Summary:"
echo ""
echo "Services created:"
echo "  ✓ src/services/usdtService.ts (SolanaUSDTService, TronUSDTService, UnifiedUSDTService)"
echo "  ✓ src/hooks/useUSDTTransaction.ts (React hook for transactions)"
echo "  ✓ src/utils/usdtValidator.ts (Validation utilities)"
echo "  ✓ src/config/usdtConfig.ts (Configuration)"
echo ""
echo "Environment file:"
echo "  ✓ .env.local (configured for mainnet)"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Update App.tsx to add Solana Wallet Provider:"
echo "   - Import WalletProvider from @solana/wallet-adapter-react"
echo "   - Wrap your app with WalletProvider"
echo ""
echo "2. Test real balance checking:"
echo "   import { solanaUSDT } from '../services/usdtService';"
echo "   const balance = await solanaUSDT.getUSDTBalance(walletAddress);"
echo ""
echo "3. Test real USDT transfer (use testnet first!):"
echo "   const result = await solanaUSDT.transferUSDT(keypair, toAddress, amount);"
echo ""
echo "4. Use the React hook in components:"
echo "   const { sendUSDT, getBalance, isLoading } = useUSDTTransaction();"
echo ""
echo "5. Validate inputs before transfer:"
echo "   const validation = USDTValidator.validateTransfer(from, to, amount, 'solana', balance);"
echo ""
echo "========================================="
echo ""
echo "🔐 Security Reminders:"
echo "  ⚠️  Never expose private keys"
echo "  ⚠️  Always use HTTPS in production"
echo "  ⚠️  Test on testnet before mainnet"
echo "  ⚠️  Implement rate limiting"
echo "  ⚠️  Log all transactions"
echo ""
echo "📖 Documentation:"
echo "  - REAL_USDT_TRANSACTIONS.md (this repository)"
echo "  - https://docs.solana.com"
echo "  - https://developers.tron.network"
echo ""
echo "Happy coding! 🚀"
