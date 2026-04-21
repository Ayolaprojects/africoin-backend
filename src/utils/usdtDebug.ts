/**
 * USDT Real Transaction Validation & Debug Utilities
 * Use this to verify and test real USDT transactions
 */

import { validateUSDTConfig, isRealTransactionMode, USDT_CONFIG, NETWORKS } from '../config/usdtConfig';
import { isValidTronAddress } from '../services/usdtTransactionService';

// ============ VALIDATION RESULTS ============
export interface ValidationResult {
  component: string;
  status: 'ℹ️ INFO' | '✅ PASS' | '⚠️ WARNING' | '❌ FAIL';
  message: string;
  details?: string;
}

// ============ COMPREHENSIVE DIAGNOSTICS ============
export class USDTDiagnostics {
  private results: ValidationResult[] = [];

  /**
   * Run all diagnostic tests
   */
  async runFullDiagnostics(): Promise<ValidationResult[]> {
    this.results = [];

    this.testConfiguration();
    await this.testNetworkConnections();
    this.testAddressValidation();
    await this.testPriceFeeds();
    await this.testBlockchainRPCs();

    return this.results;
  }

  /**
   * Test USDT configuration
   */
  private testConfiguration(): void {
    const config = validateUSDTConfig();

    if (config.valid) {
      this.addResult({
        component: 'Configuration',
        status: '✅ PASS',
        message: 'USDT configuration is valid',
        details: `Real transaction mode: ${isRealTransactionMode() ? 'ENABLED' : 'DISABLED'}`,
      });
    } else {
      config.errors.forEach((error) => {
        this.addResult({
          component: 'Configuration',
          status: '❌ FAIL',
          message: error,
        });
      });
    }

    // Check if production mode is enabled
    if (!isRealTransactionMode()) {
      this.addResult({
        component: 'Production Mode',
        status: '⚠️ WARNING',
        message: 'Real transaction mode is DISABLED',
        details: 'USDT transactions will not execute on mainnet. Enable in usdtConfig.ts',
      });
    }
  }

