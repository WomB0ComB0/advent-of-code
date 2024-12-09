const insertionSort = (arr: number[], n: number) => {
  let i, key, j;

  for (i = 1; i < n; i++) {
    key = arr[i];
    j = i - 1;

    /* Move elements of arr[0..i-1], that are
        greater than key, to one position ahead
        of their current position */
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
      console.log(arr);
    }
    arr[j + 1] = key;
  }
};

const printArray = (arr: number[], n: number) => {
  let i;
  for (i = 0; i < n; i++) console.log(arr[i] + ' ');
  console.log();
};

export { insertionSort, printArray };
