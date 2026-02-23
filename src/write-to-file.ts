import { writeFile } from 'node:fs';
import { error as logError, success as logSuccess } from './logger';

export const writeToFile = (
  filePath: string,
  content: string | object | Array<unknown>,
  {
    errorMessage,
    formatJson = false,
    successMessage,
  }: { errorMessage?: string; formatJson?: boolean; successMessage?: string }
): void => {
  const output: string | NodeJS.ArrayBufferView = formatJson
    ? JSON.stringify(content, undefined, 2)
    : (content as NodeJS.ArrayBufferView);

  writeFile(filePath, output, 'utf8', (error) => {
    if (error) {
      if (errorMessage !== undefined) {
        logError(errorMessage);
      }
      // eslint-disable-next-line no-console
      console.error(error);
    }
    if (successMessage !== undefined && error === null) {
      logSuccess(successMessage);
    }
  });
};
