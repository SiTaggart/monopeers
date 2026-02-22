import { $ } from 'bun';
import { rm } from 'node:fs/promises';

const DIST = './dist';
const ENTRY = './src/index.ts';

// Clean
await rm(DIST, { force: true, recursive: true });

// Bundle
const result = await Bun.build({
  entrypoints: [ENTRY],
  format: 'esm',
  outdir: DIST,
  packages: 'external',
  target: 'node',
});

if (!result.success) {
  for (const log of result.logs) {
    // eslint-disable-next-line no-console
    console.error(log);
  }
  process.exit(1);
}

// Type declarations
await $`tsc -p tsconfig.build.json --emitDeclarationOnly --outDir ${DIST}`;
