import React, { useState, useEffect } from 'react';
import {
  SidebarMenuBadgeBase as Badge,
  TooltipBase as Tooltip,
  TooltipContentBase as TooltipContent,
  TooltipProviderBase as TooltipProvider,
  TooltipTriggerBase as TooltipTrigger,
  ButtonBase as Button,
  DialogBase as Dialog,
  DialogContentBase as DialogContent,
  DialogHeaderBase as DialogHeader,
  DialogTitleBase as DialogTitle,
  DialogFooterBase as DialogFooter,
} from '@mlw-packages/react-components';
import { CloudIcon, DatabaseIcon, InfoIcon } from '@phosphor-icons/react';
import { getStorageInfo } from '../services/flowStorage';
import { StorageDiagnostic } from '../services/storageDiagnostic';

interface DiagnosticData {
  config: ReturnType<typeof getStorageInfo>;
  backendHealth?: { status: string; timestamp: string };
  connectivity: 'ok' | 'error' | 'not-configured';
  error?: string;
}

export const StorageStatusIndicator: React.FC = () => {
  const [storageInfo] = useState(() => getStorageInfo());
  const [diagnosticModalVisible, setDiagnosticModalVisible] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);

  const isCloud = storageInfo.isCloud;
  const icon = isCloud ? <CloudIcon size={16} /> : <DatabaseIcon size={16} />;
  const color = isCloud ? 'blue' : 'green';
  const title = isCloud ? 'Cloud Storage (via Backend API)' : 'Local Storage';

  const runDiagnostic = async () => {
    setDiagnosticLoading(true);
    try {
      const result = await StorageDiagnostic.runDiagnostic();
      setDiagnosticData(result);
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
    } finally {
      setDiagnosticLoading(false);
    }
  };

  useEffect(() => {
    if (diagnosticModalVisible && !diagnosticData) {
      runDiagnostic();
    }
  }, [diagnosticModalVisible, diagnosticData]);

  const handleShowDiagnostic = () => {
    setDiagnosticModalVisible(true);
  };

  const getConnectivityStatus = () => {
    if (!diagnosticData) return null;

    const { connectivity } = diagnosticData;
    switch (connectivity) {
      case 'ok':
        return <Badge style={{ backgroundColor: 'green', color: 'white' }}>Conectado</Badge>;
      case 'error':
        return <Badge style={{ backgroundColor: 'red', color: 'white' }}>Erro de conexão</Badge>;
      case 'not-configured':
        return <Badge>Local</Badge>;
      default:
        return <Badge style={{ backgroundColor: 'blue', color: 'white' }}>Verificando...</Badge>;
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleShowDiagnostic} style={{ color }}>
              {icon}
              <span className="ml-1">{isCloud ? 'Cloud' : 'Local'}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Storage: {title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={diagnosticModalVisible} onOpenChange={setDiagnosticModalVisible}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <InfoIcon size={16} />
              Informações de Storage
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h5 className="font-semibold mb-2">Configuração Atual</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Provider:</span>
                  <span className="flex items-center gap-1">
                    {icon}
                    <strong>{storageInfo.provider}</strong>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span>{storageInfo.isCloud ? 'Cloud Storage' : 'Local Storage'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ambiente:</span>
                  <span>{storageInfo.environment}</span>
                </div>
                {storageInfo.apiBaseUrl && (
                  <div className="flex justify-between">
                    <span>API Base URL:</span>
                    <code className="bg-gray-100 px-1 rounded">{storageInfo.apiBaseUrl}</code>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Variável de Ambiente:</span>
                  <code className="bg-gray-100 px-1 rounded">
                    VITE_USE_CLOUD_STORAGE={storageInfo.useCloudStorageEnv || 'undefined'}
                  </code>
                </div>
              </div>
            </div>

            {diagnosticData && (
              <div>
                <h5 className="font-semibold mb-2">Status de Conectividade</h5>
                <div className="space-y-2">
                  {getConnectivityStatus()}

                  {diagnosticData.connectivity === 'error' && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-800 font-medium">Erro de Conectividade</p>
                      <p className="text-red-600 text-sm">{diagnosticData.error}</p>
                    </div>
                  )}

                  {diagnosticData.backendHealth && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="text-green-800 font-medium">Backend Disponível</p>
                      <div className="text-green-600 text-sm">
                        <p>Status: {diagnosticData.backendHealth.status}</p>
                        <p>Timestamp: {diagnosticData.backendHealth.timestamp}</p>
                      </div>
                    </div>
                  )}

                  {diagnosticData.connectivity === 'not-configured' && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-blue-800 font-medium">Modo Local</p>
                      <p className="text-blue-600 text-sm">
                        Usando localStorage do navegador. Para usar Cloud Storage, configure VITE_USE_CLOUD_STORAGE=true
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={runDiagnostic} disabled={diagnosticLoading}>
              {diagnosticLoading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button variant="default" onClick={() => setDiagnosticModalVisible(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
