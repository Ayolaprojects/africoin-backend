import axios from 'axios';

export interface StatementFilter {
  startDate: string;
  endDate: string;
  transactionType?: 'all' | 'send' | 'receive' | 'swap';
  currency?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'send' | 'receive' | 'swap' | 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  from: string;
  to: string;
  status: 'completed' | 'pending' | 'failed';
  fee: number;
  hash?: string;
  description?: string;
}

export interface AccountStatement {
  accountId: string;
  accountHolder: string;
  email: string;
  statementPeriod: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
  totalTransactions: number;
  totalInbound: number;
  totalOutbound: number;
  netFlow: number;
  openingBalance: number;
  closingBalance: number;
  transactions: Transaction[];
}

export class StatementService {
  private apiUrl = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:3001';

  /**
   * Generate account statement for a date range
   */
  async generateStatement(userId: string, filter: StatementFilter): Promise<AccountStatement> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/statements/generate`,
        {
          userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          transactionType: filter.transactionType || 'all',
          currency: filter.currency
        }
      );

      return response.data;
    } catch (error) {
      console.error('Statement generation error:', error);
      throw new Error('Failed to generate statement');
    }
  }

  /**
   * Export statement as CSV
   */
  async exportAsCSV(statement: AccountStatement): Promise<string> {
    try {
      let csv = 'ACCOUNT STATEMENT\n';
      csv += `Account Holder,${statement.accountHolder}\n`;
      csv += `Email,${statement.email}\n`;
      csv += `Period,${statement.statementPeriod.startDate} to ${statement.statementPeriod.endDate}\n`;
      csv += `Generated,${statement.generatedAt}\n\n`;

      csv += `ACCOUNT SUMMARY\n`;
      csv += `Opening Balance,${statement.openingBalance}\n`;
      csv += `Closing Balance,${statement.closingBalance}\n`;
      csv += `Total Inbound,${statement.totalInbound}\n`;
      csv += `Total Outbound,${statement.totalOutbound}\n`;
      csv += `Net Flow,${statement.netFlow}\n\n`;

      csv += 'TRANSACTIONS\n';
      csv += 'Date,Type,Amount,Currency,From,To,Status,Fee,Description\n';

      statement.transactions.forEach(tx => {
        csv += `${tx.date},"${tx.type}",${tx.amount},${tx.currency},"${tx.from}","${tx.to}","${tx.status}",${tx.fee},"${tx.description || ''}"\n`;
      });

      return csv;
    } catch (error) {
      console.error('CSV export error:', error);
      throw new Error('Failed to export CSV');
    }
  }

  /**
   * Export statement as PDF (requires backend)
   */
  async exportAsPDF(userId: string, statement: AccountStatement): Promise<Blob> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/statements/export-pdf`,
        { userId, statement },
        { responseType: 'blob' }
      );

      return response.data;
    } catch (error) {
      console.error('PDF export error:', error);
      throw new Error('Failed to export PDF');
    }
  }

  /**
   * Email statement to user
   */
  async emailStatement(userId: string, email: string, statement: AccountStatement): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/statements/email`, {
        userId,
        email,
        statement
      });
    } catch (error) {
      console.error('Email statement error:', error);
      throw new Error('Failed to email statement');
    }
  }

  /**
   * Schedule recurring statement delivery
   */
  async scheduleStatement(userId: string, frequency: 'weekly' | 'monthly' | 'quarterly'): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/api/statements/schedule`, {
        userId,
        frequency
      });
    } catch (error) {
      console.error('Schedule statement error:', error);
      throw new Error('Failed to schedule statement');
    }
  }

  /**
   * Get statement history (previously generated statements)
   */
  async getStatementHistory(userId: string, limit: number = 12): Promise<AccountStatement[]> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/statements/history/${userId}?limit=${limit}`
      );

      return response.data;
    } catch (error) {
      console.error('Statement history error:', error);
      return [];
    }
  }

  /**
   * Download CSV directly
   */
  downloadCSV(csv: string, fileName: string = 'statement.csv'): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Download PDF directly
   */
  downloadPDF(blob: Blob, fileName: string = 'statement.pdf'): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  /**
   * Get summary statistics for date range
   */
  async getStatementSummary(userId: string, filter: StatementFilter): Promise<any> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/api/statements/summary`,
        {
          userId,
          startDate: filter.startDate,
          endDate: filter.endDate,
          transactionType: filter.transactionType || 'all'
        }
      );

      return response.data;
    } catch (error) {
      console.error('Statement summary error:', error);
      throw new Error('Failed to get statement summary');
    }
  }
}

export const statementService = new StatementService();
