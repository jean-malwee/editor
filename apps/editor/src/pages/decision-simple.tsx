import React, { useEffect, useRef, useState } from 'react';
import { ButtonBase as Button, toast } from '@mlw-packages/react-components';
import { Lightbulb, PlayCircle } from '@phosphor-icons/react';
import { decisionTemplates } from '../assets/decision-templates';
import { displayError } from '../helpers/error-message';
import { DecisionContent, DecisionEdge, DecisionNode, DocumentFileTypes } from '@repo/schemas';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { DecisionGraph, DecisionGraphRef, DecisionGraphType, GraphSimulator, Simulation } from '@gorules/jdm-editor';
import { PageHeader } from '../components/page-header';
import { DirectedGraph } from 'graphology';
import { hasCycle } from 'graphology-dag';
import { Stack } from '../components/stack';
import { match, P } from 'ts-pattern';
import { FlowManagerModal } from '../components/flow-manager-modal';
import { StorageStatusIndicator } from '../components/storage-status-indicator';
import { FlowMetadata } from '../services/flowStorage';
import { useFlow, useUpdateFlow, useSimulateFlow } from '../hooks/useFlows';
import { ThemePreference, useTheme } from '../context/theme.provider';

const supportFSApi = Object.hasOwn(window, 'showSaveFilePicker');

// Local component replacements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Title = ({ level, children, ...props }: { level?: number; children: React.ReactNode; [key: string]: any }) => {
  const Tag = `h${level || 1}` as keyof JSX.IntrinsicElements;
  return React.createElement(
    Tag,
    { style: { margin: 0, fontSize: level === 5 ? '14px' : undefined }, ...props },
    children,
  );
};

const Typography = { Title };

const Divider = ({ style }: { style?: React.CSSProperties }) => (
  <div style={{ borderBottom: '1px solid #e0e0e0', margin: '8px 0', ...style }} />
);

const Modal = {
  confirm: ({
    title,
    content,
    onOk,
    onCancel,
  }: {
    title: string;
    content: string;
    onOk?: () => void;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
  }) => {
    if (window.confirm(`${title}\n\n${content}`)) {
      onOk?.();
    } else {
      onCancel?.();
    }
  },
};

