/**
 * Rounds given amount to nearest multiple of 0.05
 * @param {number} amount
 * @returns {number}
 */
const roundToMultipleOfFive = (amount: number): number =>
  Math.round(amount * 20) / 20;

export default roundToMultipleOfFive;
