import { getPackages } from '@manypkg/get-packages';
import type { Package } from '@manypkg/get-packages';
import type { PackageList } from './types';

export const transformManyPkgData = (packages: Package[]): PackageList => {
  let result = {};
  for (const pkg of packages) {
    result = {
      ...result,
      [`${pkg.packageJson.name}`]: {
        ...(pkg.packageJson.peerDependencies && {
          peerDependencies: { ...pkg.packageJson.peerDependencies },
        }),
        ...(pkg.packageJson.dependencies && { dependencies: { ...pkg.packageJson.dependencies } }),
        ...(pkg.packageJson.devDependencies && {
          devDependencies: { ...pkg.packageJson.devDependencies },
        }),
      },
    };
  }

  return result;
};

export const getInternalPackages = async (path: string): Promise<Package[]> => {
  const { packages } = await getPackages(path);
  return packages;
};

export const getNumberOfPeersByPackage = (pkgs: PackageList, pkg: string): number => {
  const { peerDependencies } = pkgs[pkg];
  return typeof peerDependencies === 'object' ? Object.keys(peerDependencies).length : 0;
};

export const getInternalPackageNames = (packages: Package[]): string[] =>
  packages.map((pkg) => pkg.packageJson.name);
