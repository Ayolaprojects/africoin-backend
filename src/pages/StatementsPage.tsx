import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { statementService, AccountStatement } from '../services/statementService';
import { balanceService } from '../services/balanceService';
import './StatementsPage.css';

interface GeneratedStatement {
  id: string;
  period: string;
  generatedAt: string;
  transactionCount: number;
  totalInbound: number;
  totalOutbound: number;
}

const StatementsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Generate Statement Form
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    transactionType: 'all',
    currency: 'all',
    format: 'pdf'
  });

  // History
  const [statementHistory, setStatementHistory] = useState<GeneratedStatement[]>([]);
  const [generatedStatement, setGeneratedStatement] = useState<AccountStatement | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadStatementHistory();
    }
  }, [user?.id]);

  const loadStatementHistory = async () => {
    try {
      setLoading(true);
      const history = await statementService.getStatementHistory(user!.id, 10);
      setStatementHistory(history.map((stmt, idx) => ({
        id: idx.toString(),
        period: `${stmt.statementPeriod.startDate} to ${stmt.statementPeriod.endDate}`,
        generatedAt: new Date(stmt.generatedAt).toLocaleDateString(),
        transactionCount: stmt.totalTransactions,
        totalInbound: stmt.totalInbound,
        totalOutbound: stmt.totalOutbound
      })));
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.startDate || !formData.endDate) {
      setError('Please select both start and end dates');
      return false;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date must be before end date');
      return false;
    }

    return true;
  };

  const handleGenerateStatement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const statement = await statementService.generateStatement(user!.id, {
        startDate: formData.startDate,
        endDate: formData.endDate,
        transactionType: formData.transactionType as any,
        currency: formData.currency === 'all' ? undefined : formData.currency
      });

      setGeneratedStatement(statement);
      setSuccess('Statement generated successfully!');

      // Auto-download based on format
      if (formData.format === 'csv') {
        const csv = await statementService.exportAsCSV(statement);
        statementService.downloadCSV(
          csv,
          `statement-${formData.startDate}-to-${formData.endDate}.csv`
        );
      } else {
        const pdf = await statementService.exportAsPDF(user!.id, statement);
        statementService.downloadPDF(
          pdf,
          `statement-${formData.startDate}-to-${formData.endDate}.pdf`
        );
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to generate statement');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailStatement = async (statement: AccountStatement) => {
    try {
      setLoading(true);
      await statementService.emailStatement(user!.id, user!.email, statement);
      setSuccess('Statement sent to your email!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to email statement');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleStatement = async (frequency: 'weekly' | 'monthly' | 'quarterly') => {
    try {
      setLoading(true);
      await statementService.scheduleStatement(user!.id, frequency);
      setSuccess(`Statements will be sent ${frequency}!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError((err as Error).message || 'Failed to schedule statement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="statements-page">
      <div className="statements-container">
        <div className="page-header">
          <div>
            <h1>📄 Transaction Statements</h1>
            <p>Generate, download, and manage your account statements</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i>
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="statement-tabs">
          <button
            className={`tab-btn ${activeTab === 'generate' ? 'active' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            <i className="fas fa-file-download"></i> Generate Statement
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <i className="fas fa-history"></i> Statement History
          </button>
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="statement-card">
            <h2>Generate New Statement</h2>
            <form onSubmit={handleGenerateStatement} className="statement-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endDate">End Date *</label>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="transactionType">Transaction Type</label>
                  <select
                    id="transactionType"
                    name="transactionType"
                    value={formData.transactionType}
                    onChange={handleInputChange}
                  >
                    <option value="all">All Transactions</option>
                    <option value="send">Sent Only</option>
                    <option value="receive">Received Only</option>
                    <option value="swap">Swaps Only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                  >
                    <option value="all">All Currencies</option>
                    <option value="AFR">AFR</option>
                    <option value="SOL">SOL</option>
                    <option value="USDT">USDT</option>
                    <option value="ZWL">ZWL</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="format">Export Format</label>
                <div className="format-options">
                  <label className="option-label">
                    <input
                      type="radio"
                      name="format"
                      value="pdf"
                      checked={formData.format === 'pdf'}
                      onChange={handleInputChange}
                    />
                    <span>📄 PDF - Professional format with charts</span>
                  </label>
                  <label className="option-label">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={formData.format === 'csv'}
                      onChange={handleInputChange}
                    />
                    <span>📊 CSV - Import to Excel/Google Sheets</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-download"></i>
                    Generate & Download Statement
                  </>
                )}
              </button>
            </form>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>Quick Schedules</h3>
              <div className="action-buttons">
                <button
                  className="action-btn"
                  onClick={() => handleScheduleStatement('weekly')}
                  disabled={loading}
                >
                  📧 Weekly Statement
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleScheduleStatement('monthly')}
                  disabled={loading}
                >
                  📧 Monthly Statement
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleScheduleStatement('quarterly')}
                  disabled={loading}
                >
                  📧 Quarterly Statement
                </button>
              </div>
              <p className="helper-text">Statements will be automatically emailed to {user?.email}</p>
            </div>

            {/* Statement Preview */}
            {generatedStatement && (
              <div className="statement-preview">
                <h3>Statement Summary</h3>
                <div className="preview-grid">
                  <div className="preview-item">
                    <span className="label">Period</span>
                    <span className="value">
                      {generatedStatement.statementPeriod.startDate} to {generatedStatement.statementPeriod.endDate}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Transactions</span>
                    <span className="value">{generatedStatement.totalTransactions}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Total Inbound</span>
                    <span className="value positive">${generatedStatement.totalInbound.toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Total Outbound</span>
                    <span className="value negative">${generatedStatement.totalOutbound.toFixed(2)}</span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Net Flow</span>
                    <span className={`value ${generatedStatement.netFlow >= 0 ? 'positive' : 'negative'}`}>
                      ${generatedStatement.netFlow.toFixed(2)}
                    </span>
                  </div>
                  <div className="preview-item">
                    <span className="label">Closing Balance</span>
                    <span className="value">${generatedStatement.closingBalance.toFixed(2)}</span>
                  </div>
                </div>

                <div className="preview-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEmailStatement(generatedStatement)}
                    disabled={loading}
                  >
                    <i className="fas fa-envelope"></i>
                    Email Statement
                  </button>
                  <button className="btn-secondary">
                    <i className="fas fa-print"></i>
                    Print
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="statement-card">
            <h2>Statement History</h2>
            <p className="helper-text">Your previously generated statements</p>

            {statementHistory.length > 0 ? (
              <div className="statements-list">
                <div className="list-header">
                  <span>Period</span>
                  <span>Generated</span>
                  <span>Transactions</span>
                  <span>Inbound</span>
                  <span>Outbound</span>
                  <span>Actions</span>
                </div>
                {statementHistory.map((stmt) => (
                  <div key={stmt.id} className="list-item">
                    <span>{stmt.period}</span>
                    <span>{stmt.generatedAt}</span>
                    <span>{stmt.transactionCount}</span>
                    <span className="amount positive">${stmt.totalInbound.toFixed(2)}</span>
                    <span className="amount negative">${stmt.totalOutbound.toFixed(2)}</span>
                    <span className="actions">
                      <button className="action-link" title="Download PDF">
                        <i className="fas fa-download"></i>
                      </button>
                      <button className="action-link" title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No statements generated yet</p>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab('generate')}
                >
                  Generate Your First Statement
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatementsPage;
