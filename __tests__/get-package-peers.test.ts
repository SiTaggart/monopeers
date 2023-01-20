import { getPackagePeers } from '../src/get-package-peers';

describe('getPackagePeers', () => {
  it('should return current packages and their peers in the desired format', () => {
    expect(getPackagePeers()).toStrictEqual({});
  });
});
