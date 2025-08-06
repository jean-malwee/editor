# JDM Editor Backend

Backend API for JDM Editor with Google Cloud Storage integration.

## Features

- RESTful API for flow management
- Google Cloud Storage integration
- Flow simulation endpoint
- Input validation with Zod
- Built with Fastify for high performance

## API Endpoints

### Flows
- `GET /api/flows` - List all flows
- `GET /api/flows/:id` - Get specific flow
- `POST /api/flows` - Save/update flow
- `PUT /api/flows/:id/metadata` - Update flow metadata
- `DELETE /api/flows/:id` - Delete flow

### Simulation
- `POST /api/simulate` - Simulate flow execution

### Health Check
- `GET /health` - Server health status

## Environment Variables

- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: 0.0.0.0)
- `GCS_PROJECT_ID` - Google Cloud Project ID
- `GCS_BUCKET_NAME` - Google Cloud Storage bucket name
- `GCS_KEY_FILENAME` - Path to service account key file (optional)
- `LOG_LEVEL` - Logging level (default: info)

## Development

```bash
# Install dependencies
pnpm install

# Start in development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```
