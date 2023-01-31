export const sortDeps = (depList: Record<string, string>): Record<string, string> => {
  let sortedDeps = {};
  for (const dep of Object.keys(depList).sort()) {
    sortedDeps = {
      ...sortedDeps,
      [`${dep}`]: depList[dep],
    };
  }
  return sortedDeps;
};
