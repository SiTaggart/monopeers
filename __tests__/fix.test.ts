import { describe, expect, it } from 'bun:test';
import type { Packages } from '@manypkg/get-packages';
import mockPackagesData from '../__fixtures__/internal-packages.json';
import { getCorrectedPackages } from '../src/fix';
import { transformManyPkgData } from '../src/utils';
import { getCorrectedPackagePeers } from '../src/get-corrected-package-peers';

describe('getCorrectedPackages()', () => {
  it('should run a check and find errors', async () => {
    const { packages } = mockPackagesData as Packages;

    const packageList = transformManyPkgData(packages);
    const correctedPackageList = getCorrectedPackagePeers(packageList);
    expect(getCorrectedPackages(packages, correctedPackageList)).toEqual([
      {
        dir: '/packages/package-a',
        packageJson: {
          devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
          name: 'package-a',
          peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-b',
        packageJson: {
          devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
          name: 'package-b',
          peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-bundle',
        packageJson: {
          dependencies: {
            'package-a': '1.0.0',
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
          devDependencies: { 'package-g': '1.0.0' },
          name: 'package-bundle',
          peerDependencies: { 'package-g': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-c',
        packageJson: {
          devDependencies: { 'package-d': '1.0.0' },
          name: 'package-c',
          peerDependencies: { 'package-d': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-d',
        packageJson: { name: 'package-d' },
      },
      {
        dir: '/packages/package-e',
        packageJson: {
          devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
          name: 'package-e',
          peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-f',
        packageJson: {
          devDependencies: { 'package-d': '1.0.0', 'package-a': '1.0.0' },
          name: 'package-f',
          peerDependencies: { 'package-d': '1.0.0' },
        },
      },
      {
        dir: '/packages/package-g',
        packageJson: {
          devDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
          name: 'package-g',
          peerDependencies: {
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
        },
      },
    ]);
  });
});
