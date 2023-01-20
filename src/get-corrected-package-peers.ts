import { sortDeps } from './sort-deps';
import { getHoistedPackagePeerDeps } from './get-hoisted-package-peer-deps';
import type { PackageList } from './types';
import { getNumberOfPeersByPackage } from './utils';
import { getFilteredHoistedPackagePeers } from './get-filtered-hoisted-package-peers';

export const getCorrectedPackagePeers = (packageList: PackageList): PackageList => {
  let correctedPackageList = packageList;
  let needsCorrecting;

  do {
    needsCorrecting = false;

    for (const pkg of Object.keys(packageList)) {
      const initialNumberOfPkgPeers = getNumberOfPeersByPackage(correctedPackageList, pkg);

      const hoistedPackagePeers = getHoistedPackagePeerDeps(correctedPackageList, pkg);
      const currentCorrectedPeers = correctedPackageList[pkg].peerDependencies;

      // if the peer is already a dep, don't hoist it
      const filteredHoistedPackagePeers = getFilteredHoistedPackagePeers({
        hoistedPackagePeers,
        packageList,
        pkg,
      });

      if (
        typeof currentCorrectedPeers === 'object' &&
        (Object.keys(currentCorrectedPeers).length > 0 ||
          Object.keys(filteredHoistedPackagePeers).length > 0)
      ) {
        correctedPackageList = {
          ...correctedPackageList,
          [pkg]: {
            peerDependencies: sortDeps({
              ...currentCorrectedPeers,
              ...filteredHoistedPackagePeers,
            }),
          },
        };
      }
      const newNumberOfPkgPeers = getNumberOfPeersByPackage(correctedPackageList, pkg);

      if (initialNumberOfPkgPeers !== newNumberOfPkgPeers) {
        needsCorrecting = true;
      }
    }
  } while (needsCorrecting);
  return correctedPackageList;
};
