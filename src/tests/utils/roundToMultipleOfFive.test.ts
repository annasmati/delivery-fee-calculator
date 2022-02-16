import roundToMultipleOfFive from '../../utils/roundToMultipleOfFive';

test('Should round given amount to nearest multiple of five (0.05)', () => {
  expect(roundToMultipleOfFive(0.0000007)).toBe(0);
  expect(roundToMultipleOfFive(0.009)).toBe(0);
  expect(roundToMultipleOfFive(0.01)).toBe(0);
  expect(roundToMultipleOfFive(0.03)).toBe(0.05);
  expect(roundToMultipleOfFive(0.76)).toBe(0.75);
  expect(roundToMultipleOfFive(5)).toBe(5);
  expect(roundToMultipleOfFive(20.27)).toBe(20.25);
  expect(roundToMultipleOfFive(20.28)).toBe(20.3);
  expect(roundToMultipleOfFive(10000.0001)).toBe(10000);
  expect(roundToMultipleOfFive(10007)).toBe(10007);
});
