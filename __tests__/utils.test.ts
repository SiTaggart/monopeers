import { describe, expect, it } from 'bun:test';
import path from 'node:path';
import type { Packages } from '@manypkg/get-packages';
import { transformManyPkgData, getInternalPackageNames, getInternalPackages } from '../src/utils';
import mockPackagesData from '../__fixtures__/internal-packages.json';

describe('utils', () => {
  describe('getInternalPackages', () => {
    it('should return only an array of internal packages', async () => {
      const foldersToCheck = path.join(__dirname, '../__fixtures__/bad-packages');
      const packages = await getInternalPackages(foldersToCheck);
      expect(packages).toStrictEqual([
        {
          dir: `${foldersToCheck}/packages/package-a`,
          packageJson: { name: 'package-a', peerDependencies: { 'package-b': '1.0.0' } },
        },
        {
          dir: `${foldersToCheck}/packages/package-b`,
          packageJson: { name: 'package-b', peerDependencies: { 'package-c': '1.0.0' } },
        },
        {
          dir: `${foldersToCheck}/packages/package-bundle`,
          packageJson: {
            dependencies: {
              'package-a': '1.0.0',
              'package-b': '1.0.0',
              'package-c': '1.0.0',
              'package-d': '1.0.0',
              'package-e': '1.0.0',
              'package-f': '1.0.0',
            },
            name: 'package-bundle',
            peerDependencies: {
              'package-g': '1.0.0',
            },
          },
        },
        {
          dir: `${foldersToCheck}/packages/package-c`,
          packageJson: { name: 'package-c', peerDependencies: { 'package-d': '1.0.0' } },
        },
        {
          dir: `${foldersToCheck}/packages/package-d`,
          packageJson: { name: 'package-d' },
        },
        {
          dir: `${foldersToCheck}/packages/package-e`,
          packageJson: { name: 'package-e', peerDependencies: { 'package-b': '1.0.0' } },
        },
        {
          dir: `${foldersToCheck}/packages/package-f`,
          packageJson: { name: 'package-f', peerDependencies: { 'package-d': '1.0.0' } },
        },
        {
          dir: `${foldersToCheck}/packages/package-g`,
          packageJson: {
            name: 'package-g',
            peerDependencies: { 'package-e': '1.0.0', 'package-f': '1.0.0' },
          },
        },
      ]);
    });
  });

  describe('getInternalPackageNames', () => {
    it('should return an array of package names', () => {
      const { packages } = mockPackagesData as Packages;
      expect(getInternalPackageNames(packages)).toStrictEqual([
        'package-a',
        'package-b',
        'package-bundle',
        'package-c',
        'package-d',
        'package-e',
        'package-f',
        'package-g',
      ]);
    });
  });

  describe('transformManyPkgData', () => {
    it('should transform the raw data into an objected', () => {
      const { packages } = mockPackagesData as Packages;
      const transformedPackages = transformManyPkgData(packages);
      expect(transformedPackages).toStrictEqual({
        'package-a': {
          peerDependencies: { 'package-b': '1.0.0' },
        },
        'package-b': {
          peerDependencies: { 'package-c': '1.0.0' },
        },
        'package-bundle': {
          dependencies: {
            'package-a': '1.0.0',
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
          peerDependencies: {
            'package-g': '1.0.0',
          },
        },
        'package-c': {
          peerDependencies: { 'package-d': '1.0.0' },
        },
        'package-d': {},
        'package-e': {
          peerDependencies: { 'package-b': '1.0.0' },
        },
        'package-f': {
          devDependencies: { 'package-a': '1.0.0' },
          peerDependencies: { 'package-d': '1.0.0' },
        },
        'package-g': {
          peerDependencies: {
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
        },
      });
    });
  });
});
