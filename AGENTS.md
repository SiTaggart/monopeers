# Agent Guide for Monopeers

This repository contains the **monopeers** CLI that audits monorepos for correctly hoisted peer dependencies and can optionally fix package manifests.

## Tech stack

- Node.js CLI written in TypeScript.
- Build: `tsup` outputs `dist/index.js` (see `tsup.config.ts`).
- Package manager: **pnpm** (enforced via `preinstall`).
- Testing: Jest with SWC (`__tests__/**/*.test.ts`).
- Linting/formatting: ESLint + Prettier via shared `@sitaggart/*` configs.

## Project structure and behavior

- Entry point: `src/index.ts` dispatches `check` and `fix` commands and exits with `ExitError` codes on failure.
- Core workflow:
  - `check` (see `src/check.ts`) reads workspace packages with `@manypkg/get-packages`, computes expected peer/dev deps via helpers, and reports diffs.
  - `fix` (see `src/fix.ts`) applies the corrected dependency maps and writes updates through `write-to-file` utilities.
- Supporting modules handle dependency sorting (`sort-deps`), peer hoisting (`get-hoisted-package-peer-deps` and filters), and logging (`src/logger.ts`).
- Tests live in `__tests__` with realistic fixtures under `__fixtures__` to emulate monorepo layouts.

## Coding conventions

- Prefer named exports; current modules avoid default exports.
- Keep functions small and pure; most helpers transform data without side effects except for file writes and logging.
- Maintain TypeScript types in `src/types.ts`; extend them when adding new data shapes.
- Logging is centralized in `src/logger.ts`—use it instead of `console.*` directly.
- Avoid adding new runtime dependencies unless necessary; reuse existing utilities for package graph traversal and diffing.

## Usage

- Install dependencies with `pnpm install` (other managers are blocked).
- Build the CLI: `pnpm build` or `pnpm build:watch` during development.
- Run checks in CI: `pnpm lint` and `pnpm test`.
- Invoke the tool from a monorepo root:
  - `pnpm monopeers check` to fail on missing/incorrect peer dependencies.
  - `pnpm monopeers fix` to apply hoisted peer/dev dependency updates to `package.json` files.

## Contribution tips

- Keep new logic covered with Jest; prefer adding targeted fixtures under `__fixtures__` rather than ad-hoc mocks.
- When touching dependency calculation, update both `check` and `fix` paths so results stay consistent.
- Preserve JSON ordering using the existing `sort-deps` utilities to minimize churn in manifest files.
- Include any new scripts or config in the root `package.json` and ensure builds still succeed with `tsup`.
