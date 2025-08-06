import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  DialogBase,
  DialogHeaderBase,
  DialogTitleBase,
  DialogContentBase,
  DialogFooterBase,
  ButtonBase,
  SidebarMenuBadgeBase,
  TooltipProviderBase,
  toast,
} from '@mlw-packages/react-components';
import { ArrowDown, PencilSimple, Trash, MagnifyingGlass, FloppyDisk } from '@phosphor-icons/react';

interface FlowMetadata {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface FlowManagerModalProps {
  visible: boolean;
  onClose: () => void;
  onLoadFlow: (flowId: string) => void;
  currentFlow?: string;
}

interface FormData {
  name: string;
  description: string;
  tags: string;
}

export const FlowManagerModal: React.FC<FlowManagerModalProps> = ({ visible, onClose, onLoadFlow, currentFlow }) => {
  const [flows, setFlows] = useState<FlowMetadata[]>([]);
  const [searchText, setSearchText] = useState('');
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', description: '', tags: '' });
  const [editFormData, setEditFormData] = useState<FormData>({ name: '', description: '', tags: '' });

  useEffect(() => {
    if (visible) {
      loadFlows();
    }
  }, [visible]);

  const loadFlows = async () => {
    try {
      // Mock data para demonstração
      const mockFlows: FlowMetadata[] = [
        {
          id: '1',
          name: 'Fluxo de Exemplo 1',
          description: 'Descrição do fluxo 1',
          tags: ['exemplo', 'teste'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Fluxo de Exemplo 2',
          description: 'Descrição do fluxo 2',
          tags: ['exemplo'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setFlows(mockFlows);
    } catch (error) {
      console.error('Erro ao carregar fluxos:', error);
    }
  };

  const handleSaveFlow = async () => {
    try {
      // Implementar salvamento
      toast.success('Fluxo salvo com sucesso!');
      setSaveModalVisible(false);
      setFormData({ name: '', description: '', tags: '' });
      await loadFlows();
    } catch (error) {
      console.error('Erro ao salvar fluxo:', error);
      toast.error('Erro ao salvar fluxo');
    }
  };

  const handleEditFlow = async () => {
    try {
      // Implementar edição
      toast.success('Fluxo atualizado com sucesso!');
      setEditModalVisible(false);
      setEditFormData({ name: '', description: '', tags: '' });
      await loadFlows();
    } catch (error) {
      console.error('Erro ao editar fluxo:', error);
      toast.error('Erro ao editar fluxo');
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    try {
      console.log('Fluxo excluído:', flowId);
      toast.success('Fluxo excluído com sucesso!');
      await loadFlows();
    } catch (error) {
      console.error('Erro ao excluir fluxo:', error);
      toast.error('Erro ao excluir fluxo');
    }
  };

  const handleLoadFlow = (flowId: string) => {
    onLoadFlow(flowId);
    onClose();
  };

  const openEditModal = (flow: FlowMetadata) => {
    setEditFormData({
      name: flow.name,
      description: flow.description || '',
      tags: flow.tags?.join(', ') || '',
    });
    setEditModalVisible(true);
  };

  const filteredFlows = flows.filter(
    (flow) =>
      flow.name.toLowerCase().includes(searchText.toLowerCase()) ||
      flow.description?.toLowerCase().includes(searchText.toLowerCase()) ||
      flow.tags?.some((tag) => tag.toLowerCase().includes(searchText.toLowerCase())),
  );

  if (!visible) return null;

  return (
    <TooltipProviderBase>
      <DialogBase open={visible} onOpenChange={(open) => !open && onClose()}>
        <DialogContentBase className="max-w-4xl">
          <DialogHeaderBase>
            <DialogTitleBase>Gerenciar Fluxos</DialogTitleBase>
          </DialogHeaderBase>

          <div className="space-y-4">
            {/* Ações */}
            <div className="flex gap-2">
              <ButtonBase onClick={() => setSaveModalVisible(true)} className="flex items-center gap-2">
                <FloppyDisk size={16} />
                Salvar Fluxo Atual
              </ButtonBase>
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlass
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Buscar fluxos..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Lista de Fluxos */}
            <div className="max-h-96 overflow-y-auto">
              {filteredFlows.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Nenhum fluxo encontrado</div>
              ) : (
                <div className="space-y-3">
                  {filteredFlows.map((flow) => (
                    <div
                      key={flow.id}
                      className={`border rounded-lg p-4 ${
                        currentFlow === flow.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{flow.name}</h3>
                            {currentFlow === flow.id && (
                              <SidebarMenuBadgeBase className="bg-blue-100 text-blue-800">Atual</SidebarMenuBadgeBase>
                            )}
                          </div>

                          {flow.description && <p className="text-sm text-gray-600 mb-2">{flow.description}</p>}

                          {flow.tags && flow.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {flow.tags.map((tag, index) => (
                                <SidebarMenuBadgeBase key={index} className="bg-gray-100 text-gray-800">
                                  {tag}
                                </SidebarMenuBadgeBase>
                              ))}
                            </div>
                          )}

                          <div className="text-xs text-gray-500">
                            Atualizado: {dayjs(flow.updatedAt).format('DD/MM/YYYY HH:mm')} | Criado:{' '}
                            {dayjs(flow.createdAt).format('DD/MM/YYYY HH:mm')}
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <ButtonBase
                            size="sm"
                            onClick={() => handleLoadFlow(flow.id)}
                            className="flex items-center gap-1"
                          >
                            <ArrowDown size={14} />
                            Carregar
                          </ButtonBase>
                          <ButtonBase size="sm" variant="ghost" onClick={() => openEditModal(flow)}>
                            <PencilSimple size={14} />
                          </ButtonBase>
                          <ButtonBase
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteFlow(flow.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash size={14} />
                          </ButtonBase>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooterBase>
            <ButtonBase variant="ghost" onClick={onClose}>
              Fechar
            </ButtonBase>
          </DialogFooterBase>
        </DialogContentBase>
      </DialogBase>

      {/* Modal de Salvar */}
      {saveModalVisible && (
        <DialogBase open={saveModalVisible} onOpenChange={(open) => !open && setSaveModalVisible(false)}>
          <DialogContentBase>
            <DialogHeaderBase>
              <DialogTitleBase>Salvar Fluxo Atual</DialogTitleBase>
            </DialogHeaderBase>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do fluxo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do fluxo"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tags separadas por vírgula"
                />
              </div>
            </div>

            <DialogFooterBase>
              <div className="flex gap-2">
                <ButtonBase
                  variant="ghost"
                  onClick={() => {
                    setSaveModalVisible(false);
                    setFormData({ name: '', description: '', tags: '' });
                  }}
                >
                  Cancelar
                </ButtonBase>
                <ButtonBase onClick={handleSaveFlow} disabled={!formData.name.trim()}>
                  Salvar
                </ButtonBase>
              </div>
            </DialogFooterBase>
          </DialogContentBase>
        </DialogBase>
      )}

      {/* Modal de Editar */}
      {editModalVisible && (
        <DialogBase open={editModalVisible} onOpenChange={(open) => !open && setEditModalVisible(false)}>
          <DialogContentBase>
            <DialogHeaderBase>
              <DialogTitleBase>Editar Fluxo</DialogTitleBase>
            </DialogHeaderBase>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nome do fluxo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição do fluxo"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tags separadas por vírgula"
                />
              </div>
            </div>

            <DialogFooterBase>
              <div className="flex gap-2">
                <ButtonBase
                  variant="ghost"
                  onClick={() => {
                    setEditModalVisible(false);
                    setEditFormData({ name: '', description: '', tags: '' });
                  }}
                >
                  Cancelar
                </ButtonBase>
                <ButtonBase onClick={handleEditFlow} disabled={!editFormData.name.trim()}>
                  Salvar Alterações
                </ButtonBase>
              </div>
            </DialogFooterBase>
          </DialogContentBase>
        </DialogBase>
      )}
    </TooltipProviderBase>
  );
};
