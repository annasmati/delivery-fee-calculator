const sliceDecimals = (num: number, fixed: number): number => {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || -1}})?`);
  return parseInt(num.toString().match(re)![0], 10);
};

export default sliceDecimals;
