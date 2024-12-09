const matrixTranspose = (mat: number[][]) => {
  for (let i = 0; i < mat.length; i++) {
    for (let j = 0; j < i; j++) {
      const tmp = mat[i][j];
      mat[i][j] = mat[j][i];
      mat[j][i] = tmp;
    }
  }
};

export { matrixTranspose };
