# Run TypeScript in Node.js Natively with Type Stripping

A sample project demonstrating Node.js native TypeScript support with erasable types in a pnpm + Deno workspace.

## Requirements

- **Node.js**: v22.18.0 or higher
- **pnpm**: Latest version
- **Deno**: Latest version

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the Server

```bash
pnpm server
```

Server runs at `http://localhost:3000` with these endpoints:
- `GET /health` - Health check
- `GET /locations` - List available locations
- `GET /weather?location=<name>` - Get weather for location

### 3. Run the Demo Client

In a separate terminal:

```bash
pnpm demo
```

## Available Commands

### Development

- `pnpm server` - Start the weather server
- `pnpm demo` - Run the demo client application (requires)

### Testing

- `pnpm test` - Run all tests (unit + integration)
- `pnpm test:unit` - Run unit tests
- `pnpm test:integration` - Run integration tests

### Code Quality

- `pnpm check` - Type-check all TypeScript files
- `pnpm lint` - Lint code with Deno
- `pnpm lint:fix` - Lint and auto-fix issues
- `pnpm format` - Format code with Deno
- `pnpm format:check` - Check if code is formatted

## How It Works

### Node.js Native TypeScript

Node.js v22.6+ can run TypeScript files directly:

```bash
node index.ts  # Just works!
```

Types are stripped at parse time without validation. For production, run `pnpm check` in CI to validate types.

### Erasable Types

This project uses only **erasable** TypeScript syntax:

✅ **Allowed**
- Type annotations: `const x: number = 5`
- Interfaces: `interface Foo { bar: string }`
- Type aliases: `type Status = 'active' | 'inactive'`
- Generics: `function map<T>(arr: T[]): T[]`
- `import type`: `import type { Foo } from './types.ts'`

❌ **Not Allowed** (requires `--experimental-transform-types`)
- Enums: `enum Status { Active }`
- Namespaces: `namespace Utils { }`
- Parameter properties: `constructor(public name: string)`

The Deno configuration enforces erasable-only syntax via `"erasableSyntaxOnly": true`.

### pnpm + Deno Workspace

**pnpm workspace** manages Node.js packages:
- Links workspace packages for Node.js runtime
- Installs JSR packages (like `@std/assert`)

**Deno workspace** provides shared configuration:
- Enforces `erasableSyntaxOnly` across all code
- Shared lint rules and formatting
- Type-checks with Deno's fast checker

Test packages use pnpm's BYONM (Bring Your Own Node Modules) mode to access workspace dependencies.
