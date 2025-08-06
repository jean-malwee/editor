import { QueryClient } from '@tanstack/react-query';

/**
 * Configuração do cliente React Query
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tempo que os dados ficam "frescos" antes de serem considerados stale
      staleTime: 5 * 60 * 1000, // 5 minutos
      // Tempo que os dados ficam em cache antes de serem removidos
      gcTime: 10 * 60 * 1000, // 10 minutos
      // Retry automático em caso de falha
      retry: (failureCount, error) => {
        // Não retry em erros 404 ou 403
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status === 404 || status === 403) {
            return false;
          }
        }
        // Para outros erros, retry até 3 vezes
        return failureCount < 3;
      },
      // Tempo entre retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch automático quando a aba ganha foco
      refetchOnWindowFocus: false,
      // Refetch automático quando a conexão é restabelecida
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automático para mutations em caso de falha de rede
      retry: (failureCount, error) => {
        // Não retry em erros de cliente (4xx)
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Para erros de servidor, retry até 2 vezes
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    },
  },
});
