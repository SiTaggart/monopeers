import { getCorrectedPackagePeers } from '../src/get-corrected-package-peers';

describe('getCorrectedPackagePeers', () => {
  it('should correctly hoist peer dependencies up the tree', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': { peerDependencies: { 'package-c': '1.0.0' } },
        'package-c': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-d': { peerDependencies: {} },
        'package-e': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-f': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-g': { peerDependencies: { 'package-e': '1.0.0', 'package-f': '1.0.0' } },
      })
    ).toStrictEqual({
      'package-a': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-b': {
        peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-c': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-d': { peerDependencies: {} },
      'package-e': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-f': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-g': {
        peerDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        devDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
    });
  });
  it('should correctly handle missing peerDependencies key', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': { peerDependencies: { 'package-c': '1.0.0' } },
        'package-c': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-d': { dependencies: {} },
        'package-e': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-f': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-g': { peerDependencies: { 'package-e': '1.0.0', 'package-f': '1.0.0' } },
      })
    ).toStrictEqual({
      'package-a': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-b': {
        peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-c': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-d': { dependencies: {} },
      'package-e': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-f': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-g': {
        peerDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        devDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
    });
  });
  it('should not hoist peer dependencies up the tree if they appear as deps or dev deps', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': { peerDependencies: { 'package-c': '1.0.0' } },
        'package-c': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-d': { peerDependencies: {} },
        'package-e': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-f': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-g': { peerDependencies: { 'package-e': '1.0.0', 'package-f': '1.0.0' } },
        'package-bundle': {
          dependencies: {
            'package-a': '1.0.0',
            'package-b': '1.0.0',
            'package-c': '1.0.0',
            'package-d': '1.0.0',
            'package-e': '1.0.0',
            'package-f': '1.0.0',
          },
          peerDependencies: { 'package-g': '1.0.0' },
        },
      })
    ).toStrictEqual({
      'package-a': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-b': {
        peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-c': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-d': { peerDependencies: {} },
      'package-e': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-f': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-g': {
        peerDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        devDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
      'package-bundle': {
        dependencies: {
          'package-a': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
          'package-e': '1.0.0',
          'package-f': '1.0.0',
        },
        peerDependencies: { 'package-g': '1.0.0' },
        devDependencies: { 'package-g': '1.0.0' },
      },
    });
  });
  it('should add missing peers to devDeps as they are needed for local development', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': {
          peerDependencies: { 'package-c': '1.0.0' },
          devDependencies: { 'package-f': '1.0.0' },
        },
        'package-c': { peerDependencies: { 'package-d': '1.0.0' } },
      })
    ).toStrictEqual({
      'package-a': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-b': {
        peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0', 'package-f': '1.0.0' },
      },
      'package-c': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
    });
  });
  it('should correctly hoist peer dependencies up the tree', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': { peerDependencies: { 'package-c': '1.0.0' } },
        'package-c': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-d': { peerDependencies: {} },
        'package-e': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-f': { peerDependencies: { 'package-d': '1.0.0' } },
        'package-g': { peerDependencies: { 'package-e': '1.0.0', 'package-f': '1.0.0' } },
      })
    ).toStrictEqual({
      'package-a': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-b': {
        peerDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-c': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-d': { peerDependencies: {} },
      'package-e': {
        peerDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
        devDependencies: { 'package-b': '1.0.0', 'package-c': '1.0.0', 'package-d': '1.0.0' },
      },
      'package-f': {
        peerDependencies: { 'package-d': '1.0.0' },
        devDependencies: { 'package-d': '1.0.0' },
      },
      'package-g': {
        peerDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        devDependencies: {
          'package-e': '1.0.0',
          'package-f': '1.0.0',
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
    });
  });
  it('should handle all types of deps', () => {
    expect(
      getCorrectedPackagePeers({
        'package-a': { peerDependencies: { 'package-b': '1.0.0' } },
        'package-b': { dependencies: { foo: '1.0.0' }, peerDependencies: { 'package-c': '1.0.0' } },
        'package-c': {
          devDependencies: { bar: '1.0.2' },
          peerDependencies: { 'package-d': '1.0.0' },
        },
      })
    ).toStrictEqual({
      'package-a': {
        devDependencies: {
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        peerDependencies: {
          'package-b': '1.0.0',
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
      'package-b': {
        dependencies: {
          foo: '1.0.0',
        },
        devDependencies: {
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
        peerDependencies: {
          'package-c': '1.0.0',
          'package-d': '1.0.0',
        },
      },
      'package-c': {
        devDependencies: {
          bar: '1.0.2',
          'package-d': '1.0.0',
        },
        peerDependencies: {
          'package-d': '1.0.0',
        },
      },
    });
  });
});
