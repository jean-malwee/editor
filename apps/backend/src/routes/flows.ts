import { FastifyInstance } from 'fastify';
import { CloudStorageService } from '../services/cloudStorage.js';
import {
  SaveFlowSchema,
  FlowIdParamSchema,
  SaveFlowRequest,
  UpdateMetadataRequest,
  FlowIdParam,
} from '../schemas.js';

export async function flowRoutes(
  fastify: FastifyInstance,
  storageService: CloudStorageService,
) {
  // Lista todos os fluxos
  fastify.get('/flows', async () => {
    return await storageService.listFlows();
  });

  // Carrega um fluxo específico
  fastify.get<{ Params: FlowIdParam }>('/flows/:id', {
    schema: {
      params: FlowIdParamSchema,
    },
  }, async (request) => {
    const { id } = request.params;
    return await storageService.loadFlow(id);
  });

  // Salva um novo fluxo ou atualiza existente
  fastify.post<{ Body: SaveFlowRequest }>('/flows', {
    schema: {
      body: SaveFlowSchema,
    },
  }, async (request) => {
    const { content, metadata } = request.body;
    return await storageService.saveFlow(content, metadata);
  });

  // Atualiza metadados de um fluxo
  fastify.put<{ Params: FlowIdParam; Body: Partial<UpdateMetadataRequest['metadata']> }>('/flows/:id/metadata', {
    schema: {
      params: FlowIdParamSchema,
    },
  }, async (request) => {
    const { id } = request.params;
    const metadata = request.body;
    return await storageService.updateFlowMetadata(id, metadata);
  });

  // Deleta um fluxo
  fastify.delete<{ Params: FlowIdParam }>('/flows/:id', {
    schema: {
      params: FlowIdParamSchema,
    },
  }, async (request, reply) => {
    const { id } = request.params;
    await storageService.deleteFlow(id);
    return reply.code(204).send();
  });
}
