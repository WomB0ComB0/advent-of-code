const countingSort = (arr: number[]) => {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const count = Array(max - min + 1).fill(0);
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    count[arr[i] - min]++;
  }
  for (let i = 0; i < count.length; i++) {
    while (count[i] > 0) {
      result.push(i + min);
      count[i]--;
    }
  }
  return result;
};

export { countingSort };
