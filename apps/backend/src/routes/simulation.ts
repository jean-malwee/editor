import { FastifyInstance } from 'fastify';
import { SimulateSchema, SimulateRequest } from '../schemas.js';
import axios, { AxiosError } from 'axios';

const RUST_BACKEND_URL = process.env.RUST_BACKEND_URL || 'http://localhost:3000';

export async function simulationRoutes(fastify: FastifyInstance) {
  // Simula a execução de um fluxo de decisão usando o backend Rust
  fastify.post<{ Body: SimulateRequest }>('/simulate', {
    schema: {
      body: SimulateSchema,
    },
  }, async (request, reply) => {
    const { context, content } = request.body;

    try {
      // Chama o backend Rust para simulação
      const response = await axios.post(`${RUST_BACKEND_URL}/api/simulate`, {
        context,
        content,
      }, {
        timeout: 30000, // 30 segundos timeout
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        result: response.data,
      };
    } catch (error) {
      fastify.log.error('Error calling Rust backend:', error);
      
      if (error instanceof AxiosError) {
        const status = error.response?.status || 500;
        const message = error.response?.data || error.message;
        
        return reply.code(status).send({
          error: {
            message: `Simulation failed: ${message}`,
            statusCode: status,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return reply.code(500).send({
        error: {
          message: 'Internal server error during simulation',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
      });
    }
  });
}
