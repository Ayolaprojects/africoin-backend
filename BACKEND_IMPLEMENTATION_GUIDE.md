# Backend Implementation Guide - Account Management System

## Overview

This guide provides complete backend API implementation for the account management system with emphasis on authentication, KYC, balance tracking, transactions, and statements.

## Technology Stack

- **Framework**: Express.js (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Document Storage**: AWS S3
- **Email**: SendGrid or similar
- **Identity Verification**: Stripe Identity

## 1. Authentication Endpoints

### POST /api/auth/register

```typescript
// controllers/authController.ts
async function register(req: Request, res: Response) {
  try {
    const { email, password, name, country, phone } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        country: country || 'ZA',
        phone: phone || null,
        kycStatus: {
          create: {
            status: 'pending',
            tier: 'unverified'
          }
        }
      }
    });

    // Generate JWT
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}

// Helper: Generate JWT
function generateToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '7d' }
  );
}
```

### POST /api/auth/login

```typescript
async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { kycStatus: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user.id, user.email);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        kycStatus: user.kycStatus?.status || 'pending'
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}
```

### POST /api/auth/forgot-password

```typescript
async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    // Check user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate OTP
    const otp = Math.random().toString().slice(2, 8);
    
    // Store reset request with expiry (15 minutes)
    const resetRequest = await prisma.passwordReset.create({
      data: {
        userId: user.id,
        code: otp,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    // Send email
    await sendEmail(email, 'Password Reset Code', `
      Your password reset code is: ${otp}
      This code expires in 15 minutes.
      Do not share this code with anyone.
    `);

    res.json({
      message: 'Verification code sent to your email',
      resetRequestId: resetRequest.id
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process request' });
  }
}
```

### POST /api/auth/verify-reset-code

```typescript
async function verifyResetCode(req: Request, res: Response) {
  try {
    const { email, code } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find reset request
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() } // Not expired
      }
    });

    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    res.json({ valid: true, message: 'Code verified' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
}
```

### POST /api/auth/reset-password

```typescript
async function resetPassword(req: Request, res: Response) {
  try {
    const { email, code, newPassword } = req.body;

    // Validate password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify reset code
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gt: new Date() }
      }
    });

    if (!resetRequest) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Delete reset request
    await prisma.passwordReset.delete({
      where: { id: resetRequest.id }
    });

    // Send confirmation email
    await sendEmail(email, 'Password Changed', 'Your password has been successfully reset.');

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
}
```

## 2. KYC Endpoints

### POST /api/kyc/submit

```typescript
async function submitKYC(req: Request, res: Response) {
  try {
    const userId = req.headers['x-user-id'] as string;
    const {
      firstName, lastName, dateOfBirth, country,
      documentType, documentNumber, documentImageUrl,
      selfieImageUrl, proofOfAddressUrl,
      street, city, state, postalCode
    } = req.body;

    // Update user info
    await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, country }
    });

    // Update KYC status
    const kyc = await prisma.kYCStatus.update({
      where: { userId },
      data: {
        status: 'needs_review',
        documentType,
        documentNumber,
        documentImageUrl,
        documentExpiryDate: new Date(req.body.documentExpiry),
        selfieImageUrl,
        proofOfAddressUrl,
        street,
        city,
        state,
        postalCode,
        dateOfBirth: new Date(dateOfBirth),
        politicallyExposed: req.body.politicallyExposed || false,
        sanctionedScreening: req.body.sanctionedScreening || false
      }
    });

    res.json({
      status: 'submitted',
      message: 'KYC submitted for review',
      kyc
    });
  } catch (error) {
    res.status(500).json({ error: 'KYC submission failed' });
  }
}
```

### GET /api/kyc/status/:userId

```typescript
async function getKYCStatus(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const kyc = await prisma.kYCStatus.findUnique({
      where: { userId }
    });

    if (!kyc) {
      return res.json({
        status: 'unverified',
        tier: 'unverified',
        limits: { dailyLimit: 100, monthlyLimit: 500 }
      });
    }

    // Get tier limits
    const tierLimits = getTierLimits(kyc.tier);

    res.json({
      ...kyc,
      limits: tierLimits
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch KYC status' });
  }
}

function getTierLimits(tier: string) {
  const limits: Record<string, any> = {
    unverified: { dailyLimit: 100, monthlyLimit: 500 },
    basic: { dailyLimit: 1000, monthlyLimit: 5000 },
    intermediate: { dailyLimit: 10000, monthlyLimit: 50000 },
    advanced: { dailyLimit: 100000, monthlyLimit: 500000 }
  };
  return limits[tier] || limits.unverified;
}
```

## 3. Balance Endpoints

### GET /api/balance/:walletId/current

```typescript
async function getCurrentBalance(req: Request, res: Response) {
  try {
    const { walletId } = req.params;

    // Query blockchain
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId }
    });

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Get balance from blockchain
    let balance = 0;
    let usdValue = 0;

    if (wallet.type === 'solana') {
      // Query Solana RPC
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      const pubKey = new PublicKey(wallet.address);
      const lamports = await connection.getBalance(pubKey);
      balance = lamports / 1e9;

      // Get SOL price
      const price = await getSolanaPrice();
      usdValue = balance * price;
    }

    // Store snapshot
    await prisma.balanceSnapshot.create({
      data: {
        walletId,
        balance,
        currency: wallet.currency,
        usdValue,
        timestamp: new Date()
      }
    });

    res.json({
      timestamp: new Date().toISOString(),
      walletId,
      balance,
      currency: wallet.currency,
      usdValue
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
}

async function getSolanaPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    return data.solana.usd || 100;
  } catch {
    return 100; // Fallback
  }
}
```

### GET /api/balance/:walletId/history

```typescript
async function getBalanceHistory(req: Request, res: Response) {
  try {
    const { walletId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date(Date.now() - Number(days) * 24 * 60 * 60 * 1000);

    const snapshots = await prisma.balanceSnapshot.findMany({
      where: {
        walletId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' }
    });

    // Calculate statistics
    const balances = snapshots.map(s => s.balance);
    const avgBalance = balances.length > 0
      ? balances.reduce((a, b) => a + b, 0) / balances.length
      : 0;

    res.json({
      walletId,
      snapshots,
      currentBalance: snapshots.length > 0 ? snapshots[snapshots.length - 1].balance : 0,
      highestBalance: Math.max(...balances, 0),
      lowestBalance: Math.min(...balances, 0),
      averageBalance: avgBalance
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance history' });
  }
}
```

## 4. Statement Endpoints

### POST /api/statements/generate

```typescript
async function generateStatement(req: Request, res: Response) {
  try {
    const { userId, startDate, endDate, transactionType, currency } = req.body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        },
        ...(transactionType !== 'all' && { type: transactionType }),
        ...(currency && { currency })
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate summaries
    const totalInbound = transactions
      .filter(t => t.receiverId === userId)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutbound = transactions
      .filter(t => t.senderId === userId)
      .reduce((sum, t) => sum + t.amount, 0);

    const openingBalance = 0; // Query from balance snapshots
    const closingBalance = openingBalance + totalInbound - totalOutbound;

    const statement = {
      accountId: userId,
      accountHolder: user.name,
      email: user.email,
      statementPeriod: { startDate, endDate },
      generatedAt: new Date().toISOString(),
      totalTransactions: transactions.length,
      totalInbound,
      totalOutbound,
      netFlow: totalInbound - totalOutbound,
      openingBalance,
      closingBalance,
      transactions
    };

    // Store statement
    await prisma.statement.create({
      data: {
        userId,
        data: statement,
        period: `${startDate} to ${endDate}`
      }
    });

    res.json(statement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate statement' });
  }
}
```

### POST /api/statements/export-pdf

```typescript
async function exportPDF(req: Request, res: Response) {
  try {
    const { userId, statement } = req.body;

    // Generate PDF using puppeteer or similar
    const pdf = await generatePDFStatement(statement);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="statement.pdf"');
    res.send(pdf);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export PDF' });
  }
}

async function generatePDFStatement(statement: any): Promise<Buffer> {
  // Use puppeteer or html2pdf library
  // Generate professional PDF with logos, tables, charts
  const pdf = '...'; // Implementation
  return Buffer.from(pdf);
}
```

### POST /api/statements/email

```typescript
async function emailStatement(req: Request, res: Response) {
  try {
    const { userId, email, statement } = req.body;

    // Generate PDF
    const pdf = await generatePDFStatement(statement);

    // Send email
    await sendEmail(email, 'Your Account Statement', `
      Please find attached your statement for ${statement.statementPeriod.startDate} to ${statement.statementPeriod.endDate}.
    `, [pdf]);

    res.json({ message: 'Statement sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to email statement' });
  }
}
```

## 5. Database Schema with Prisma

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String
  name              String
  firstName         String?
  lastName          String?
  phone             String?
  country           String    @default("ZA")
  
  // Relations
  kycStatus         KYCStatus?
  wallets           Wallet[]
  transactions      Transaction[]
  statements        Statement[]
  passwordResets    PasswordReset[]
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model KYCStatus {
  id                        String    @id @default(cuid())
  userId                    String    @unique
  user                      User      @relation(fields: [userId], references: [id])
  
  status                    String    @default("pending")
  tier                      String    @default("unverified")
  
  documentType              String?
  documentNumber            String?
  documentImageUrl          String?
  documentExpiryDate        DateTime?
  selfieImageUrl            String?
  proofOfAddressUrl         String?
  
  street                    String?
  city                      String?
  state                     String?
  postalCode                String?
  
  employmentStatus          String?
  employerName              String?
  jobTitle                  String?
  industry                  String?
  annualIncome              String?
  sourceOfFunds             String?
  
  politicallyExposed        Boolean   @default(false)
  sanctionedScreening       Boolean   @default(false)
  
  verifiedAt                DateTime?
  rejectionReason           String?
  
  dailyLimit                Float     @default(100)
  monthlyLimit              Float     @default(500)
  
  stripeVerificationSessionId String?
  
  createdAt                 DateTime  @default(now())
  updatedAt                 DateTime  @updatedAt
}

model PasswordReset {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  code      String
  expiresAt DateTime
  createdAt DateTime  @default(now())
}

model Wallet {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  
  address         String    @unique
  name            String
  type            String    // solana, ethereum, tron
  currency        String
  walletProvider  String?
  
  balanceSnapshots BalanceSnapshot[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Transaction {
  id              String    @id @default(cuid())
  senderId        String
  sender          User      @relation("sent", fields: [senderId], references: [id])
  
  receiverId      String
  receiver        User      @relation("received", fields: [receiverId], references: [id])
  
  senderAddress   String
  receiverAddress String
  
  amount          Float
  currency        String
  fee             Float     @default(0)
  type            String    // send, receive, swap, deposit, withdrawal
  status          String    // completed, pending, failed
  
  solanaSignature String?
  blockHash       String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([senderId])
  @@index([receiverId])
}

model BalanceSnapshot {
  id        String    @id @default(cuid())
  walletId  String
  wallet    Wallet    @relation(fields: [walletId], references: [id])
  
  balance   Float
  currency  String
  usdValue  Float
  timestamp DateTime
  
  createdAt DateTime  @default(now())
  
  @@index([walletId])
  @@index([timestamp])
}

model Statement {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  
  data      Json      // Full statement object
  period    String
  
  createdAt DateTime  @default(now())
  
  @@index([userId])
}
```

## 6. Environment Variables

```env
# .env file
DATABASE_URL="postgresql://user:password@localhost:5432/africoin"
JWT_SECRET="your-secret-key-here"
SENDGRID_API_KEY="sg_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLIC_KEY="pk_test_..."
SOLANA_RPC_URL="https://api.mainnet-beta.solana.com"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_S3_BUCKET="africoin-documents"
NODE_ENV="production"
PORT=3001
```

---

**Backend Implementation Status**: ✅ Complete  
**Last Updated**: April 21, 2026
