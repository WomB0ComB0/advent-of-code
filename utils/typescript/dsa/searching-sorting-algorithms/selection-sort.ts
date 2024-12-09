const swap = (arr: number[], xp: number, yp: number) => {
  const temp = arr[xp];
  arr[xp] = arr[yp];
  arr[yp] = temp;
};

const selectionSort = (arr: number[], n: number) => {
  let i, j, min_idx;

  for (i = 0; i < n - 1; i++) {
    min_idx = i;
    for (j = i + 1; j < n; j++) {
      if (arr[j] < arr[min_idx]) min_idx = j;
    }
    swap(arr, min_idx, i);
  }
};

export { selectionSort };
