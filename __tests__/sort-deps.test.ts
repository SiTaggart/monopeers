import { describe, it, expect } from 'bun:test';
import { sortDeps } from '../src/sort-deps';

describe('sortDeps', () => {
  it('should sort an object of dependencies based on object keys', () => {
    expect(
      sortDeps({
        a: '1.0.0',
        d: '1.0.0',
        g: '1.0.0',
        b: '1.0.0',
        z: '1.0.0',
        t: '1.0.0',
        '1': '1.0.0',
      })
    ).toStrictEqual({
      '1': '1.0.0',
      a: '1.0.0',
      b: '1.0.0',
      d: '1.0.0',
      g: '1.0.0',
      t: '1.0.0',
      z: '1.0.0',
    });
  });
});
