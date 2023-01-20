export const sortDeps = (peerList: Record<string, string>): Record<string, string> => {
  let sortedPeers = {};
  for (const peer of Object.keys(peerList).sort()) {
    sortedPeers = {
      ...sortedPeers,
      [`${peer}`]: peerList[peer],
    };
  }
  return sortedPeers;
};
