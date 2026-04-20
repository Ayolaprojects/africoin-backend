# 🔐 Complete Account Management System

## Overview

The Africoin platform now includes a comprehensive account management system with:

1. **Account Registration & Authentication**
2. **Forgot Password Recovery**
3. **Know Your Customer (KYC) Verification** with ID and Proof of Address uploads
4. **Balance Management & Analytics**
5. **Transaction Tracking**
6. **Statement Generation** (CSV & PDF)
7. **Wallet Management**

---

## 1. Account Registration & Login

### Frontend Components

#### **LoginPage.tsx** 
Location: `src/pages/LoginPage.tsx`

**Features:**
- Toggle between Login and Register modes
- Email validation
- Password strength requirements
- TronLink wallet integration for mobile users
- Error handling and loading states

**Registration Form:**
```typescript
- Email (required)
- Password (min 6 chars, required)
- Confirm Password (must match)
- First Name (required)
- Last Name (required)
```

**Login Form:**
```typescript
- Email (required)
- Password (required)
- "Forgot Password?" link
```

### Backend Routes

#### **POST /api/auth/register**
```bash
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "country": "ZA",
  "phone": "+27123456789"
}

Response:
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "country": "ZA"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### **POST /api/auth/login**
```bash
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "kycStatus": "pending"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### **POST /api/auth/verify-token**
Verify JWT token validity

#### **POST /api/auth/logout**
Clear session and invalidate token

---

## 2. Forgot Password Recovery

### Frontend Component

#### **ForgotPasswordPage.tsx**
Location: `src/pages/ForgotPasswordPage.tsx`

**3-Step Process:**
1. **Email Verification** - User enters email
2. **Code Verification** - 6-digit code sent to email
3. **Password Reset** - Set new password with requirements

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Backend Routes

#### **POST /api/auth/forgot-password**
```bash
Request:
{
  "email": "user@example.com"
}

Response:
{
  "message": "Verification code sent to your email",
  "resetRequestId": "req_123"
}
```

**Backend Actions:**
- Validate email exists in database
- Generate 6-digit OTP
- Send OTP to user's email
- Store reset request with expiry (15 minutes)

#### **POST /api/auth/verify-reset-code**
```bash
Request:
{
  "email": "user@example.com",
  "code": "123456"
}

Response:
{
  "valid": true,
  "message": "Code verified"
}
```

#### **POST /api/auth/reset-password**
```bash
Request:
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePass123!"
}

Response:
{
  "message": "Password reset successfully"
}
```

---

## 3. KYC Verification System

### Enhanced KYCPage.tsx
Location: `src/pages/KYCPage.tsx`

**5-Step KYC Process:**

#### **Step 1: Personal Information**
- First Name (required)
- Last Name (required)
- Date of Birth (required) - Format: YYYY-MM-DD
- Nationality (required)
- Phone Number (optional)
- Alternate Phone (optional)

