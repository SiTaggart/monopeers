#!/usr/bin/env node
import * as logger from './logger';
import { ExitError } from './errors';
import { check } from './check';
import { fix } from './fix';

(async () => {
  const args = process.argv.slice(2);

  if (args[0] === 'check') {
    logger.info('checking internal packages for missing peer dependencies');
    const { hasError, missingDeps } = await check();

    if (hasError) {
      logger.error(
        'check found these missing dependencies in your internal package.json files',
        JSON.stringify(missingDeps, undefined, 2)
      );
      throw new ExitError(1);
    }
  }

  if (args[0] === 'fix') {
    logger.info('running the fix');
    await fix();
  }

  if (args[0] !== 'fix' && args[0] !== 'check') {
    logger.error(`command ${args[0]} not found, only check, and fix are available options`);
    throw new ExitError(1);
  }

  logger.info('running');
})().catch((error) => {
  if (error instanceof ExitError) {
    process.exit(error.code);
  } else {
    logger.error(error);
    process.exit(1);
  }
});
