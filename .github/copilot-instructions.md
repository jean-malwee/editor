# JDM Editor - Repository Instructions for GitHub Copilot

## Project Overview

This is a JDM (JSON Decision Model) Editor monorepo that provides a complete solution for creating, editing, and simulating decision rules. The project enables users to visually design decision flows with a modern web interface and execute them using high-performance engines.

**Key Features:**
- Visual decision flow editor with drag-and-drop interface  
- Real-time simulation and testing capabilities
- Google Cloud Storage integration for flow persistence
- Multi-language execution engines (Rust + WebAssembly/Node.js)
- Modern React frontend with Ant Design components
- High-performance dual backend architecture

## Repository Structure

```
├── apps/
│   ├── editor/                    # React frontend application (Vite + TypeScript)
│   │   ├── backend/               # Rust backend for high-performance simulation
│   │   └── src/                   # React application source
│   └── backend/                   # Node.js/Fastify API server  
├── packages/
│   └── schemas/                   # Shared TypeScript types and schemas
├── configs/
│   ├── eslint-config/             # Shared ESLint configuration
│   ├── prettier-config/           # Shared Prettier configuration  
│   └── typescript-config/         # Shared TypeScript configuration
└── scripts/                       # Development and build utility scripts
```

## Technology Stack

### Frontend (`apps/editor/`)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with hot module replacement
- **UI Library:** MLW React Components for UI elements
- **Icons:** Phosphor Icons for React
- **Code Editor:** React ACE editor with syntax highlighting  
- **Routing:** React Router 7.x for client-side navigation
- **State Management:** React Context API for theme management
- **Decision Engine:** @gorules/jdm-editor for visual flow editing
- **WebAssembly:** @gorules/zen-engine-wasm for client-side rule execution
- **HTTP Client:** Axios for API communication
- **Type Safety:** TypeScript with strict mode

### Rust Backend (`apps/editor/backend/`)
- **Framework:** Axum web framework
- **Runtime:** Tokio async runtime  
- **Decision Engine:** zen-engine crate for high-performance rule execution
- **Serialization:** Serde for JSON handling
- **CORS:** tower-http for cross-origin requests
- **Static Files:** Serves frontend assets in production

### Node.js Backend (`apps/backend/`)  
- **Framework:** Fastify for high-performance HTTP server
- **Runtime:** Node.js with TypeScript
- **Build Tool:** tsup for efficient bundling
- **Storage:** Google Cloud Storage for flow persistence
- **Validation:** Zod for request/response validation
- **CORS:** @fastify/cors for cross-origin requests

### Shared Packages
- **schemas:** Common TypeScript interfaces and Zod validation schemas
- **eslint-config:** Shared ESLint rules and configurations
- **prettier-config:** Code formatting standards
- **typescript-config:** TypeScript compiler configurations

### Development Tools
- **Monorepo:** Turbo for build orchestration and caching
- **Package Manager:** pnpm with workspaces
- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier for consistent code style  
- **Type Checking:** TypeScript strict mode enabled

## Coding Standards and Conventions

### General Guidelines
- Use TypeScript strict mode for all new code
- Prefer functional components over class components in React
- Use arrow functions for callbacks and event handlers
- Follow ESLint and Prettier configurations strictly
- Write descriptive commit messages following conventional commits

### Naming Conventions
- **Files:** Use kebab-case for file names (e.g., `decision-simple.tsx`)
- **Components:** Use PascalCase for React components (e.g., `DecisionSimplePage`)
- **Variables/Functions:** Use camelCase (e.g., `handleFlowSave`)
- **Constants:** Use UPPER_SNAKE_CASE (e.g., `RUST_BACKEND_URL`)
- **Types/Interfaces:** Use PascalCase with descriptive names

### Code Organization  
- Group related functionality in feature-based directories
- Keep components small and focused on single responsibility
- Extract reusable logic into custom hooks or utility functions
- Use absolute imports when appropriate
- Separate business logic from UI components

### API Development
- Use Zod schemas for request/response validation
- Follow RESTful conventions for endpoint design
- Include proper error handling with meaningful messages
- Use TypeScript interfaces from shared schemas package
- Implement proper CORS configuration for frontend integration