#### **Step 2: Identity Documents**
- Document Type (Passport, ID Card, Driver's License) - required
- Document Number - required
- Document Expiry - required
- Document Image Upload - required
- Selfie with Document - required

**Validation:**
```typescript
- Document image must be clear and readable
- Selfie must show face clearly
- Documents must not be expired
- File formats: JPG, PNG, PDF
- File size: Max 5MB each
```

#### **Step 3: Proof of Address** ✨ NEW
- Address Street - required
- City - required
- State/Province - required
- Postal Code - required
- Country - required
- Proof of Address Document - required

**Accepted Proof of Address:**
- Utility bill (electricity, water, gas)
- Bank statement
- Government letter
- Rental agreement
- Property tax document
- Mortgage statement

**Validation:**
- Document must show full address
- Document must be dated within last 3 months
- Address must match personal info
- File formats: JPG, PNG, PDF
- File size: Max 5MB

#### **Step 4: Employment Information**
- Employment Status - required
- Employer Name - (if employed)
- Job Title - (if employed)
- Industry - optional
- Annual Income Range - required
- Source of Funds - required

#### **Step 5: Declarations & Verification**
- Politically Exposed Person declaration
- Sanctions screening declaration
- Terms & Conditions agreement
- Privacy Policy agreement

### Backend Routes

#### **POST /api/kyc/submit**
```bash
Request:
{
  "userId": "user_123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "country": "ZA",
  "documentType": "passport",
  "documentNumber": "A12345678",
  "documentImageUrl": "s3://...",
  "selfieImageUrl": "s3://...",
  "proofOfAddressUrl": "s3://...",
  "street": "123 Main Street",
  "city": "Cape Town",
  "postalCode": "8000",
  "country": "ZA"
}

Response:
{
  "status": "submitted",
  "message": "KYC information submitted for review",
  "kycStatus": {
    "id": "kyc_123",
    "status": "needs_review",
    "tier": "unverified"
  }
}
```

#### **POST /api/kyc/verify**
Start Stripe Identity verification

#### **GET /api/kyc/status/:userId**
Get current KYC status and verification details

#### **POST /api/kyc/verify-id**
Validate ID number format (South Africa example)

### Database Schema

#### **KYCStatus Table**
```sql
CREATE TABLE "KYCStatus" (
  id TEXT PRIMARY KEY,
  userId TEXT UNIQUE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending',  -- pending, needs_review, approved, rejected
  tier TEXT DEFAULT 'unverified', -- unverified, basic, intermediate, advanced
  
  -- Identity Documents
  documentType TEXT,              -- passport, id_card, driver_license
  documentNumber TEXT,
  documentImageUrl TEXT,
  documentExpiryDate DATE,
  selfieImageUrl TEXT,
  proofOfAddressUrl TEXT,         -- NEW: Proof of address document
  
  -- Address Info
  street TEXT,
  city TEXT,
  state TEXT,
  postalCode TEXT,
  country TEXT,
  
  -- Employment
  employmentStatus TEXT,          -- employed, self-employed, unemployed, retired
  employerName TEXT,
  jobTitle TEXT,
  industry TEXT,
  annualIncome TEXT,              -- income range
  sourceOfFunds TEXT,
  
  -- Verification
  verifiedAt TIMESTAMP,
  rejectionReason TEXT,
  reviewedBy TEXT,                -- Admin user ID
  
  -- Limits (based on tier)
  dailyLimit FLOAT DEFAULT 100,
  monthlyLimit FLOAT DEFAULT 500,
  
  -- Stripe Integration
  stripeVerificationSessionId TEXT,
  stripeVerificationStatus TEXT,
  
  -- Politically Exposed
  politicallyExposed BOOLEAN DEFAULT false,
  sanctionedScreening BOOLEAN DEFAULT false,
  
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP,
  
  FOREIGN KEY (userId) REFERENCES "User"(id)
);
```

#### **Document Storage**
- Use AWS S3 or similar for secure document storage
- Encrypt documents at rest
- Enable versioning for audit trail
- Auto-delete after 7 years per GDPR

### KYC Tier System

| Tier | Daily Limit | Monthly Limit | Requirements |
|------|------------|--------------|--------------|
| **Unverified** | $100 | $500 | None |
| **Basic** | $1,000 | $5,000 | Email verified |
| **Intermediate** | $10,000 | $50,000 | Basic + ID verified |
| **Advanced** | $100,000 | $500,000 | All documents verified |

---

## 4. Balance Management & Analytics

### BalanceService
Location: `src/services/balanceService.ts`

**Features:**
- Real-time balance tracking
- Historical balance snapshots
- Portfolio analytics
- Balance alerts
- Volatility calculation

### Backend Routes

#### **GET /api/balance/:walletId/current**
Get current balance for a wallet

#### **GET /api/balance/:walletId/history**
```bash
Query Parameters:
- days: 7, 30, 90, 365 (default: 30)

Response:
{
  "walletId": "wallet_123",
  "currency": "AFR",
  "currentBalance": 1250.50,
  "snapshots": [
    {
      "timestamp": "2026-04-21T10:00:00Z",
      "balance": 1250.50,
      "usdValue": 1250.50
    }
  ],
  "highestBalance": 2000,
  "lowestBalance": 500,
  "averageBalance": 1125.25
}
```

#### **GET /api/balance/portfolio/:userId/current**
Get aggregated portfolio balance across all wallets

#### **GET /api/balance/:walletId/stats**
Get balance statistics (high, low, average, volatility)

---

## 5. Transaction Management

### Transaction Types

```typescript
- send:   Transfer to another user
- receive: Receive from another user
- swap:   Token exchange
- deposit: Fiat deposit
- withdrawal: Fiat withdrawal
- payment: Merchant payment
- fee:    Transaction fee
```

### Backend Routes

#### **GET /api/transactions/:userId**
Get transaction history
```bash
Query Parameters:
- limit: 1-100 (default: 20)
- offset: 0, 20, 40... (default: 0)
- type: all, send, receive, swap
- status: all, pending, completed, failed

Response:
{
  "transactions": [...],
  "pagination": {
    "total": 250,
    "limit": 20,
    "offset": 0
  }
}
```

#### **POST /api/transactions/create**
Initiate transaction

#### **POST /api/transactions/confirm**
Confirm transaction on blockchain

---

## 6. Statement Generation

### StatementService
Location: `src/services/statementService.ts`

**Features:**
- Generate statements for date ranges
- Export as CSV or PDF
- Email statements
- Schedule recurring statements
- View statement history

### StatementsPage Component
Location: `src/pages/StatementsPage.tsx`

**Features:**
- Date range selection
- Filter by transaction type
- Filter by currency
- Generate and download
- Email delivery
- Automatic scheduling
- View past statements

### Backend Routes

#### **POST /api/statements/generate**
```bash
Request:
{
  "userId": "user_123",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31",
  "transactionType": "all",
  "currency": "AFR"
}

Response:
{
  "accountId": "account_123",
  "accountHolder": "John Doe",
  "email": "john@example.com",
  "statementPeriod": {
    "startDate": "2026-01-01",
    "endDate": "2026-03-31"
  },
  "generatedAt": "2026-04-21T10:00:00Z",
  "totalTransactions": 45,
  "totalInbound": 5000,
  "totalOutbound": 3500,
  "netFlow": 1500,
  "openingBalance": 1000,
  "closingBalance": 2500,
  "transactions": [...]
}
```

#### **POST /api/statements/export-pdf**
Generate and return PDF document

#### **POST /api/statements/email**
Email statement to user

#### **POST /api/statements/schedule**
Schedule automatic statement delivery

#### **GET /api/statements/history/:userId**
Get previously generated statements

---

## 7. Wallet Management

### Supported Blockchains

1. **Solana**
   - Native SOL tokens
   - USDT (SPL standard)
   - AFR (custom token)

2. **TRON**
   - TRX native token
   - USDT (TRC-20 standard)

3. **Ethereum** (Future)
   - ETH tokens
   - USDT (ERC-20 standard)

### Backend Routes

#### **POST /api/users/:userId/link-solana**
Link Solana wallet

#### **GET /api/users/:userId/payment-methods**
Get available payment methods based on KYC tier

---

## 8. Security Features

### Authentication
- JWT tokens with 7-day expiry
- Refresh token rotation
- Password hashing with bcrypt
- Account lockout after 5 failed attempts

### KYC Security
- Document encryption at rest
- Stripe Identity integration for liveness detection
- Luhn algorithm for ID number validation
- Address verification against official records

### Balance Security
- Real-time balance verification
- Double-spending prevention
- Rate limiting on transactions
- Suspicious activity alerts

### Data Protection
- HTTPS for all communications
- End-to-end encryption for sensitive data
- PCI DSS compliance for payment data
- GDPR compliance for personal data

---

## 9. Implementation Checklist

### Backend Implementation

- [ ] **Auth Endpoints**
  - [ ] POST /api/auth/register
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/logout
  - [ ] POST /api/auth/verify-token
  - [ ] POST /api/auth/refresh-token

- [ ] **Password Recovery Endpoints**
  - [ ] POST /api/auth/forgot-password
  - [ ] POST /api/auth/verify-reset-code
  - [ ] POST /api/auth/reset-password

- [ ] **KYC Endpoints**
  - [ ] POST /api/kyc/submit
  - [ ] POST /api/kyc/verify
  - [ ] GET /api/kyc/status/:userId
  - [ ] POST /api/kyc/verify-id

- [ ] **Balance Endpoints**
  - [ ] GET /api/balance/:walletId/current
  - [ ] GET /api/balance/:walletId/history
  - [ ] GET /api/balance/portfolio/:userId/current
  - [ ] GET /api/balance/:walletId/stats

- [ ] **Transaction Endpoints**
  - [ ] GET /api/transactions/:userId
  - [ ] GET /api/transactions/details/:transactionId
  - [ ] POST /api/transactions/create
  - [ ] POST /api/transactions/confirm

- [ ] **Statement Endpoints**
  - [ ] POST /api/statements/generate
  - [ ] POST /api/statements/export-pdf
  - [ ] POST /api/statements/email
  - [ ] POST /api/statements/schedule
  - [ ] GET /api/statements/history/:userId

### Frontend Implementation

- [ ] **Pages**
  - [ ] LoginPage with register/login toggle
  - [ ] ForgotPasswordPage with 3-step recovery
  - [ ] KYCPage with 5-step verification
  - [ ] DashboardPage with balance display
  - [ ] StatementsPage for statement management
  - [ ] ProfilePage with wallet management

- [ ] **Services**
  - [ ] authService
  - [ ] kycService
  - [ ] balanceService
  - [ ] statementService
  - [ ] transactionService

- [ ] **Components**
  - [ ] Authentication UI
  - [ ] KYC forms with document upload
  - [ ] Balance display cards
  - [ ] Transaction lists
  - [ ] Statement generation interface

### Database

- [ ] Create tables:
  - [ ] User
  - [ ] KYCStatus
  - [ ] Wallet
  - [ ] Transaction
  - [ ] BalanceSnapshot
  - [ ] Statement

### Testing

- [ ] Unit tests for services
- [ ] Integration tests for API endpoints
- [ ] KYC document upload tests
- [ ] Balance calculation tests
- [ ] Statement generation tests

---

## 10. Usage Examples

### Register New Account
```typescript
import { useAuth } from '../context/AuthContext';

function SignUp() {
  const { register } = useAuth();
  
  const handleRegister = () => {
    const success = register(
      'user@example.com',
      'SecurePass123!',
      'John',
      'Doe'
    );
    
    if (success) {
      navigate('/kyc'); // Go to KYC verification
    }
  };
}
```

### Reset Forgotten Password
```typescript
// 1. User navigates to /forgot-password
// 2. Enters email
// 3. Receives 6-digit code via email
// 4. Enters code and new password
// 5. Redirected to login
```

### Complete KYC Verification
```typescript
import { kycService } from '../services/kycService';

async function submitKYC() {
  const kyc = await kycService.submitKYC({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-01-01',
    country: 'ZA',
    documentType: 'passport',
    documentNumber: 'A12345678',
    documentImage: base64String,
    selfieImage: base64String,
    proofOfAddressImage: base64String // NEW
  });
}
```

### Generate Statement
```typescript
import { statementService } from '../services/statementService';

async function generateStatement() {
  const statement = await statementService.generateStatement(
    userId,
    {
      startDate: '2026-01-01',
      endDate: '2026-03-31',
      transactionType: 'all',
      currency: 'AFR'
    }
  );
  
  // Export as CSV
  const csv = await statementService.exportAsCSV(statement);
  statementService.downloadCSV(csv, 'statement.csv');
}
```

### Check Balance
```typescript
import { balanceService } from '../services/balanceService';

async function getBalance() {
  const portfolio = await balanceService.getPortfolioBalance(userId);
  console.log(`Total Balance: $${portfolio.totalUSDValue}`);
  
  const history = await balanceService.getBalanceHistory(walletId, 30);
  console.log(`30-day average: $${history.averageBalance}`);
}
```

---

## 11. Troubleshooting

### Common Issues

#### **KYC Documents Rejected**
- Ensure documents are clear and readable
- Check documents are not expired
- Verify address matches personal info
- Use supported file formats (JPG, PNG, PDF)

#### **Password Reset Not Working**
- Check email is in system
- Verify email address is correct
- Check spam folder for reset code
- Ensure code hasn't expired (15 min)

#### **Balance Not Updating**
- Check wallet is properly connected
- Verify network connectivity
- Try refreshing browser
- Check for pending transactions

#### **Statement Generation Fails**
- Ensure date range is valid
- Check you have transactions in date range
- Verify account has KYC approval
- Try different export format

---

## 12. Support & Resources

- **Documentation**: See individual service files
- **API Docs**: `/api/docs` (Swagger)
- **Status Page**: `https://status.africoin.io`
- **Support Email**: `support@africoin.io`
- **Community Forum**: `https://forum.africoin.io`

---

**Last Updated:** April 21, 2026  
**Version:** 1.0.0
