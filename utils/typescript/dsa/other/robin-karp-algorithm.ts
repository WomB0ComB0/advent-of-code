const robinKarpAlgorithm = (pat: string, txt: string, q: number) => {
  const d = 256;
  const M = pat.length;
  const N = txt.length;
  let i, j;
  let p = 0;
  let t = 0;
  let h = 1;

  for (i = 0; i < M - 1; i++) {
    h = (h * d) % q;
  }

  for (i = 0; i < M; i++) {
    p = (d * p + pat.charCodeAt(i)) % q;
    t = (d * t + txt.charCodeAt(i)) % q;
  }

  for (i = 0; i <= N - M; i++) {
    if (p === t) {
      for (j = 0; j < M; j++) {
        if (txt[i + j] !== pat[j]) {
          break;
        }
      }
      if (j === M) {
        console.log(`Pattern found at index ${i}`);
      }
    }
    if (i < N - M) {
      t = (d * (t - txt.charCodeAt(i) * h) + txt.charCodeAt(i + M)) % q;
      if (t < 0) {
        t = t + q;
      }
    }
  }
};

export { robinKarpAlgorithm };