## Architecture

### Dual Backend Architecture
The project uses a unique dual backend approach:

1. **Rust Backend (Port 3000):** High-performance simulation engine
   - Handles decision execution with zen-engine
   - Optimized for computational workloads
   - Serves static frontend assets

2. **Node.js Backend (Port 3001):** API and storage services  
   - Google Cloud Storage integration
   - Flow and rule management APIs
   - Proxies simulation requests to Rust backend

### Frontend Integration
- Main application runs on Vite dev server (Port 5173) in development
- Uses WebAssembly for client-side simulation
- Can also delegate to backend for server-side simulation
- File system integration for local file operations

## Environment Configuration

### Development Setup
- Node.js 18+ required for all applications
- Rust toolchain required for Rust backend
- pnpm 9.x as the primary package manager
- Use `pnpm dev` to start all applications in development mode

### Port Configuration
- Frontend (Vite): http://localhost:5173
- Rust Backend: http://localhost:3000  
- Node.js Backend: http://localhost:3001

### Google Cloud Storage Configuration (Optional)
```env
# Node.js Backend (.env in apps/backend/)
GCS_PROJECT_ID=your-project-id
GCS_BUCKET_NAME=editor-flows-bucket
GCS_KEY_FILENAME=path/to/service-account-key.json
PORT=3001

# Rust Backend Configuration
RUST_BACKEND_URL=http://localhost:3000
```

### Build and Deployment
- Use Turbo for coordinated builds across packages
- Schemas package must be built before other applications  
- Frontend builds to static files served by Rust backend
- Both backends can be containerized independently

## Development Workflow

### Starting Development
1. Run `./scripts/dev-setup.sh` for initial setup
2. Use `pnpm dev` to start all applications
3. Use `pnpm dev:rust` to include Rust backend compilation
4. Access frontend at http://localhost:5173

### Making Changes
- Always run type checking with `pnpm type-check` before committing
- Use `pnpm lint` to check for code style issues
- Format code with `pnpm format` before submitting PRs
- Build schemas first if modifying shared types: `pnpm build:schemas`

### Testing Features
- Test decision flow creation and editing in the visual editor
- Verify simulation works both client-side (WebAssembly) and server-side (Rust/Node.js)
- Test file operations (save/load) with File System Access API fallback
- Verify theme switching and responsive design

## Key Dependencies and Versions

### Critical Dependencies
- `@gorules/jdm-editor`: ^1.41.0 - Core decision flow editor component
- `@gorules/zen-engine-wasm`: ^0.18.0 - WebAssembly rules engine
- `zen-engine`: 0.45.0 - Rust rules engine crate
- `fastify`: ^4.26.0 - Node.js HTTP server framework
- `axum`: 0.7 - Rust web framework
- `react`: ^18.3.1 - Frontend framework
- `@mlw-packages/react-components`: ^1.4.1 - UI component library
- `@phosphor-icons/react`: ^2.1.10 - Icon library for React
- `@tanstack/react-query`: ^5.84.1 - Data fetching and caching library

### Build Tools
- `turbo`: ^2.5.5 - Monorepo build orchestration
- `vite`: Latest - Frontend build tool with WebAssembly support
- `typescript`: 5.8.3 - Type checking and compilation
- `tsup`: ^8.0.0 - Node.js backend bundling

## Special Considerations

### Performance
- Frontend uses Vite for fast development and optimized production builds
- Rust backend provides near-native performance for decision execution
- WebAssembly enables high-performance client-side simulation
- Turbo caching reduces build times in development

### Integration Points
- Shared TypeScript types ensure type safety across frontends/backends
- Rust backend serves as primary simulation engine
- Node.js backend handles storage and API orchestration
- WebAssembly provides offline simulation capabilities

### Security & Storage
- Environment variables used for sensitive configuration
- CORS properly configured for known origins
- Google Cloud Storage for persistent flow storage (optional)
- Local storage fallback for offline usage
- File System Access API for modern browser file operations
