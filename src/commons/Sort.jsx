const dirMap = {
  greater: { asc: 1, desc: -1 }, // greater than
  little: { asc: -1, desc: 1 }, // little than
};

const doSort = (A, B, property, direction = 'ASC') => {
  const a = A[property];
  const b = B[property];

  if (a < b) {
    return dirMap.little[direction.toLowerCase()];
  }
  if (a > b) {
    return dirMap.greater[direction.toLowerCase()];
  }
  return 0;
};

const createSorter = (...args) => (A, B) => {
  let ret = 0;

  args.some((sorter) => {
    const { property, direction = 'ASC' } = sorter;
    const value = doSort(A, B, property, direction);
    let response = true;

    if (value === 0) {
      // they are equal, continue to next sorter if any
      response = false;
    } else {
      // they are different, stop at current sorter
      ret = value;
    }
    return response;
  });
  return ret;
};

export default { createSorter };
