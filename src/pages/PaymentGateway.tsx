import React, { useState } from 'react';
import { paymentService, PaymentRequest } from '../services/paymentService';
import { kycService, KYCUser } from '../services/kycService';
import { zimbabweService } from '../services/zimbabweService';
import '../styles/PaymentGateway.css';

const PaymentGateway: React.FC = () => {
  const saBanks = paymentService.getSouthAfricanBanks();
  const [step, setStep] = useState<'payment' | 'kyc' | 'bank' | 'zimbabwe'>('payment');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bank_transfer' | 'payfast' | 'luno' | 'ecocash' | 'ecocash_airtime' | 'payzone' | 'kwese'>('stripe');
  const [country, setCountry] = useState('ZA');
  const [amount, setAmount] = useState(100);
  const [currency, setCurrency] = useState<'USDT' | 'ZAR' | 'USD' | 'EUR' | 'ZWL'>('USDT');
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

  // Zimbabwe specific states
  const [ecocashPhone, setEcocashPhone] = useState('');
  const [ecocashPin, setEcocashPin] = useState('');
  const [cassavaRecipient, setCassavaRecipient] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod.startsWith('ecocash')) {
        // Handle EcoCash
        const txResult = await zimbabweService.initiateEcoCash({
          phoneNumber: ecocashPhone,
          amount,
          transactionType: paymentMethod === 'ecocash' ? 'money_transfer' : 'airtime',
        });
        setResult(txResult);
        setStep('zimbabwe');
      } else if (paymentMethod === 'payzone' || paymentMethod === 'kwese') {
        // Handle Cassava (PayZone, Kwese)
        const txResult = await zimbabweService.initiateCassava({
          method: paymentMethod === 'payzone' ? 'payzone' : 'kwese_remit',
          amount,
          recipient: cassavaRecipient,
        });
        setResult(txResult);
        setStep('zimbabwe');
      } else {
        // Handle standard payment methods
        const paymentCurrency: PaymentRequest['currency'] = currency === 'ZWL' ? 'USD' : currency;

        const request: PaymentRequest = {
          amount,
          currency: paymentCurrency,
          method: paymentMethod as any,
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
      }
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

  const handleZimbabweConfirm = async () => {
    setLoading(true);
    try {
      if (paymentMethod.startsWith('ecocash')) {
        await zimbabweService.confirmEcoCashPin(result.reference, ecocashPin);
        alert('EcoCash transaction confirmed!');
      } else if (paymentMethod === 'payzone' || paymentMethod === 'kwese') {
        await zimbabweService.confirmCassavaTransaction(result.reference, ecocashPin);
        alert('Cassava transaction confirmed!');
      }
      setStep('payment');
      setResult(null);
    } catch (error) {
      alert(`Confirmation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // No longer using getAvailablePaymentMethods - methods determined by country state

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
          <div className={`step ${step === 'zimbabwe' ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Zimbabwe Confirm</span>
          </div>
        </div>

        {/* Payment Step */}
        {step === 'payment' && (
          <div className="payment-form">
            <div className="form-group">
              <label>Country</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="ZA">South Africa</option>
                <option value="ZW">🇿🇼 Zimbabwe</option>
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
                  {country === 'ZW' ? (
                    <>
                      <option value="ZWL">ZWL</option>
                      <option value="USD">USD</option>
                    </>
                  ) : (
                    <>
                      <option value="ZAR">ZAR</option>
                      <option value="USD">USD</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div className="payment-methods">
                {country === 'ZW' ? (
                  <>
                    <button
                      className={`method-btn zimbabwe ${paymentMethod === 'ecocash' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('ecocash')}
                    >
                      💚 EcoCash Transfer
                    </button>
                    <button
                      className={`method-btn zimbabwe ${paymentMethod === 'ecocash_airtime' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('ecocash_airtime' as any)}
                    >
                      📱 EcoCash Airtime
                    </button>
                    <button
                      className={`method-btn zimbabwe ${paymentMethod === 'payzone' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('payzone')}
                    >
                      🏪 PayZone
                    </button>
                    <button
                      className={`method-btn zimbabwe ${paymentMethod === 'kwese' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('kwese')}
                    >
                      📡 Kwese Remit
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`method-btn ${paymentMethod === 'stripe' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('stripe')}
                    >
                      💳 Stripe (Global)
                    </button>
                    <button
                      className={`method-btn ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('bank_transfer')}
                    >
                      🏦 Bank Transfer (SA)
                    </button>
                    <button
                      className={`method-btn ${paymentMethod === 'payfast' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('payfast')}
                    >
                      ⚡ PayFast (SA)
                    </button>
                    <button
                      className={`method-btn ${paymentMethod === 'luno' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('luno')}
                    >
                      ₿ Luno (Crypto)
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Zimbabwe Payment Methods */}
            {country === 'ZW' && (paymentMethod === 'ecocash' || paymentMethod === ('ecocash_airtime' as any)) && (
              <div className="zimbabwe-form">
                <h3>💚 EcoCash Payment</h3>
                <div className="form-group">
                  <label>EcoCash Phone Number</label>
                  <input
                    type="tel"
                    value={ecocashPhone}
                    onChange={(e) => setEcocashPhone(e.target.value)}
                    placeholder="+263-78-xxx-xxxx"
                  />
                </div>
              </div>
            )}

            {country === 'ZW' && (paymentMethod === 'payzone' || paymentMethod === 'kwese') && (
              <div className="zimbabwe-form">
                <h3>{paymentMethod === 'payzone' ? '🏪 PayZone' : '📡 Kwese Remit'}</h3>
                <div className="form-group">
                  <label>Recipient</label>
                  <input
                    type="text"
                    value={cassavaRecipient}
                    onChange={(e) => setCassavaRecipient(e.target.value)}
                    placeholder="Recipient name/account"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank_transfer' && country !== 'ZW' && (
              <>
                <div className="form-group">
                  <label>Bank Name</label>
                  <select value={bankName} onChange={(e) => setBankName(e.target.value)}>
                    {saBanks.map((bank) => (
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
                {saBanks.map((bank) => (
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

        {/* Zimbabwe Confirmation Step */}
        {step === 'zimbabwe' && (
          <div className="zimbabwe-confirm-form">
            <h2>🇿🇼 Confirm Your Payment</h2>
            <p>Transaction ID: {result?.reference}</p>
            <p>Amount: {amount} {currency}</p>

            <div className="form-group">
              <label>Enter PIN to Confirm</label>
              <input
                type="password"
                value={ecocashPin}
                onChange={(e) => setEcocashPin(e.target.value)}
                placeholder="Enter your PIN"
                maxLength={4}
              />
              <small>A confirmation SMS has been sent to your registered number</small>
            </div>

            <div className="button-group">
              <button className="btn-secondary" onClick={() => setStep('payment')}>
                Back
              </button>
              <button
                className="btn-primary"
                onClick={handleZimbabweConfirm}
                disabled={loading || !ecocashPin}
              >
                {loading ? 'Confirming...' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        {result && (
          <div className="success-message">
            <h2>✅ Payment Initiated</h2>
            <p>Transaction ID: {result.transactionId || result.reference}</p>
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
