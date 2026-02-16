import { $ } from 'bun';
import { rm } from 'node:fs/promises';

const DIST = './dist';
const ENTRY = './src/index.ts';

// Clean
await rm(DIST, { recursive: true, force: true });

// Bundle
const result = await Bun.build({
  entrypoints: [ENTRY],
  outdir: DIST,
  format: 'cjs',
  target: 'node',
  packages: 'external',
});

if (!result.success) {
  for (const log of result.logs) {
    console.error(log);
  }
  process.exit(1);
}

// Type declarations
await $`tsc -p tsconfig.build.json --emitDeclarationOnly --outDir ${DIST}`;
