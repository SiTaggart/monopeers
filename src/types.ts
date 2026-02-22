export type PackageList = {
  [key: string]: {
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
    peerDependencies?: {
      [key: string]: string;
    };
  };
};
