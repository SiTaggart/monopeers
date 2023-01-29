import { diff } from 'deep-object-diff';
import { getCorrectedPackagePeers } from './get-corrected-package-peers';
import type { PackageList } from './types';
import { getInternalPackages, transformManyPkgData } from './utils';

export type CheckObject = {
  hasError: boolean;
  missingDeps: Partial<PackageList>;
};

export const check = async (pathToRoot = '.'): Promise<CheckObject> => {
  const packages = await getInternalPackages(pathToRoot);
  const packageList = transformManyPkgData(packages);
  const correctedPackageList = getCorrectedPackagePeers(packageList);
  const errorsInPeers = diff(packageList, correctedPackageList) as Partial<PackageList>;
  return {
    hasError: Object.keys(errorsInPeers).length > 0,
    missingDeps: errorsInPeers,
  };
};
