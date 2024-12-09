const bubbleSort = (arr: number[]) => {
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  console.log(arr);
  return arr;
};

const bubbleSortOptimized = (arr: number[]) => {
  var i, j;
  var len = arr.length;

  var isSwapped = false;

  for (i = 0; i < len; i++) {
    isSwapped = false;

    for (j = 0; j < len; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        isSwapped = true;
      }
    }

    if (!isSwapped) break;
  }
  console.log(arr);
};

export { bubbleSort, bubbleSortOptimized };
