import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonBase as Button, CardBase as Card } from '@mlw-packages/react-components';
import { ArrowLeftIcon, PencilSimpleIcon, TrashIcon, PlusIcon } from '@phosphor-icons/react';
import { PageHeader } from '../components/page-header';
import { FlowListByRule } from '../components/flow-list-by-rule';
import { ActiveFlowIndicator } from '../components/active-flow-indicator';
import { RuleEditModal } from '../components/rule-edit-modal';
import { useRule, useDeleteRule, useActivateFlow, useUpdateRule } from '../hooks/useRules';
import { useCreateFlow } from '../hooks/useFlows';

const Title = ({ level, className, children }: { level?: number; className?: string; children: React.ReactNode }) => {
  const fontSize = level === 2 ? '24px' : '18px';
  return (
    <h2 style={{ fontSize, margin: 0 }} className={className}>
      {children}
    </h2>
  );
};

const Text = ({ type, className, children }: { type?: string; className?: string; children: React.ReactNode }) => {
  const color = type === 'secondary' ? '#8c8c8c' : undefined;
  return (
    <span style={{ color }} className={className}>
      {children}
    </span>
  );
};

const Breadcrumb = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={className} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
    {children}
  </div>
);

Breadcrumb.Item = ({ children }: { children: React.ReactNode }) => <span style={{ color: '#8c8c8c' }}>{children}</span>;

const Spin = ({ size }: { size?: string }) => (
  <div
    style={{
      width: size === 'large' ? '32px' : '16px',
      height: size === 'large' ? '32px' : '16px',
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }}
  />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Alert = ({ message, description, type, className }: any) => (
  <div
    className={className}
    style={{
      padding: '16px',
      border: `1px solid ${type === 'error' ? '#ff4d4f' : '#d9d9d9'}`,
      borderRadius: '6px',
      backgroundColor: type === 'error' ? '#fff2f0' : '#f6f8ff',
      margin: '16px 0',
    }}
  >
    <div style={{ color: type === 'error' ? '#ff4d4f' : '#1890ff', fontWeight: '500', marginBottom: '4px' }}>
      {message}
    </div>
    <div style={{ color: type === 'error' ? '#ff4d4f' : '#1890ff', fontSize: '14px' }}>{description}</div>
  </div>
);

export const RuleDetailsPage: React.FC = () => {
  const { ruleId } = useParams<{ ruleId: string }>();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: rule, isLoading, error } = useRule(ruleId);
  const deleteRuleMutation = useDeleteRule();
  const activateFlowMutation = useActivateFlow();
  const createFlowMutation = useCreateFlow();
  const updateRuleMutation = useUpdateRule();

  const activeFlow = rule?.flows.find((flow) => flow.active);

  const handleBack = () => {
    navigate('/');
  };

  const handleEditRule = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    // O modal será fechado automaticamente e os dados atualizados via React Query
  };

  const handleDeleteRule = () => {
    if (!ruleId) return;

    // TODO: Implementar confirmação
    deleteRuleMutation.mutate(ruleId, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };

  const handleActivateFlow = (flowId: string) => {
    if (!ruleId) return;

    activateFlowMutation.mutate({ ruleId, flowId });
  };

  const handleEditFlow = (flowId: string) => {
    navigate(`/editor/${flowId}`);
  };

  const handleCreateFlow = async () => {
    if (!ruleId || !rule) return;

    try {
      // Template básico para um novo fluxo
      const basicFlowContent = {
        nodes: [
          {
            id: 'input-node',
            name: 'Input',
            type: 'inputNode',
            position: { x: 100, y: 200 },
          },
          {
            id: 'output-node',
            name: 'Output',
            type: 'outputNode',
            position: { x: 400, y: 200 },
          },
        ],
        edges: [],
      };

      // Criar o fluxo
      const newFlow = await createFlowMutation.mutateAsync({
        content: basicFlowContent,
        metadata: {
          name: `${rule.name} - Novo Fluxo`,
          description: `Fluxo criado para a regra ${rule.name}`,
          tags: [rule.name],
        },
      });

      // Adicionar o fluxo à regra
      const updatedRule = {
        ...rule,
        flows: [
          ...rule.flows,
          {
            id: newFlow.id,
            name: newFlow.name,
            active: rule.flows.length === 0, // Se for o primeiro fluxo, ativar automaticamente
          },
        ],
      };

      // Atualizar a regra com o novo fluxo
      await updateRuleMutation.mutateAsync(updatedRule);

      // Navegar para o editor do novo fluxo
      navigate(`/editor/${newFlow.id}`);
    } catch (error) {
      console.error('Erro ao criar fluxo:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Spin />
        <Text>Carregando regra...</Text>
      </div>
    );
  }

  if (error || !rule) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader />
        <Alert
          message="Erro ao carregar regra"
          description={error?.message || 'Regra não encontrada'}
          type="error"
          showIcon
          action={<Button onClick={handleBack}>Voltar à lista</Button>}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white">
      <PageHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Button onClick={handleBack} className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <ArrowLeftIcon /> Regras
            </Button>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{rule.name}</Breadcrumb.Item>
        </Breadcrumb>

        {/* Header da regra */}
        <Card className="mb-6 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Title level={2} className="text-2xl font-semibold text-marine-blue mb-2">
                {rule.name}
              </Title>
              <div className="flex items-center gap-4">
                <ActiveFlowIndicator active={!!activeFlow} flowName={activeFlow?.name} />
                <Text type="secondary">
                  {rule.flows.length} fluxo{rule.flows.length !== 1 ? 's' : ''}
                </Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button className="inline-flex items-center gap-2" onClick={handleEditRule}>
                <PencilSimpleIcon />
                Editar
              </Button>
              <Button
                className="inline-flex items-center gap-2"
                variant="outline"
                onClick={handleDeleteRule}
                disabled={deleteRuleMutation.isPending}
              >
                <TrashIcon />
                Excluir
              </Button>
            </div>
          </div>

          <Text className="text-gray-600">{rule.description}</Text>
        </Card>

        {/* Lista de fluxos */}
        <Card title="Fluxos da Regra" className="p-6 bg-white rounded-lg shadow-sm">
          <div className="mb-4">
            <Button
              onClick={handleCreateFlow}
              disabled={createFlowMutation.isPending || updateRuleMutation.isPending}
              className="bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <PlusIcon />
              Novo fluxo
            </Button>
          </div>
          <FlowListByRule
            flows={rule.flows}
            onActivateFlow={handleActivateFlow}
            onEditFlow={handleEditFlow}
            loading={activateFlowMutation.isPending}
          />
        </Card>
      </div>

      {/* Modal de edição da regra */}
      <RuleEditModal
        visible={isEditModalOpen}
        rule={rule}
        onClose={handleCloseEditModal}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};
