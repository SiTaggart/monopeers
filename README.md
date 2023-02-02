# Monopeers

<a href="https://www.npmjs.com/package/monopeers">![npm sheild](https://img.shields.io/npm/v/monopeers?style=for-the-badge)</a>

Monopeers is a CLI tool to ensure peer dependencies within a monorepo are correctly listed and hoisted.

## Installation

To install add the `monopeers` package to your monorepo root, where it will run from.

```bash
npm install monopeers
```

```bash
yarn add monopeers
```

```bash
pnpm add monopeers
```

## Commands

Monopeers comes with two commands, `check` and `fix`.

### Check

```bash
monopeers check
```

The check command is designed to run in CI and will help you detect issues with the way you list your peer dependencies. When `check` detect issues, it will list
the packages and missing dependencies, and throw an error to fail a build.

### Fix

```bash
monopeers fix
```

The fix command can be used to address the issues monopeers detects and automatically update the package.json files within your monorepo.

## Rational

Peer dependencies can be really useful when creating a library of independently versioned packages. It allows consumers of your library to pick and choose which packages they would like to install, without having to install the entire library. This might help consumers with upgrades of your library, allowing them to pin a specific part of the library and upgrade the rest.

Correctly listing peer dependencies for a single package within a monorepo depends on two things:

- Listing the packages you directly use in that packages code via imports or requires.
- Listing the packages that are peers to the packages you use in your code, but are not directly imported in the source.

For a monorepo author, the tricky part comes with correctly listing peer dependencies of peer dependencies, which this tool aims to help with.

### Why is this a problem?

For a consumer, peer dependencies can be inconsistent or tricky to manage depending on which package manager you use. NPM, for example, will install peer dependencies for you without them explicitly being listed as a dependency in the consuming app. NPM will even install peer dependencies of peer dependencies for you. Yarn and PNPM will not.

#### An example

Let's say we have a library of 5 packages.

Package A

```json
{
  "name": "package-a",
  "version": "1.0.0",
  "peerDependencies": {
    "package-b": "1.0.0"
  }
}
```

Package B

```json
{
  "name": "package-b",
  "version": "1.0.0",
  "peerDependencies": {
    "package-c": "1.0.0"
  }
}
```

Package C

```json
{
  "name": "package-c",
  "version": "1.0.0",
  "peerDependencies": {
    "package-d": "1.0.0",
    "package-e": "1.0.0"
  }
}
```

A depends on B, B depends on C, C depends on D and E.

As a consumer, if I install `package-a` via yarn, yarn will correctly tell me that there is an unmet peer dependency on `package-b`. I will then install `package-b`, upon which yarn will correctly inform me that there is an unmet peer dependency on `package-c`. I will then install `package-c` and yarn _again_ will tell me there is an unmet peer dependency on `package-d` and `package-e`. In a large library this can quickly get frustrating. To fix this experience the author must hoist child peer dependencies up the dependency tree. Package A should look like this:

```json
{
  "name": "package-a",
  "version": "1.0.0",
  "peerDependencies": {
    "package-b": "1.0.0",
    "package-c": "1.0.0",
    "package-d": "1.0.0",
    "package-e": "1.0.0"
  }
}
```

Package A may only use `package-b` in its source code, but to correctly install it, you need to also install the other packages that it's peer dependencies use in _their source code_. Packages C, D and E should be hoisted up the dependency tree and listed as peer dependencies of Package A.

### Why are Peers also listed as Dev Dependencies?

Along with hoisting, monopeers will list package peer dependencies as dev dependencies. When enforcing strict boundaries for packages, each package needs to "install" its dependencies local to the package in the monorepo. If it doesn't your code might not work correctly locally or might not build successfully.

If we revisit the example above, when a consuming application installs Package A, it is also required to list Package A's peer dependencies as dependencies for the consuming application. This is so that they are installed for the app to use. The same is true for a package in a monorepo. A peer dependency for a package isn't "installed" to the package. By listing the peer dependency as a dev dependency to the package, you will inform the package manager to install those locally to the package.

Crucially, this allows you to use the dependency whilst you are working locally, and not have to bundle those dependencies in your built package.
