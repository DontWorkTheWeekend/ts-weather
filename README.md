# ts-weather

Monorepo containing Typescript-only packages deployed with `pnpm deploy`

## Prerequisite Operation

Install Dependencies

```bash
pnpm install
```

```bash
pnpm run server
```

## Run from Monorepo

```bash
# ✅ node
node utils/client-demo.ts

# ✅ deno
deno run --no-config --node-modules-dir=manual -A utils/client-demo.ts

# ✅ bun
bun utils/client-demo.ts
```

## Create a Standalone Package

```bash
rm -rf out
pnpm --filter @ts-weather/utils --legacy deploy ./out
```

## Run from Standalone Package

```bash
# ❌ node
node out/client-demo.ts
# Error [ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING]: Stripping types is currently unsupported for files under node_modules

# ❌ deno
deno run --no-config --node-modules-dir=manual -A out/client-demo.ts
# Error [ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING]: Stripping types is currently unsupported for files under node_modules

# ✅ bun
bun out/client-demo.ts
```

### Versions Tested

- `node`: 22.21.1
- `deno`: 2.5.6
- `bun`: 1.3.1
