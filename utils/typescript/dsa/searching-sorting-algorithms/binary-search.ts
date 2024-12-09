const binarySearchIterative = (arr: number[], val: number) => {
  let left = 0;
  let right = arr.length - 1;
  let mid = Math.floor((left + right) / 2);

  while (arr[mid] !== val && left <= right) {
    if (val < arr[mid]) right = mid - 1;
    else left = mid + 1;
    mid = Math.floor((left + right) / 2);
  }

  return arr[mid] === val ? mid : -1;
};

const binarySearchRecursive = (arr: number[], val: number, left = 0, right = arr.length - 1) => {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === val) return mid;
  if (val < arr[mid]) return binarySearchRecursive(arr, val, left, mid - 1);
  return binarySearchRecursive(arr, val, mid + 1, right);
};

export { binarySearchIterative, binarySearchRecursive };
