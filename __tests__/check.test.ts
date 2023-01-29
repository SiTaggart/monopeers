import path from 'node:path';
import { check } from '../src/check';

describe('check()', () => {
  it('should run a check and find errors', async () => {
    const foldersToCheck = path.join(__dirname, '../__fixtures__/bad-packages');
    expect(await check(foldersToCheck)).toEqual({
      hasError: true,
      missingDeps: {
        'package-a': {
          devDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
          peerDependencies: {
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
        },
        'package-b': {
          devDependencies: {
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
          peerDependencies: {
            'package-d': '1.0.0',
          },
        },
        'package-bundle': {
          devDependencies: {
            'package-g': '1.0.0',
          },
        },
        'package-c': {
          devDependencies: {
            'package-d': '1.0.0',
          },
        },
        'package-e': {
          devDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
          peerDependencies: {
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
        },
        'package-f': {
          devDependencies: {
            'package-d': '1.0.0',
          },
        },
        'package-g': {
          devDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
          peerDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
          },
        },
      },
    });
  });
  it('should run a check and find no errors', async () => {
    const foldersToCheck = path.join(__dirname, '../__fixtures__/good-packages');
    expect(await check(foldersToCheck)).toEqual({
      hasError: false,
      missingDeps: {},
    });
  });
});
