import { FastifyInstance } from 'fastify';
import { CloudStorageService } from '../services/cloudStorage.js';
import {
  RuleSchema,
  RuleNameParamSchema,
  RuleIdParamSchema,
  RuleNameParam,
  RuleIdParam,
  Rule,
} from '../schemas.js';

export async function ruleRoutes(
  fastify: FastifyInstance,
  storageService: CloudStorageService,
) {
  // Lista todas as regras
  fastify.get('/rules', async () => {
    return await storageService.listRules();
  });

  // Carrega uma regra específica por ID
  fastify.get<{ Params: RuleIdParam }>('/rules/:ruleId', {
    schema: {
      params: RuleIdParamSchema,
    },
  }, async (request) => {
    const { ruleId } = request.params;
    return await storageService.loadRule(ruleId);
  });

  // Carrega uma regra específica por nome (backward compatibility)
  fastify.get<{ Params: RuleNameParam }>('/rules/by-name/:ruleName', {
    schema: {
      params: RuleNameParamSchema,
    },
  }, async (request) => {
    const { ruleName } = request.params;
    // Para compatibilidade, precisamos procurar a regra pelo nome
    const rules = await storageService.listRules();
    const rule = rules.find(r => r.name === ruleName);
    if (!rule) {
      throw new Error('Regra não encontrada');
    }
    return rule;
  });

  // Salva/atualiza uma regra
  fastify.post<{ Body: Omit<Rule, 'id'> & { id?: string } }>('/rules', {
    schema: {
      body: RuleSchema,
    },
  }, async (request) => {
    const rule = request.body as Rule;
    return await storageService.saveRule(rule);
  });

  // Deleta uma regra por ID
  fastify.delete<{ Params: RuleIdParam }>('/rules/:ruleId', {
    schema: {
      params: RuleIdParamSchema,
    },
  }, async (request, reply) => {
    const { ruleId } = request.params;
    await storageService.deleteRule(ruleId);
    return reply.code(204).send();
  });

  // Deleta uma regra por nome (backward compatibility)
  fastify.delete<{ Params: RuleNameParam }>('/rules/by-name/:ruleName', {
    schema: {
      params: RuleNameParamSchema,
    },
  }, async (request, reply) => {
    const { ruleName } = request.params;
    // Para compatibilidade, precisamos procurar a regra pelo nome
    const rules = await storageService.listRules();
    const rule = rules.find(r => r.name === ruleName);
    if (!rule) {
      throw new Error('Regra não encontrada');
    }
    await storageService.deleteRule(rule.id);
    return reply.code(204).send();
  });

  // Ativa um fluxo específico em uma regra (usando ID da regra)
  fastify.put<{ Params: { ruleId: string; flowId: string } }>('/rules/:ruleId/flows/:flowId/activate', {
    schema: {
      params: {
        type: 'object',
        properties: {
          ruleId: { type: 'string', format: 'uuid' },
          flowId: { type: 'string', format: 'uuid' }
        },
        required: ['ruleId', 'flowId'],
        additionalProperties: false
      }
    },
  }, async (request, reply) => {
    const { ruleId, flowId } = request.params;
    await storageService.setActiveFlow(ruleId, flowId);
    return reply.code(204).send();
  });

  // Ativa um fluxo específico em uma regra (backward compatibility usando nome)
  fastify.put<{ Params: { ruleName: string; flowId: string } }>('/rules/by-name/:ruleName/flows/:flowId/activate', {
    schema: {
      params: {
        type: 'object',
        properties: {
          ruleName: { type: 'string', minLength: 1, maxLength: 100 },
          flowId: { type: 'string', format: 'uuid' }
        },
        required: ['ruleName', 'flowId'],
        additionalProperties: false
      }
    },
  }, async (request, reply) => {
    const { ruleName, flowId } = request.params;
    // Para compatibilidade, precisamos procurar a regra pelo nome
    const rules = await storageService.listRules();
    const rule = rules.find(r => r.name === ruleName);
    if (!rule) {
      throw new Error('Regra não encontrada');
    }
    await storageService.setActiveFlow(rule.id, flowId);
    return reply.code(204).send();
  });
}
