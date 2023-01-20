import type { PackageList } from './types';

export const getHoistedPackagePeerDeps = (
  packageList: PackageList,
  pkg: string
): Record<string, string> => {
  let combinedHoistedPeers = {};
  const { peerDependencies } = packageList[pkg];
  if (typeof peerDependencies === 'object') {
    for (const peer of Object.keys(peerDependencies)) {
      const peerDepsOfPeer =
        packageList[peer] && packageList[peer].peerDependencies
          ? packageList[peer].peerDependencies
          : {};
      combinedHoistedPeers = {
        ...combinedHoistedPeers,
        ...peerDepsOfPeer,
        ...peerDependencies,
      };
    }
  }
  return combinedHoistedPeers;
};