const Dropdown = ({
  menu,
  children,
}: {
  menu: {
    items: Array<{ key: string; label: string; onClick?: () => void }>;
    onClick?: (item: { key: string }) => void;
  };
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) => {
  const handleClick = () => {
    const menuElement = document.createElement('div');
    menuElement.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      min-width: 120px;
    `;

    menu.items.forEach((item) => {
      const button = document.createElement('button');
      button.textContent = item.label;
      button.style.cssText = `
        width: 100%;
        padding: 8px 12px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
      `;
      button.onmouseenter = () => (button.style.background = '#f0f0f0');
      button.onmouseleave = () => (button.style.background = 'none');
      button.onclick = () => {
        item.onClick?.();
        menu.onClick?.({ key: item.key });
        document.body.removeChild(menuElement);
      };
      menuElement.appendChild(button);
    });

    document.body.appendChild(menuElement);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rect = (children as any)?.props?.children?.props?.getBoundingClientRect?.() || { left: 100, top: 100 };
    menuElement.style.left = `${rect.left}px`;
    menuElement.style.top = `${rect.bottom + 5}px`;

    const closeDropdown = () => {
      if (document.body.contains(menuElement)) {
        document.body.removeChild(menuElement);
      }
      document.removeEventListener('click', closeDropdown);
    };

    setTimeout(() => document.addEventListener('click', closeDropdown), 100);
  };

  return React.cloneElement(children as React.ReactElement, { onClick: handleClick });
};

export const DecisionSimplePage: React.FC = () => {
  const fileInput = useRef<HTMLInputElement>(null);
  const graphRef = React.useRef<DecisionGraphRef>(null);
  const { setThemePreference } = useTheme();
  const navigate = useNavigate();
  const { flowId } = useParams<{ flowId?: string }>();

  // React Query hooks
  const { data: flowData, error: flowError } = useFlow(flowId);
  const updateFlowMutation = useUpdateFlow();
  const simulateFlowMutation = useSimulateFlow();

  const [searchParams] = useSearchParams();
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle>();
  const [graph, setGraph] = useState<DecisionGraphType>({ nodes: [], edges: [] });
  const [fileName, setFileName] = useState('Untitled Decision');
  const [graphTrace, setGraphTrace] = useState<Simulation>();
  const [flowManagerVisible, setFlowManagerVisible] = useState(false);
  const [currentFlowMetadata, setCurrentFlowMetadata] = useState<Partial<FlowMetadata>>();

  useEffect(() => {
    const templateParam = searchParams.get('template');

    if (flowId && flowData) {
      // Load flow data from React Query
      setGraph(flowData.content);
      setFileName(flowData.metadata.name);
      setCurrentFlowMetadata(flowData.metadata);
    } else if (templateParam) {
      loadTemplateGraph(templateParam);
    }
  }, [flowId, flowData, searchParams]);

  // Handle flow loading errors
  useEffect(() => {
    if (flowError) {
      toast.error('Erro ao carregar fluxo');
      displayError(flowError);
      navigate('/');
    }
  }, [flowError, navigate]);

  const loadTemplateGraph = (template: string) => {
    const templateGraph = match(template)
      .with(P.string, (template) => decisionTemplates?.[template])
      .otherwise(() => undefined);

    if (templateGraph) {
      setGraph(templateGraph);
    }
  };

  const openFile = async () => {
    if (!supportFSApi) {
      fileInput.current?.click?.();
      return;
    }

    try {
      const [handle] = await window.showOpenFilePicker({
        types: [{ accept: { 'application/json': ['.json'] } }],
      });

      setFileHandle(handle);

      const file = await handle.getFile();
      const content = await file.text();
      setFileName(file?.name);
      const parsed = JSON.parse(content);
      setGraph({
        nodes: parsed?.nodes || [],
        edges: parsed?.edges || [],
      });
    } catch (err) {
      displayError(err);
    }
  };

  const saveFileAs = async () => {
    if (!supportFSApi) {
      return await handleDownload();
    }

    let writable: FileSystemWritableFileStream | undefined = undefined;
    try {
      checkCyclic();
      const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
      const newFileName = `${fileName.replaceAll('.json', '')}.json`;
      const handle = await window.showSaveFilePicker({
        types: [{ description: newFileName, accept: { 'application/json': ['.json'] } }],
      });

      writable = await handle.createWritable();
      await writable.write(json);
      setFileHandle(handle);
      const file = await handle.getFile();
      setFileName(file.name);
      toast.success('File saved');
    } catch (e) {
      displayError(e);
    } finally {
      writable?.close?.();
    }
  };

  const saveFile = async () => {
    try {
      checkCyclic();

      // Use React Query mutation to save flow
      const savedFlow = await updateFlowMutation.mutateAsync({
        flowId: currentFlowMetadata?.id || '',
        content: graph,
        metadata: {
          id: currentFlowMetadata?.id,
          name: fileName,
          description: `Fluxo de decisão criado em ${new Date().toLocaleDateString()}`,
          createdAt: currentFlowMetadata?.createdAt,
          tags: ['decisão', 'fluxo'],
        },
      });

      setCurrentFlowMetadata(savedFlow);
      // Success message is handled by the mutation

      // Mantém a funcionalidade original se o supportFSApi estiver disponível
      if (supportFSApi && fileHandle) {
        let writable: FileSystemWritableFileStream | undefined = undefined;
        try {
          writable = await fileHandle.createWritable();
          const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
          await writable.write(json);
          toast.success('Arquivo também salvo localmente');
        } catch (e) {
          displayError(e);
        } finally {
          writable?.close?.();
        }
      }
    } catch (e) {
      displayError(e);
    }
  };

  const handleNew = async () => {
    Modal.confirm({
      title: 'Warning',
      content: 'Are you sure you want to create new blank decision, your current work might be lost?',
      onOk: () => {
        setGraph({ nodes: [], edges: [] });
        setFileName('Untitled Decision');
        setFileHandle(undefined);
        setCurrentFlowMetadata(undefined);
      },
    });
  };

  const handleOpenMenu = async (e: { key: string }) => {
    switch (e.key) {
      case 'file-system':
        openFile();
        break;
      case 'flow-manager':
        openFlowManager();
        break;
      default: {
        if (Object.hasOwn(decisionTemplates, e.key)) {
          Modal.confirm({
            title: 'Open example',
            content: 'Are you sure you want to open example decision, your current work might be lost?',
            onOk: async () => loadTemplateGraph(e.key),
          });
        }
        break;
      }
    }
  };

  const checkCyclic = (dc: DecisionContent | undefined = undefined) => {
    const decisionContent = match(dc)
      .with(P.nullish, () => graph)
      .otherwise((data) => data);

    const diGraph = new DirectedGraph();
    (decisionContent?.edges || []).forEach((edge) => {
      diGraph.mergeEdge(edge.sourceId, edge.targetId);
    });

    if (hasCycle(diGraph)) {
      throw new Error('Circular dependencies detected');
    }
  };

  const handleLoadFlow = (flowId: string) => {
    // This function should be implemented to load flow by ID
    // For now, just a placeholder since we need to match the interface
    console.log('Loading flow:', flowId);
  };

  const openFlowManager = () => {
    setFlowManagerVisible(true);
  };

  const handleDownload = async () => {
    try {
      checkCyclic();
      // create file in browser
      const newFileName = `${fileName.replaceAll('.json', '')}.json`;
      const json = JSON.stringify({ contentType: DocumentFileTypes.Decision, ...graph }, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      // create "a" HTLM element with href to file
      const link = window.document.createElement('a');
      link.href = href;
      link.download = newFileName;
      window.document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      window.document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (e) {
      displayError(e);
    }
  };

  const handleUploadInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event?.target?.files as FileList;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e?.target?.result as string);
        if (parsed?.contentType !== DocumentFileTypes.Decision) {
          throw new Error('Invalid content type');
        }

        const nodes: DecisionNode[] = parsed.nodes || [];
        const nodeIds = nodes.map((node) => node.id);
        const edges: DecisionEdge[] = ((parsed.edges || []) as DecisionEdge[]).filter(
          (edge) => nodeIds.includes(edge?.targetId) && nodeIds.includes(edge?.sourceId),
        );

        checkCyclic({ edges, nodes });
        setGraph({ edges, nodes });
        setFileName(fileList?.[0]?.name || 'Untitled Decision');
      } catch (e) {
        displayError(e);
      }
    };

    reader.readAsText(Array.from(fileList)?.[0] || new File([], ''), 'UTF-8');
  };

  return (
    <>
      <input
        hidden
        accept="application/json"
        type="file"
        ref={fileInput}
        onChange={handleUploadInput}
        onClick={(event) => {
          if ('value' in event.target) {
            event.target.value = null;
          }
        }}
      />
      <div className="flex h-screen flex-col bg-off-white">
        <PageHeader
          onBack={() => navigate('/')}
          style={{
            padding: '8px',
            background: 'white',
            borderBottom: '1px solid #e5e7eb',
          }}
          title={
            <div className="flex gap-2 items-center">
              <Button target="_blank" href="https://gorules.io" className="bg-transparent border-none p-1">
                <img height={24} width={24} src={'/favicon.svg'} />
              </Button>
              <Divider style={{ margin: 0, width: '1px', height: '20px', transform: 'rotate(90deg)' }} />
              <div className="flex flex-col">
                <Typography.Title
                  level={4}
                  className="m-0 font-normal pl-2 transition-colors duration-200 rounded-md cursor-text hover:bg-black hover:bg-opacity-10"
                  editable={{
                    text: fileName,
                    maxLength: 24,
                    autoSize: { maxRows: 1 },
                    onChange: (value: string) => setFileName(value.trim()),
                    triggerType: ['text'],
                  }}
                >
                  {fileName}
                </Typography.Title>
                <Stack horizontal verticalAlign="center" gap={8}>
                  <Button onClick={handleNew} size={'sm'} className="bg-transparent border-none">
                    New
                  </Button>
                  <Dropdown
                    menu={{
                      onClick: handleOpenMenu,
                      items: [
                        {
                          label: 'Arquivo local',
                          key: 'file-system',
                        },
                        {
                          label: 'Gerenciador de Fluxos',
                          key: 'flow-manager',
                        },
                        {
                          label: '---',
                          key: 'divider-1',
                        },
                        {
                          label: 'Fintech: Company analysis',
                          key: 'company-analysis',
                        },
                        {
                          label: 'Fintech: AML',
                          key: 'aml',
                        },
                        {
                          label: 'Retail: Shipping fees',
                          key: 'shipping-fees',
                        },
                      ],
                    }}
                  >
                    <Button size={'sm'} className="bg-transparent border-none">
                      Open
                    </Button>
                  </Dropdown>
                  {supportFSApi && (
                    <Button onClick={saveFile} size={'sm'} className="bg-transparent border-none">
                      Save
                    </Button>
                  )}
                  <Button onClick={saveFileAs} size={'sm'} className="bg-transparent border-none">
                    Save as
                  </Button>
                </Stack>
              </div>
            </div>
          }
          ghost={false}
          extra={[
            <StorageStatusIndicator key="storage-status" />,
            <Dropdown
              key="theme-dropdown"
              overlayStyle={{ minWidth: 150 }}
              menu={{
                onClick: ({ key }) => setThemePreference(key as ThemePreference),
                items: [
                  {
                    label: 'Automatic',
                    key: ThemePreference.Automatic,
                  },
                  {
                    label: 'Dark',
                    key: ThemePreference.Dark,
                  },
                  {
                    label: 'Light',
                    key: ThemePreference.Light,
                  },
                ],
              }}
            >
              <Button className="bg-transparent border-none">
                <Lightbulb size={20} />
              </Button>
            </Dropdown>,
          ]}
        />
        <div className="flex-1 overflow-y-auto flex gap-2">
          <div className="flex-1 overflow-y-auto">
            <DecisionGraph
              ref={graphRef}
              value={graph}
              onChange={(value) => setGraph(value)}
              reactFlowProOptions={{ hideAttribution: true }}
              simulate={graphTrace}
              panels={[
                {
                  id: 'simulator',
                  title: 'Simulator',
                  icon: <PlayCircle size={16} />,
                  renderPanel: () => (
                    <GraphSimulator
                      onClear={() => setGraphTrace(undefined)}
                      onRun={async ({ graph, context }) => {
                        try {
                          const data = await simulateFlowMutation.mutateAsync({
                            context: context as Record<string, unknown>,
                            content: graph,
                          });

                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setGraphTrace({ result: data as any });
                        } catch (e) {
                          const errorMessage = match(e)
                            .with(
                              {
                                response: {
                                  data: {
                                    type: P.string,
                                    source: P.string,
                                  },
                                },
                              },
                              ({ response: { data: d } }) => `${d.type}: ${d.source}`,
                            )
                            .with({ response: { data: { source: P.string } } }, (d) => d.response.data.source)
                            .with({ response: { data: { message: P.string } } }, (d) => d.response.data.message)
                            .with({ message: P.string }, (d) => d.message)
                            .otherwise(() => 'Unknown error occurred');

                          toast.error(errorMessage);

                          // Handle error response for trace display
                          if (e && typeof e === 'object' && 'response' in e) {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const errorResponse = e.response as any;
                            setGraphTrace({
                              result: {
                                result: null,
                                trace: errorResponse?.data?.trace,
                                snapshot: graph,
                                performance: '',
                              },
                              error: {
                                message: errorResponse?.data?.source,
                                data: errorResponse?.data,
                              },
                            });
                          }
                        }
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      <FlowManagerModal
        visible={flowManagerVisible}
        onClose={() => setFlowManagerVisible(false)}
        onLoadFlow={handleLoadFlow}
        currentFlow={flowId}
      />
    </>
  );
};
