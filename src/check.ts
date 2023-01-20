import { diff } from 'deep-object-diff';
import * as logger from './logger';
import { getCorrectedPackagePeers } from './get-corrected-package-peers';
import { getInternalPackages, transformManyPkgData } from './utils';

export const check = async (): Promise<void> => {
  const packages = await getInternalPackages('.');
  const packageList = transformManyPkgData(packages);
  const correctedPackageList = getCorrectedPackagePeers(packageList);
  logger.info(JSON.stringify(diff(packageList, correctedPackageList), undefined, 2));
};
