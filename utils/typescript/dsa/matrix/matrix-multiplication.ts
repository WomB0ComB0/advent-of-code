const matrixMultiply = (mat1: number[][], mat2: number[][], res: number[][], N: number) => {
  let i, j, k;
  for (i = 0; i < N; i++) {
    for (j = 0; j < N; j++) {
      res[i][j] = 0;
      for (k = 0; k < N; k++) res[i][j] += mat1[i][k] * mat2[k][j];
    }
  }
};

export { matrixMultiply };
