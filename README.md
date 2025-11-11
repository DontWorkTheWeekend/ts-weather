# Video 3: Run TypeScript in Node.js Natively with Type Stripping

Run TypeScript natively in Node.js 22+ with type stripping - no tsc and no tsconfig. Follow a sample project using erasable type syntax, pnpm for dependency management and Deno handling type-checking, formatting, linting, and testing.

**Watch the video:** https://youtu.be/mYbc5lGCPQ0

Part of the [Don't Work The Weekend](https://www.youtube.com/@DontWorkTheWeekend) YouTube channel.

## Key Code

- [src directory](https://github.com/DontWorkTheWeekend/ts-weather/tree/001-node-type-stripping/src/)
- [tests directory](https://github.com/DontWorkTheWeekend/ts-weather/tree/001-node-type-stripping/tests/)
- [deno.json](https://github.com/DontWorkTheWeekend/ts-weather/tree/001-node-type-stripping/deno.json)
- [package.json](https://github.com/DontWorkTheWeekend/ts-weather/tree/001-node-type-stripping/package.json)

## Topics Covered

- Running TypeScript natively in Node.js 22+ without compilation
- Type stripping at parse time
- Erasable type syntax vs. non-erasable syntax
- Using pnpm workspaces for package management
- Using Deno for type-checking, linting, and formatting
- Setting up a dual workspace (pnpm + Deno)
- Testing with Deno's testing framework

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

---

[Back to main README](https://github.com/DontWorkTheWeekend/ts-weather)
