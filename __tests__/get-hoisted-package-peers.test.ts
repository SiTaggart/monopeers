import { getHoistedPackagePeerDeps } from '../src/get-hoisted-package-peer-deps';

describe('getHoistedPackagePeerDeps', () => {
  it('should successfully hoist child peers to the parent deps', () => {
    expect(
      getHoistedPackagePeerDeps(
        {
          a: {
            peerDependencies: {
              b: '1.0',
              d: '1.0',
              external: '1',
            },
          },
          b: {
            peerDependencies: {
              c: '1.0',
              d: '1.0',
            },
          },
          c: {
            peerDependencies: {
              f: '1.0',
            },
          },
          d: {
            peerDependencies: {
              g: '1.0',
            },
          },
        },
        'a'
      )
    ).toStrictEqual({ b: '1.0', c: '1.0', d: '1.0', g: '1.0', external: '1' });
    expect(
      getHoistedPackagePeerDeps(
        {
          a: {
            peerDependencies: {
              b: '1.0',
            },
          },
          b: {
            peerDependencies: {
              c: '1.0',
              d: '1.0',
            },
          },
        },
        'a'
      )
    ).toStrictEqual({ b: '1.0', c: '1.0', d: '1.0' });
  });
  it('should handle no peers', () => {
    expect(
      getHoistedPackagePeerDeps(
        {
          a: {
            dependencies: {
              b: '1.0',
            },
          },
          b: {
            dependencies: {
              c: '1.0',
              d: '1.0',
            },
          },
          c: {
            dependencies: {
              f: '1.0',
            },
          },
          d: {
            dependencies: {
              g: '1.0',
            },
          },
        },
        'a'
      )
    ).toStrictEqual({});
  });
  it('should handle mixed dependencies', () => {
    expect(
      getHoistedPackagePeerDeps(
        {
          a: {
            peerDependencies: {
              b: '1.0',
            },
          },
          b: {
            dependencies: {
              c: '1.0',
              d: '1.0',
            },
          },
          c: {},
          d: {
            devDependencies: {
              g: '1.0',
            },
          },
        },
        'a'
      )
    ).toStrictEqual({ b: '1.0' });
  });
});
