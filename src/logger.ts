import chalk from 'chalk';
import util from 'node:util';

export const format = (
  args: Array<unknown>,
  messageType: 'error' | 'success' | 'info',
  scope?: string
): string => {
  const prefix = {
    error: chalk.red('error'),
    info: chalk.cyan('info'),
    success: chalk.green('success'),
  }[messageType];
  const fullPrefix = ` ${prefix}${scope === undefined ? '' : ` ${scope}`}`;
  return (
    fullPrefix +
    util
      .format('', ...args)
      .split('\n')
      .join(`\n ${fullPrefix} `)
  );
};
export const error = (message: string, scope?: string): void => {
  // eslint-disable-next-line no-console
  console.error(format([message], 'error', scope));
};

export const success = (message: string, scope?: string): void => {
  // eslint-disable-next-line no-console
  console.log(format([message], 'success', scope));
};

export const info = (message: string, scope?: string): void => {
  // eslint-disable-next-line no-console
  console.log(format([message], 'info', scope));
};
