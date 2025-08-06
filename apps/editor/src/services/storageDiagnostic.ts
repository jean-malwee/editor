import { backendApiClient } from './backendApiClient';
import { getStorageInfo } from './flowStorage';

/**
 * Utilitário para diagnosticar a configuração de storage e conectividade
 */
export class StorageDiagnostic {
  /**
   * Executa um diagnóstico completo da configuração de storage
   */
  static async runDiagnostic(): Promise<{
    config: ReturnType<typeof getStorageInfo>;
    backendHealth?: { status: string; timestamp: string };
    connectivity: 'ok' | 'error' | 'not-configured';
    error?: string;
  }> {
    const config = getStorageInfo();

    try {
      if (config.isCloud) {
        const backendHealth = await backendApiClient.healthCheck();
        return {
          config,
          backendHealth,
          connectivity: 'ok',
        };
      } else {
        return {
          config,
          connectivity: 'not-configured',
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        config,
        connectivity: 'error',
        error: errorMessage,
      };
    }
  }

  /**
   * Testa a conectividade apenas com o backend
   */
  static async testBackendConnectivity(): Promise<{
    success: boolean;
    data?: { status: string; timestamp: string };
    error?: string;
  }> {
    try {
      const data = await backendApiClient.healthCheck();
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Retorna informações sobre a configuração atual
   */
  static getConfigInfo() {
    return {
      ...getStorageInfo(),
      viteMode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
    };
  }

  /**
   * Logs de debug para desenvolvimento
   */
  static logDebugInfo() {
    const info = this.getConfigInfo();
    console.group('🔧 Storage Configuration Debug');
    console.log('Provider:', info.provider);
    console.log('Is Cloud:', info.isCloud);
    console.log('Environment:', info.environment);
    console.log('Vite Mode:', info.viteMode);
    console.log('Use Cloud Storage Env:', info.useCloudStorageEnv);
    if (info.apiBaseUrl) {
      console.log('API Base URL:', info.apiBaseUrl);
    }
    console.groupEnd();
  }
}

// Auto-log em desenvolvimento
if (import.meta.env.DEV) {
  StorageDiagnostic.logDebugInfo();
}
