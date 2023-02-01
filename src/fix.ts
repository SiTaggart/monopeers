import type { Package } from '@manypkg/get-packages';
import { diff } from 'deep-object-diff';
import { getCorrectedPackagePeers } from './get-corrected-package-peers';
import type { PackageList } from './types';
import { getInternalPackages, transformManyPkgData } from './utils';
import { writeToFile } from './write-to-file';

export const getCorrectedPackages = (
  packages: Package[],
  correctedPackageDeps: PackageList
): Package[] => {
  const newPackages = packages.map((pkg) => {
    const newPkg = pkg;
    if (correctedPackageDeps[pkg.packageJson.name].dependencies) {
      newPkg.packageJson.dependencies = correctedPackageDeps[pkg.packageJson.name].dependencies;
    }
    if (correctedPackageDeps[pkg.packageJson.name].devDependencies) {
      newPkg.packageJson.devDependencies =
        correctedPackageDeps[pkg.packageJson.name].devDependencies;
    }
    if (correctedPackageDeps[pkg.packageJson.name].peerDependencies) {
      newPkg.packageJson.peerDependencies =
        correctedPackageDeps[pkg.packageJson.name].peerDependencies;
    }
    return newPkg;
  });
  return newPackages;
};

export const writeCorrectedPackageJsons = (packages: Package[]): void => {
  for (const pkg of packages) {
    writeToFile(`${pkg.dir}/package.json`, pkg.packageJson, {
      successMessage: `Successfully rewrote the package.json file for ${pkg.packageJson.name}`,
      errorMessage: `Failed to rewrite the package.json file for ${pkg.packageJson.name}`,
      formatJson: true,
    });
  }
};

export const fix = async (pathToRoot = '.'): Promise<void> => {
  const packages = await getInternalPackages(pathToRoot);
  const packageList = transformManyPkgData(packages);
  const correctedPackageList = getCorrectedPackagePeers(packageList);
  const correctedPackages = getCorrectedPackages(packages, correctedPackageList);
  const packagesWithErrors = Object.keys(diff(packageList, correctedPackageList));
  const packageJsonsThatNeedFixing = correctedPackages.filter((pkg) =>
    packagesWithErrors.includes(pkg.packageJson.name)
  );
  writeCorrectedPackageJsons(packageJsonsThatNeedFixing);
};
