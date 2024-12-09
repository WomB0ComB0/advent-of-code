const matrixAddition = (A: number[][], B: number[][], C: number[][], N: number) => {
  let i, j;
  for (i = 0; i < N; i++) for (j = 0; j < N; j++) C[i][j] = A[i][j] + B[i][j];
};

export { matrixAddition };
