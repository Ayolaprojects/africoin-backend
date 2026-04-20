import React, { useState, useEffect } from 'react';
import BankingService, { BankAccount, LocalBankConfig } from '../services/bankingService';
import '../styles/banking.css';

const BankingPage: React.FC = () => {
  const [localBanks, setLocalBanks] = useState<LocalBankConfig[]>([]);
  const [linkedAccounts, setLinkedAccounts] = useState<BankAccount[]>([]);
  const [selectedTab, setSelectedTab] = useState<'accounts' | 'transfer' | 'link'>('accounts');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [country, setCountry] = useState('ZA');

  useEffect(() => {
    loadBanks();
    loadLinkedAccounts();
  }, []);

  const loadBanks = () => {
    const banks = BankingService.getLocalBanks();
    setLocalBanks(banks);
  };

  const loadLinkedAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await BankingService.getLinkedAccounts();
      setLinkedAccounts(accounts);
    } catch (err: any) {
      setError(err.message || 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Validate account
      const validation = await BankingService.validateAccountNumber(bankCode, accountNumber);
      if (!validation.valid) {
        setError('Invalid account number');
        return;
      }

      // Link account
      await BankingService.linkBankAccount(
        bankCode,
        accountNumber,
        accountHolder || validation.accountHolder || 'Unknown',
        country
      );

      setSuccess(`Account linked successfully! Verification code sent to your email.`);
      setBankCode('');
      setAccountNumber('');
      setAccountHolder('');
      loadLinkedAccounts();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to link account');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to remove this account?')) {
      try {
        setLoading(true);
        await BankingService.removeBankAccount(accountId);
        setSuccess('Account removed successfully');
        loadLinkedAccounts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError(err.message || 'Failed to remove account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="banking-container">
      <div className="banking-header">
        <h1>💳 Banking Integration</h1>
        <p>Link and manage your bank accounts for seamless transfers</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="banking-tabs">
        <button
          className={`tab-btn ${selectedTab === 'accounts' ? 'active' : ''}`}
          onClick={() => setSelectedTab('accounts')}
        >
          Linked Accounts
        </button>
        <button
          className={`tab-btn ${selectedTab === 'link' ? 'active' : ''}`}
          onClick={() => setSelectedTab('link')}
        >
          Link Bank Account
        </button>
        <button
          className={`tab-btn ${selectedTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setSelectedTab('transfer')}
        >
          Send Transfer
        </button>
      </div>

      {selectedTab === 'accounts' && (
        <div className="banking-section">
          <h2>Your Linked Bank Accounts</h2>
          {linkedAccounts.length === 0 ? (
            <div className="empty-state">
              <p>No bank accounts linked yet</p>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedTab('link')}
              >
                Link Your First Account
              </button>
            </div>
          ) : (
            <div className="accounts-grid">
              {linkedAccounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-header">
                    <h3>{account.bankName}</h3>
                    <span className={`status ${account.verified ? 'verified' : 'pending'}`}>
                      {account.verified ? '✓ Verified' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="account-details">
                    <p>
                      <strong>Account:</strong> {account.accountNumber.slice(-4).padStart(account.accountNumber.length, '*')}
                    </p>
                    <p>
                      <strong>Holder:</strong> {account.accountHolder}
                    </p>
                    <p>
                      <strong>Currency:</strong> {account.currency}
                    </p>
                    <p>
                      <strong>Country:</strong> {account.country}
                    </p>
                  </div>
                  <div className="account-actions">
                    <button className="btn btn-secondary">View Details</button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveAccount(account.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTab === 'link' && (
        <div className="banking-section">
          <h2>Link a Bank Account</h2>
          <form onSubmit={handleLinkAccount} className="banking-form">
            <div className="form-group">
              <label>Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="ZA">South Africa 🇿🇦</option>
                <option value="NG">Nigeria 🇳🇬</option>
                <option value="KE">Kenya 🇰🇪</option>
              </select>
            </div>

            <div className="form-group">
              <label>Bank</label>
              <select
                value={bankCode}
                onChange={(e) => setBankCode(e.target.value)}
                required
              >
                <option value="">Select a bank</option>
                {localBanks
                  .filter((bank) => bank.country === country)
                  .map((bank) => (
                    <option key={bank.code} value={bank.code}>
                      {bank.name}
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
                required
              />
            </div>

            <div className="form-group">
              <label>Account Holder Name (optional)</label>
              <input
                type="text"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                placeholder="Will be auto-filled if empty"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Linking...' : 'Link Account'}
            </button>
          </form>

          <div className="info-box">
            <h4>📋 What happens next?</h4>
            <ol>
              <li>We'll verify your account details with your bank</li>
              <li>You'll receive a verification code via email</li>
              <li>Enter the code to confirm your account</li>
              <li>Start making transfers immediately</li>
            </ol>
          </div>
        </div>
      )}

      {selectedTab === 'transfer' && (
        <div className="banking-section">
          <h2>Send a Transfer</h2>
          {linkedAccounts.length === 0 ? (
            <div className="empty-state">
              <p>Link a bank account first to send transfers</p>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedTab('link')}
              >
                Link Account
              </button>
            </div>
          ) : (
            <div className="transfer-options">
              <div className="transfer-card">
                <h3>💰 Domestic Transfer</h3>
                <p>Send money to another bank account in the same country</p>
                <button className="btn btn-secondary">Start Transfer</button>
              </div>
              <div className="transfer-card">
                <h3>🌍 International Transfer</h3>
                <p>Send money to any country using SWIFT network</p>
                <button className="btn btn-secondary">Start Transfer</button>
              </div>
              <div className="transfer-card">
                <h3>🔗 Crypto to Bank</h3>
                <p>Convert crypto to fiat and send to your bank</p>
                <button className="btn btn-secondary">Start Transfer</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BankingPage;
