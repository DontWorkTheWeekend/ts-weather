# Video 4: TypeScript in node_models doesn't always work

TypeScript in node_modules can be useful in private monorepos and works in Bun, but it's not working in NodeJS and Deno - those return `Error [ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING]: Stripping types is currently unsupported for files under node_modules`

**Watch the video:** https://youtu.be/hisgPClQeIg

Part of the [Don't Work The Weekend](https://www.youtube.com/@DontWorkTheWeekend) YouTube channel.

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

---

[Back to main README](https://github.com/DontWorkTheWeekend/ts-weather)
