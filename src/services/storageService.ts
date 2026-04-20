/* Local Storage and State Management */

interface UserData {
  wallet: string;
  transactions: any[];
  settings: {
    currency: string;
    notifications: boolean;
    twoFactorEnabled: boolean;
  };
}

const DEFAULT_USER_DATA: UserData = {
  wallet: '',
  transactions: [],
  settings: {
    currency: 'USD',
    notifications: true,
    twoFactorEnabled: false,
  },
};

export class StorageService {
  private prefix = 'africoin_';

  setUser(wallet: string, data: Partial<UserData>) {
    const key = `${this.prefix}user_${wallet}`;
    const existing = this.getUser(wallet);
    localStorage.setItem(key, JSON.stringify({ ...existing, ...data }));
  }

  getUser(wallet: string): UserData {
    const key = `${this.prefix}user_${wallet}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : { ...DEFAULT_USER_DATA, wallet };
  }

  clearUser(wallet: string) {
    const key = `${this.prefix}user_${wallet}`;
    localStorage.removeItem(key);
  }

  addTransaction(wallet: string, transaction: any) {
    const user = this.getUser(wallet);
    user.transactions.unshift(transaction);
    if (user.transactions.length > 100) {
      user.transactions = user.transactions.slice(0, 100);
    }
    this.setUser(wallet, user);
  }

  getTransactions(wallet: string): any[] {
    return this.getUser(wallet).transactions;
  }

  saveSettings(wallet: string, settings: Partial<UserData['settings']>) {
    const user = this.getUser(wallet);
    user.settings = { ...user.settings, ...settings };
    this.setUser(wallet, user);
  }

  getSettings(wallet: string): UserData['settings'] {
    return this.getUser(wallet).settings;
  }
}

export const storageService = new StorageService();
