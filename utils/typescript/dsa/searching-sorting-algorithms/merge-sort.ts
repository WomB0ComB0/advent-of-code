const merge = (left: number[], right: number[]) => {
  const arr = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) {
      arr.push(left.shift());
    } else {
      arr.push(right.shift());
    }
  }
  return [...arr, ...left, ...right];
};

const mergeSort = (arr: number[]) => {
  const half = arr.length / 2;

  if (arr.length < 2) return arr;

  const left = arr.splice(0, half);
  return merge(mergeSort(left), mergeSort(arr));
};
export { mergeSort };
