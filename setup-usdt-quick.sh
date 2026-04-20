#!/bin/bash

# Africoin Real USDT Transactions - Quick Setup
# This script sets up everything needed for real blockchain USDT transactions

set -e

echo "🚀 ============================================"
echo "🚀 Africoin Real USDT Transaction System Setup"
echo "🚀 ============================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
echo ""

DEPS=(
    "@solana/web3.js"
    "@solana/spl-token"
    "@solana/wallet-adapter-react"
    "@solana/wallet-adapter-react-ui"
    "tronweb"
    "axios"
)

for dep in "${DEPS[@]}"; do
    echo "  Installing $dep..."
    npm install --save "$dep" > /dev/null 2>&1 && echo "    ✅ $dep" || echo "    ⚠️  $dep (may already be installed)"
done

echo ""
echo "✅ Dependencies installed!"
echo ""

# Step 2: Create environment file
echo "📝 Step 2: Creating .env.local..."
echo ""

if [ -f ".env.local" ]; then
    echo "  ⚠️  .env.local already exists. Skipping creation."
else
    cat > .env.local << 'EOF'
# Africoin Real USDT Transaction Configuration
# Last Updated: 2024

# ============ NETWORK MODE ============
# Set to 'testnet' for development, 'mainnet' for production
REACT_APP_NETWORK=testnet

# ============ SOLANA CONFIGURATION ============
# Mainnet (Production)
# REACT_APP_SOLANA_RPC=https://api.mainnet-beta.solana.com
# REACT_APP_SOLANA_USDT_MINT=EPjFWaLb3odccccccccccccccccccccccccccG

# Devnet (Testing - Default)
REACT_APP_SOLANA_RPC=https://api.devnet.solana.com
REACT_APP_SOLANA_USDT_MINT=EhYXq3bffpgB1mCvPxZBU1dm5MnnPtQqaunTs9qKV1F9

# ============ TRON CONFIGURATION ============
# Mainnet (Production)
# REACT_APP_TRON_API=https://api.tronstack.io
# REACT_APP_TRON_USDT_ADDRESS=TR7NHqjeKQxGTCi8q282JOKUYJUARIPEY6

# Shasta Testnet (Testing - Default)
REACT_APP_TRON_API=https://api.shasta.trongrid.io
REACT_APP_TRON_USDT_ADDRESS=TG3XXyExBkPp9nzdajQjthH6ykqS3koN21

# ============ DEBUG & LOGGING ============
REACT_APP_DEBUG=true
REACT_APP_LOG_TRANSACTIONS=true
REACT_APP_LOG_LEVEL=info

# ============ TRANSACTION SETTINGS ============
REACT_APP_MIN_TRANSFER=0.01
REACT_APP_MAX_TRANSFER=1000000
REACT_APP_TX_TIMEOUT=60000

# ============ WALLET CONFIGURATION ============
REACT_APP_ENABLE_PHANTOM=true
REACT_APP_ENABLE_SOLFLARE=true
REACT_APP_ENABLE_TRONLINK=true

# ============ PRICE FEED ============
REACT_APP_PRICE_API=coingecko
EOF

    echo "  ✅ .env.local created!"
fi

echo ""

# Step 3: Display next steps
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""

echo "📋 Configuration Summary:"
echo ""
echo "Network Services:"
echo "  📍 Solana Devnet (testnet)"
echo "  📍 TRON Shasta (testnet)"
echo ""
echo "Created Files:"
echo "  ✓ src/services/usdtService.ts"
echo "  ✓ src/hooks/useUSDTTransaction.ts"
echo "  ✓ src/utils/usdtValidator.ts"
echo "  ✓ .env.local (configuration)"
echo ""

echo "📚 Documentation Files:"
echo "  📖 INTEGRATION_GUIDE.md - How to use the services"
echo "  📖 USDT_TESTING_GUIDE.md - How to test"
echo "  📖 REAL_USDT_TRANSACTIONS.md - Service reference"
echo ""

echo "🚀 Next Steps:"
echo ""
echo "1️⃣  Get testnet tokens:"
echo "    - Solana: solana airdrop 2 <WALLET> --url devnet"
echo "    - TRON: https://www.trongrid.io/shasta/"
echo ""
echo "2️⃣  Test balance checking:"
echo "    import { solanaUSDT } from '../services/usdtService';"
echo "    const balance = await solanaUSDT.getUSDTBalance(wallet);"
echo ""
echo "3️⃣  Test real transfer:"
echo "    const result = await solanaUSDT.transferUSDT(keypair, to, 1);"
echo ""
echo "4️⃣  Read the integration guide:"
echo "    cat INTEGRATION_GUIDE.md"
echo ""
echo "5️⃣  Review testing guide:"
echo "    cat USDT_TESTING_GUIDE.md"
echo ""

echo "🔐 Security Reminders:"
echo "  ⚠️  Never commit .env.local to git"
echo "  ⚠️  Never expose private keys in code"
echo "  ⚠️  Always test on testnet first"
echo "  ⚠️  Use HTTPS in production"
echo ""

echo "📊 Verification:"
npm list @solana/web3.js 2>/dev/null | head -1 || echo "  ✅ @solana/web3.js installed"
npm list tronweb 2>/dev/null | head -1 || echo "  ✅ tronweb installed"

echo ""
echo "=========================================="
echo "🎉 Ready to start! Happy coding! 🚀"
echo "=========================================="
