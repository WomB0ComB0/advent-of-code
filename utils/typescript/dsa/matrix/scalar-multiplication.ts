/**
 * Multiplies a 3x3 matrix by a scalar value.
 *
 * @param {number[][]} matrix - The 3x3 matrix to be multiplied.
 * @param {number} scalar - The scalar value to multiply the matrix by.
 * @returns {number[][]} The resulting matrix after multiplication.
 * @throws {Error} Throws an error if the input matrix is not a valid 3x3 matrix.
 */
function matrixScalarMultiplication(matrix, scalar) {
  // Check if the input matrix is a valid 3x3 matrix
  if (!isValidMatrix(matrix)) {
    throw new Error('Invalid matrix. Please provide a valid 3x3 matrix.');
  }

  // Create a new matrix to store the result
  const result = [];

  // Multiply each element of the matrix by the scalar value
  for (let i = 0; i < matrix.length; i++) {
    const row = [];
    for (let j = 0; j < matrix[i].length; j++) {
      row.push(matrix[i][j] * scalar);
    }
    result.push(row);
  }

  return result;
}

/**
 * Checks if a matrix is a valid 3x3 matrix.
 *
 * @param {number[][]} matrix - The matrix to be checked.
 * @returns {boolean} True if the matrix is a valid 3x3 matrix, false otherwise.
 */
function isValidMatrix(matrix) {
  // Check if the matrix has 3 rows
  if (matrix.length !== 3) {
    return false;
  }

  // Check if each row has 3 columns
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].length !== 3) {
      return false;
    }
  }

  return true;
}

export { matrixScalarMultiplication, isValidMatrix };
