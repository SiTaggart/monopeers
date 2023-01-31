import { writeFile } from 'node:fs';
import * as logger from './logger';

export const writeToFile = (
  filePath: string,
  content: string | object | Array<unknown>,
  {
    successMessage,
    errorMessage,
    formatJson = false,
  }: { successMessage?: string; errorMessage?: string; formatJson?: boolean }
): void => {
  const output: string | NodeJS.ArrayBufferView = formatJson
    ? JSON.stringify(content, undefined, 2)
    : (content as NodeJS.ArrayBufferView);

  writeFile(filePath, output, 'utf8', (error) => {
    if (error) {
      if (errorMessage !== undefined) {
        logger.error(errorMessage);
      }
      console.error(error);
    }
    if (successMessage !== undefined && error === null) {
      logger.success(successMessage);
    }
  });
};
