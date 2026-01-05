# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
bun install           # Install dependencies
bun run build         # Build CLI to dist/index.js
bun run build:watch   # Build in watch mode during development
bun run lint          # Run ESLint
bun run format:check  # Check Prettier formatting
bun run typecheck     # Run TypeScript type checking
bun test              # Run all tests
bun test --watch      # Run tests in watch mode
bun test __tests__/check.test.ts  # Run a single test file
```

## Architecture

Monopeers is a CLI tool that audits monorepos for correctly hoisted peer dependencies.

**Entry point:** `src/index.ts` - Parses CLI args and dispatches to `check` or `fix` commands.

**Core workflow:**

1. `src/check.ts` - Reads workspace packages via `@manypkg/get-packages`, computes expected peer/dev deps, reports diffs
2. `src/fix.ts` - Applies corrected dependency maps and writes updates to package.json files

**Supporting modules:**

- `get-hoisted-package-peer-deps.ts` - Computes full peer dependency tree for a package
- `get-filtered-hoisted-package-peers.ts` - Filters hoisted peers based on criteria
- `get-corrected-package-peers.ts` - Generates corrected peer/dev dependency entries
- `sort-deps.ts` - Sorts dependencies alphabetically for consistent JSON output
- `write-to-file.ts` - Handles writing updated package.json files
- `logger.ts` - Centralized logging (use instead of `console.*`)
- `errors.ts` - ExitError class for CLI exit codes
- `types.ts` - TypeScript type definitions

**Test fixtures:** `__fixtures__/` contains `good-packages` and `bad-packages` monorepo layouts for testing.

## Coding Conventions

- Use named exports (no default exports except for config files)
- Keep functions small and pure; side effects only in file writes and logging
- Use `src/logger.ts` for all logging
- Add types to `src/types.ts` when creating new data structures
- Add test fixtures under `__fixtures__/` rather than ad-hoc mocks
