#!/usr/bin/env node
import * as logger from './logger';
import { ExitError } from './errors';
import { check } from './check';

try {
  const args = process.argv.slice(2);

  if (args[0] === 'fix') {
    logger.info('running the fix');
  }

  if (args[0] === 'check') {
    logger.info('running the check');
    check();
  }

  if (args[0] !== 'fix' && args[0] !== 'check') {
    logger.error(`command ${args[0]} not found, only check, and fix are available options`);
    throw new ExitError(1);
  }
  logger.info('running');
} catch (error) {
  if (error instanceof ExitError) {
    process.exit(error.code);
  } else if (typeof error === 'string') {
    logger.error(error);
    process.exit(1);
  }
}
