#!/usr/bin/env node
import { error, info } from './logger';
import { ExitError } from './errors';
import { check } from './check';
import { fix } from './fix';

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args[0] === 'check') {
    info('checking internal packages for missing peer dependencies');
    const { hasError, missingDeps } = await check();

    if (hasError) {
      error(
        'check found these missing dependencies in your internal package.json files',
        JSON.stringify(missingDeps, undefined, 2)
      );
      throw new ExitError(1);
    }
  }

  if (args[0] === 'fix') {
    info('running the fix');
    await fix();
  }

  if (args[0] !== 'fix' && args[0] !== 'check') {
    error(`command ${args[0]} not found, only check, and fix are available options`);
    throw new ExitError(1);
  }

  info('running');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((caughtError) => {
  if (caughtError instanceof ExitError) {
    process.exit(caughtError.code);
  } else {
    error(String(caughtError));
    process.exit(1);
  }
});
