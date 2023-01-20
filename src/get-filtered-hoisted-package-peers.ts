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
  const packageDeps = packageList[packageName].dependencies
    ? Object.keys(packageList[packageName].dependencies)
    : [];
  const packageDevDeps = packageList[packageName].devDependencies
    ? Object.keys(packageList[packageName].devDependencies)
    : [];
  const filteredHoistedPeers = Object.fromEntries(
    Object.keys(hoistedPackagePeers)
      .filter((pkg) => !packageDeps.includes(pkg) && !packageDevDeps.includes(pkg))
      .map((pkg) => [pkg, hoistedPackagePeers[pkg]])
  );
  return filteredHoistedPeers;
};
