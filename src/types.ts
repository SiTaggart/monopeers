export type PackageList = {
  [key: string]: {
    peerDependencies?: {
      [key: string]: string;
    };
    dependencies?: {
      [key: string]: string;
    };
    devDependencies?: {
      [key: string]: string;
    };
  };
};
