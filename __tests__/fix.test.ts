import path from 'node:path';
import { fix } from '../src/fix';

describe('fix()', () => {
  it('should run a check and find errors', async () => {
    const foldersToCheck = path.join(__dirname, '../__fixtures__/bad-packages');
    expect(await fix(foldersToCheck)).toEqual(1);
  });
});
