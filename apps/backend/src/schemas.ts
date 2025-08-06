import { z } from 'zod';

// Zod schemas para validação de runtime
export const FlowMetadataZodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()).optional(),
});

export const PartialFlowMetadataZodSchema = FlowMetadataZodSchema.partial();

export const SaveFlowZodSchema = z.object({
  content: z.any(), // DecisionGraphType é complexo, validamos apenas a presença
  metadata: PartialFlowMetadataZodSchema,
});

export const UpdateMetadataZodSchema = z.object({
  flowId: z.string().uuid(),
  metadata: PartialFlowMetadataZodSchema,
});

export const FlowIdParamZodSchema = z.object({
  id: z.string().uuid(),
});

export const SimulateZodSchema = z.object({
  context: z.record(z.any()),
  content: z.any(), // DecisionGraphType
});

// Schemas para regras
export const RuleFlowZodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  active: z.boolean(),
});

export const RuleZodSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string(),
  flows: z.array(RuleFlowZodSchema),
});

export const RuleNameParamZodSchema = z.object({
  ruleName: z.string().min(1).max(100),
});

export const RuleIdParamZodSchema = z.object({
  ruleId: z.string().uuid(),
});

export const ActivateFlowZodSchema = z.object({
  ruleId: z.string().uuid(),
  flowId: z.string().uuid(),
});

// JSON Schema para Fastify
export const FlowIdParamSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    }
  },
  required: ['id'],
  additionalProperties: false
} as const;

export const SaveFlowSchema = {
  type: 'object',
  properties: {
    content: {
      type: 'object'
    },
    metadata: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string', minLength: 1, maxLength: 100 },
        description: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        tags: { type: 'array', items: { type: 'string' } }
      },
      additionalProperties: false
    }
  },
  required: ['content', 'metadata'],
  additionalProperties: false
} as const;

export const SimulateSchema = {
  type: 'object',
  properties: {
    context: {
      type: 'object',
      additionalProperties: true
    },
    content: {
      type: 'object'
    }
  },
  required: ['context', 'content'],
  additionalProperties: false
} as const;

// JSON Schema para regras
export const RuleNameParamSchema = {
  type: 'object',
  properties: {
    ruleName: {
      type: 'string',
      minLength: 1,
      maxLength: 100
    }
  },
  required: ['ruleName'],
  additionalProperties: false
} as const;

export const RuleIdParamSchema = {
  type: 'object',
  properties: {
    ruleId: {
      type: 'string',
      format: 'uuid'
    }
  },
  required: ['ruleId'],
  additionalProperties: false
} as const;

export const RuleSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    description: { type: 'string' },
    flows: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', minLength: 1, maxLength: 100 },
          active: { type: 'boolean' }
        },
        required: ['id', 'name', 'active'],
        additionalProperties: false
      }
    }
  },
  required: ['name', 'description', 'flows'],
  additionalProperties: false
} as const;

export const ActivateFlowSchema = {
  type: 'object',
  properties: {
    ruleId: { type: 'string', format: 'uuid' },
    flowId: { type: 'string', format: 'uuid' }
  },
  required: ['ruleId', 'flowId'],
  additionalProperties: false
} as const;

// Tipos inferidos dos schemas Zod (para runtime validation se necessário)
export type FlowMetadata = z.infer<typeof FlowMetadataZodSchema>;
export type PartialFlowMetadata = z.infer<typeof PartialFlowMetadataZodSchema>;
export type SaveFlowRequest = z.infer<typeof SaveFlowZodSchema>;
export type UpdateMetadataRequest = z.infer<typeof UpdateMetadataZodSchema>;
export type FlowIdParam = z.infer<typeof FlowIdParamZodSchema>;
export type SimulateRequest = z.infer<typeof SimulateZodSchema>;
export type RuleFlow = z.infer<typeof RuleFlowZodSchema>;
export type Rule = z.infer<typeof RuleZodSchema>;
export type RuleNameParam = z.infer<typeof RuleNameParamZodSchema>;
export type RuleIdParam = z.infer<typeof RuleIdParamZodSchema>;
export type ActivateFlowRequest = z.infer<typeof ActivateFlowZodSchema>;
