import Fastify from 'fastify';
import cors from '@fastify/cors';
import { CloudStorageService } from './services/cloudStorage.js';
import { flowRoutes } from './routes/flows.js';
import { ruleRoutes } from './routes/rules.js';
import { simulationRoutes } from './routes/simulation.js';
import dotenv from 'dotenv'

// Importa as variáveis de ambiente
dotenv.config();

// Configurações do ambiente
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Configurações do Google Cloud Storage
const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID || 'your-project-id';
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'editor-flows-bucket';
const GCS_KEY_FILENAME = process.env.GCS_KEY_FILENAME; // Opcional

async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Registra o plugin CORS
  await fastify.register(cors, {
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://your-frontend-domain.com',
    ],
    credentials: true,
  });

  // Inicializa o serviço de storage
  const storageService = new CloudStorageService(
    GCS_PROJECT_ID,
    GCS_BUCKET_NAME,
    GCS_KEY_FILENAME,
  );

  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Registra as rotas
  await fastify.register(async (fastify) => {
    await flowRoutes(fastify, storageService);
    await ruleRoutes(fastify, storageService);
  }, { prefix: '/api' });

  await fastify.register(async (fastify) => {
    await simulationRoutes(fastify);
  }, { prefix: '/api' });

  // Handler de erro global
  fastify.setErrorHandler(async (error, request, reply) => {
    fastify.log.error(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    return reply.code(statusCode).send({
      error: {
        message,
        statusCode,
        timestamp: new Date().toISOString(),
      },
    });
  });

  return fastify;
}

async function start() {
  try {
    const fastify = await buildApp();
    
    await fastify.listen({
      port: PORT,
      host: HOST,
    });

    console.log(`🚀 Backend server running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check: http://${HOST}:${PORT}/health`);
    console.log(`🔌 API base URL: http://${HOST}:${PORT}/api`);
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export { buildApp };