  /**
   * Test network connections
   */
  private async testNetworkConnections(): Promise<void> {
    // Test Solana
    try {
      const response = await fetch(NETWORKS.SOLANA.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getHealth' }),
      });
      if (response.ok) {
        this.addResult({
          component: 'Network - Solana',
          status: '✅ PASS',
          message: 'Connected to Solana RPC',
          details: `RPC: ${NETWORKS.SOLANA.rpcUrl}`,
        });
      } else {
        throw new Error('RPC returned error');
      }
    } catch (error) {
      this.addResult({
        component: 'Network - Solana',
        status: '❌ FAIL',
        message: 'Cannot connect to Solana RPC',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test TRON
    try {
      const response = await fetch(`${NETWORKS.TRON.rpcUrl}/wallet/getnowblock`);
      if (response.ok) {
        this.addResult({
          component: 'Network - TRON',
          status: '✅ PASS',
          message: 'Connected to TRON RPC',
          details: `RPC: ${NETWORKS.TRON.rpcUrl}`,
        });
      } else {
        throw new Error('RPC returned error');
      }
    } catch (error) {
      this.addResult({
        component: 'Network - TRON',
        status: '⚠️ WARNING',
        message: 'Cannot connect to TRON RPC',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Test address validation patterns
   */
  private testAddressValidation(): void {
    // Test Solana address
    const solanaAddr = 'EPjFWaLb3hqAgqYf4Xfeff7g2gg6zNzrKcxzbnYaAmm';
    if (this.isValidSolanaAddress(solanaAddr)) {
      this.addResult({
        component: 'Address Validation',
        status: '✅ PASS',
        message: 'Solana address validation working',
        details: solanaAddr,
      });
    }

    // Test TRON address
    const tronAddr = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
    if (isValidTronAddress(tronAddr)) {
      this.addResult({
        component: 'Address Validation',
        status: '✅ PASS',
        message: 'TRON address validation working',
        details: tronAddr,
      });
    }
  }

  /**
   * Test price feeds
   */
  private async testPriceFeeds(): Promise<void> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd'
      );
      const data = await response.json();
      const price = data.tether?.usd;

      if (price && price > 0) {
        this.addResult({
          component: 'Price Feed',
          status: '✅ PASS',
          message: 'CoinGecko API working',
          details: `Current USDT price: $${price}`,
        });
      } else {
        throw new Error('Invalid price data');
      }
    } catch (error) {
      this.addResult({
        component: 'Price Feed',
        status: '⚠️ WARNING',
        message: 'Cannot fetch USDT price',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Test blockchain RPCs
   */
  private async testBlockchainRPCs(): Promise<void> {
    // Test Solana RPC
    try {
      const response = await fetch(NETWORKS.SOLANA.rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenSupply',
          params: [USDT_CONFIG.SOLANA.mint],
        }),
      });
      const data = await response.json();
      if (data.result) {
        this.addResult({
          component: 'Blockchain RPC',
          status: '✅ PASS',
          message: 'Solana USDT contract accessible',
          details: `Token: ${USDT_CONFIG.SOLANA.mint}`,
        });
      }
    } catch (error) {
      this.addResult({
        component: 'Blockchain RPC',
        status: '❌ FAIL',
        message: 'Cannot access Solana USDT contract',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Helper: Validate Solana address
   */
  private isValidSolanaAddress(address: string): boolean {
    try {
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    } catch {
      return false;
    }
  }

  /**
   * Add result to results array
   */
  private addResult(result: ValidationResult): void {
    this.results.push(result);
  }

  /**
   * Get formatted output
   */
  getFormattedOutput(): string {
    const lines = [
      '╔════════════════════════════════════════════════════════════╗',
      '║         AFRICOIN USDT REAL TRANSACTION DIAGNOSTICS         ║',
      '╚════════════════════════════════════════════════════════════╝',
      '',
    ];

    const grouped = this.groupResultsByComponent();
    Object.entries(grouped).forEach(([component, results]) => {
      lines.push(`📋 ${component}`);
      results.forEach((result) => {
        lines.push(`   ${result.status} ${result.message}`);
        if (result.details) {
          lines.push(`      └─ ${result.details}`);
        }
      });
      lines.push('');
    });

    // Summary
    const passCount = this.results.filter((r) => r.status === '✅ PASS').length;
    const failCount = this.results.filter((r) => r.status === '❌ FAIL').length;
    const warningCount = this.results.filter((r) => r.status === '⚠️ WARNING').length;

    lines.push('═'.repeat(62));
    lines.push(`Summary: ${passCount} passed, ${warningCount} warnings, ${failCount} failed`);
    lines.push(`Status: ${failCount === 0 ? '✅ All critical checks passed' : '❌ Fix errors above'}`);

    return lines.join('\n');
  }

  /**
   * Group results by component
   */
  private groupResultsByComponent(): Record<string, ValidationResult[]> {
    return this.results.reduce(
      (acc, result) => {
        if (!acc[result.component]) {
          acc[result.component] = [];
        }
        acc[result.component].push(result);
        return acc;
      },
      {} as Record<string, ValidationResult[]>
    );
  }

  /**
   * Export results as JSON
   */
  exportJSON(): string {
    return JSON.stringify(this.results, null, 2);
  }

  /**
   * Check if all critical tests passed
   */
  allTestsPassed(): boolean {
    return !this.results.some((r) => r.status === '❌ FAIL');
  }
}

// ============ TRANSACTION SIMULATOR ============
export class USDTTransactionSimulator {
  /**
   * Simulate a USDT transfer transaction
   */
  static simulateTransfer(from: string, to: string, amount: number, network: 'solana' | 'tron') {
    console.log(`
    🔄 SIMULATING ${network.toUpperCase()} USDT TRANSFER
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    From:     ${from}
    To:       ${to}
    Amount:   ${amount} USDT
    Network:  ${network}
    Timestamp: ${new Date().toISOString()}
    Status:   ⏳ SIMULATED (NOT REAL)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }

  /**
   * Show transaction cost estimate
   */
  static showCostEstimate(amount: number, network: 'solana' | 'tron') {
    const estimates = {
      solana: { fee: 0.0001, currency: 'SOL', cost: 0.0001 },
      tron: { fee: 10, currency: 'TRX', cost: 10 },
    };

    const estimate = estimates[network];
    console.log(`
    💰 TRANSACTION COST ESTIMATE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Amount:    ${amount} USDT
    Network:   ${network.toUpperCase()}
    Fee:       ${estimate.fee} ${estimate.currency}
    Total Cost: ${estimate.cost} ${estimate.currency}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
  }
}

// ============ DEBUG HELPER ============
export async function debugUSDTSetup(): Promise<void> {
  console.log('🔍 Starting USDT Configuration Debug...\n');

  const diagnostics = new USDTDiagnostics();
  await diagnostics.runFullDiagnostics();

  console.log(diagnostics.getFormattedOutput());

  if (diagnostics.allTestsPassed()) {
    console.log('\n✅ All systems ready for USDT transactions!');
  } else {
    console.log('\n❌ Please fix the errors above before processing USDT transactions');
    console.log('\n📋 Detailed Results:');
    console.log(diagnostics.exportJSON());
  }
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).debugUSDT = debugUSDTSetup;
  (window as any).USDTDiagnostics = USDTDiagnostics;
  (window as any).USDTTransactionSimulator = USDTTransactionSimulator;
}
