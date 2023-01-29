import { getFilteredHoistedPackagePeers } from '../src/get-filtered-hoisted-package-peers';

describe('getFilteredHoistedPackagePeers', () => {
  it('should return a filtered object if peers are present in deps', () => {
    expect(
      getFilteredHoistedPackagePeers({
        hoistedPackagePeers: { a: '1', b: '1', c: '1' },
        packageList: {
          aaaa: {
            dependencies: {
              a: '1',
            },
          },
        },
        pkg: 'aaaa',
      })
    ).toStrictEqual({ b: '1', c: '1' });
  });

  it('should return a filtered object if peers are present in dev deps', () => {
    expect(
      getFilteredHoistedPackagePeers({
        hoistedPackagePeers: { a: '1', b: '1', c: '1' },
        packageList: {
          aaaa: {
            devDependencies: {
              a: '1',
            },
          },
        },
        pkg: 'aaaa',
      })
    ).toStrictEqual({ b: '1', c: '1' });
  });

  it('should pick out a package from a list of packages and return filtered object', () => {
    expect(
      getFilteredHoistedPackagePeers({
        hoistedPackagePeers: { a: '1', b: '1', c: '1' },
        packageList: {
          aaaa: {
            dependencies: {
              a: '1',
            },
          },
          bbbb: {
            devDependencies: {
              c: '1',
            },
          },
        },
        pkg: 'bbbb',
      })
    ).toStrictEqual({ b: '1', a: '1' });
  });

  it('should return original hoisted package peers object if there are no matching packages', () => {
    expect(
      getFilteredHoistedPackagePeers({
        hoistedPackagePeers: { a: '1', b: '1', c: '1' },
        packageList: {
          aaaa: {},
        },
        pkg: 'aaaa',
      })
    ).toStrictEqual({ a: '1', b: '1', c: '1' });
  });

  it('should filter out deps even if they appear in both dev deps and deps', () => {
    expect(
      getFilteredHoistedPackagePeers({
        hoistedPackagePeers: { a: '1', b: '1', c: '1' },
        packageList: {
          aaaa: {
            dependencies: {
              a: '1',
            },
            devDependencies: {
              b: '1',
            },
          },
        },
        pkg: 'aaaa',
      })
    ).toStrictEqual({ c: '1' });
  });
});
