import React, { useState } from 'react';
import { paymentService, PaymentRequest } from '../services/paymentService';
import { kycService, KYCUser } from '../services/kycService';
import '../styles/PaymentGateway.css';

const PaymentGateway: React.FC = () => {
  const [step, setStep] = useState<'payment' | 'kyc' | 'bank'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bank_transfer' | 'payfast' | 'luno'>('stripe');
  const [country, setCountry] = useState('ZA');
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState<'USDT' | 'ZAR' | 'USD'>('USDT');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // KYC states
  const [kyc, setKyc] = useState<Partial<KYCUser>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: 'ZA',
  });

  // Bank states
  const [bankName, setBankName] = useState('FNB');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      const request: PaymentRequest = {
        amount,
        currency,
        method: paymentMethod,
        country: country as 'ZA' | 'US' | 'GB' | 'EU',
        metadata: {
          bankAccount: {
            bankName,
            accountNumber,
            accountHolder,
          },
        },
      };

      const response = await paymentService.processPayment(request);
      setResult(response);
      setStep('kyc');
    } catch (error) {
      alert(`Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKYCSubmit = async () => {
    setLoading(true);
    try {
      if (!kyc.firstName || !kyc.lastName || !kyc.email) {
        alert('Please fill in all KYC fields');
        return;
      }

      const response = await kycService.submitKYC(kyc as KYCUser);
      setResult(response);
      setStep('bank');
    } catch (error) {
      alert(`KYC error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const availableMethods = paymentService.getAvailablePaymentMethods(country);
  const sasBanks = paymentService.getSouthAfricanBanks();

  return (
    <div className="payment-gateway">
      <div className="payment-container">
        <h1>Payment Gateway</h1>

        {/* Step Indicator */}
        <div className="payment-steps">
          <div className={`step ${step === 'payment' ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Payment</span>
          </div>
          <div className={`step ${step === 'kyc' ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">KYC Verification</span>
          </div>
          <div className={`step ${step === 'bank' ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Bank Details</span>
          </div>
        </div>

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="payment-form">
            <div className="form-group">
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="ZA">South Africa</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="EU">Europe</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <div className="amount-input">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  placeholder="Enter amount"
                />
                <select value={currency} onChange={(e) => setCurrency(e.target.value as any)}>
                  <option value="USDT">USDT</option>
                  <option value="ZAR">ZAR</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                {availableMethods.map((method) => (
                  <button
                    key={method}
                    className={`method-btn ${paymentMethod === method ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method as any)}
                  >
                    {method === 'stripe' && '💳 Stripe (Global)'}
                    {method === 'bank_transfer' && '🏦 Bank Transfer (SA)'}
                    {method === 'payfast' && '⚡ PayFast (SA)'}
                    {method === 'luno' && '₿ Luno (Crypto)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank_transfer' && (
              <>
                <div className="form-group">
                  <label>Bank Name</label>
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    {sasBanks.map((bank) => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your account number"
                  />
                </div>

                <div className="form-group">
                  <label>Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Enter account holder name"
                  />
                </div>
              </>
            )}

            <button
              className="btn-primary"
              onClick={handlePayment}
              disabled={loading || !amount}
            >
              {loading ? 'Processing...' : 'Continue to KYC'}
            </button>
          </div>
        )}

        {/* KYC Step */}
        {step === 'kyc' && (
          <div className="kyc-form">
            <h2>Know Your Customer (KYC) Verification</h2>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={kyc.firstName || ''}
                onChange={(e) => setKyc({ ...kyc, firstName: e.target.value })}
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={kyc.lastName || ''}
                onChange={(e) => setKyc({ ...kyc, lastName: e.target.value })}
                placeholder="Enter your last name"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={kyc.email || ''}
                onChange={(e) => setKyc({ ...kyc, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={kyc.phoneNumber || ''}
                onChange={(e) => setKyc({ ...kyc, phoneNumber: e.target.value })}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                value={kyc.dateOfBirth || ''}
                onChange={(e) => setKyc({ ...kyc, dateOfBirth: e.target.value })}
              />
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={() => setStep('payment')}>
                Back
              </button>
              <button className="btn-primary" onClick={handleKYCSubmit} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Identity'}
              </button>
            </div>
          </div>
        )}

        {/* Bank Details Step */}
        {step === 'bank' && (
          <div className="bank-form">
            <h2>Bank Account Verification (Optional)</h2>
            <p>
              Link your bank account for instant deposits. This helps us verify your identity and
              enables faster transactions.
            </p>

            <div className="form-group">
              <label>Bank Name</label>
              <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                {sasBanks.map((bank) => (
                  <option key={bank} value={bank}>
                    {bank}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter your account number"
              />
            </div>

            <div className="form-group">
              <label>Account Holder Name</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Must match your bank records"
              />
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={() => setStep('kyc')}>
                Back
              </button>
              <button className="btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Bank Account'}
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result && (
          <div className="success-message">
            <h2>✅ Payment Initiated</h2>
            <p>Transaction ID: {result.transactionId}</p>
            <p>Status: {result.status}</p>
            <p>Amount: {result.amount} {result.currency}</p>
            {result.paymentUrl && (
              <a href={result.paymentUrl} target="_blank" rel="noopener noreferrer">
                Complete Payment →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;
