import type { PackageList } from './types';

type GetFilteredHoistedPackagePeersArgs = {
  hoistedPackagePeers: Record<string, string>;
  packageList: PackageList;
  pkg: string;
};

export const getFilteredHoistedPackagePeers = ({
  hoistedPackagePeers,
  packageList,
  pkg: packageName,
}: GetFilteredHoistedPackagePeersArgs): Record<string, string> => {
  const { dependencies, devDependencies } = packageList[packageName];
  const packageDeps = dependencies ? Object.keys(dependencies) : [];
  const packageDevDeps = devDependencies ? Object.keys(devDependencies) : [];
  const filteredHoistedPeers = Object.fromEntries(
    Object.keys(hoistedPackagePeers)
      .filter((pkg) => !packageDeps.includes(pkg) && !packageDevDeps.includes(pkg))
      .map((pkg) => [pkg, hoistedPackagePeers[pkg]])
  );
  return filteredHoistedPeers;
};
