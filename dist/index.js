#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/logger.ts
var import_chalk = __toESM(require("chalk"));
var import_node_util = __toESM(require("util"));
var format = (args, messageType, scope) => {
  const prefix = {
    error: import_chalk.default.red("error"),
    success: import_chalk.default.green("success"),
    info: import_chalk.default.cyan("info")
  }[messageType];
  const fullPrefix = ` ${prefix}${scope === void 0 ? "" : ` ${scope}`}`;
  return fullPrefix + import_node_util.default.format("", ...args).split("\n").join(`
 ${fullPrefix} `);
};
var error = (message, scope) => {
  console.error(format([message], "error", scope));
};
var info = (message, scope) => {
  console.log(format([message], "info", scope));
};

// src/errors.ts
var ExitError = class extends Error {
  code;
  constructor(code) {
    super(`The process should exit with code ${code}`);
    this.code = code;
  }
};

// src/check.ts
var import_deep_object_diff = require("deep-object-diff");

// src/sort-deps.ts
var sortDeps = (peerList) => {
  let sortedPeers = {};
  for (const peer of Object.keys(peerList).sort()) {
    sortedPeers = {
      ...sortedPeers,
      [`${peer}`]: peerList[peer]
    };
  }
  return sortedPeers;
};

// src/get-hoisted-package-peer-deps.ts
var getHoistedPackagePeerDeps = (packageList, pkg) => {
  let combinedHoistedPeers = {};
  const { peerDependencies } = packageList[pkg];
  if (typeof peerDependencies === "object") {
    for (const peer of Object.keys(peerDependencies)) {
      const peerDepsOfPeer = packageList[peer] && packageList[peer].peerDependencies ? packageList[peer].peerDependencies : {};
      combinedHoistedPeers = {
        ...combinedHoistedPeers,
        ...peerDepsOfPeer,
        ...peerDependencies
      };
    }
  }
  return combinedHoistedPeers;
};

// src/utils.ts
var import_get_packages = require("@manypkg/get-packages");
var transformManyPkgData = (packages) => {
  let result = {};
  for (const pkg of packages) {
    result = {
      ...result,
      [`${pkg.packageJson.name}`]: {
        ...pkg.packageJson.peerDependencies && {
          peerDependencies: { ...pkg.packageJson.peerDependencies }
        },
        ...pkg.packageJson.dependencies && { dependencies: { ...pkg.packageJson.dependencies } },
        ...pkg.packageJson.devDependencies && {
          devDependencies: { ...pkg.packageJson.devDependencies }
        }
      }
    };
  }
  return result;
};
var getInternalPackages = async (path) => {
  const { packages } = await (0, import_get_packages.getPackages)(path);
  return packages;
};
var getNumberOfPeersByPackage = (pkgs, pkg) => {
  const { peerDependencies } = pkgs[pkg];
  return typeof peerDependencies === "object" ? Object.keys(peerDependencies).length : 0;
};

// src/get-corrected-package-peers.ts
var getCorrectedPackagePeers = (packageList) => {
  let correctedPackageList = packageList;
  let needsCorrecting;
  let hoistedPackagePeers;
  do {
    needsCorrecting = false;
    for (const pkg of Object.keys(packageList)) {
      const initialNumberOfPkgPeers = getNumberOfPeersByPackage(correctedPackageList, pkg);
      hoistedPackagePeers = getHoistedPackagePeerDeps(correctedPackageList, pkg);
      const currentCorrectedPeers = correctedPackageList[pkg].peerDependencies;
      if (typeof currentCorrectedPeers === "object" && (Object.keys(currentCorrectedPeers).length > 0 || Object.keys(hoistedPackagePeers).length > 0)) {
        correctedPackageList = {
          ...correctedPackageList,
          [pkg]: {
            peerDependencies: sortDeps({
              ...currentCorrectedPeers,
              ...hoistedPackagePeers
            })
          }
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

// src/check.ts
var check = async () => {
  const packages = await getInternalPackages(".");
  const packageList = transformManyPkgData(packages);
  const correctedPackageList = getCorrectedPackagePeers(packageList);
  info(JSON.stringify((0, import_deep_object_diff.diff)(packageList, correctedPackageList), void 0, 2));
};

// src/index.ts
try {
  const args = process.argv.slice(2);
  if (args[0] === "fix") {
    info("running the fix");
  }
  if (args[0] === "check") {
    info("running the check");
    check();
  }
  if (args[0] !== "fix" && args[0] !== "check") {
    error(`command ${args[0]} not found, only check, and fix are available options`);
    throw new ExitError(1);
  }
  info("running");
} catch (error2) {
  if (error2 instanceof ExitError) {
    process.exit(error2.code);
  } else if (typeof error2 === "string") {
    error(error2);
    process.exit(1);
  }
}
//# sourceMappingURL=index.js.map