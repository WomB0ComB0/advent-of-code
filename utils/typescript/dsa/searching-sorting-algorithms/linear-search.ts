const search = (arr: number[], n: number, x: number) => {
  for (let i = 0; i < n; i++) if (arr[i] == x) return i;
  return -1;
};

export { search };
