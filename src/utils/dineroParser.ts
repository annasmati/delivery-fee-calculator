import { Dinero, dinero, DineroSnapshot, toSnapshot } from 'dinero.js';
import { EUR } from '@dinero.js/currencies';

/**
 * Returns a new dinero object with the given integer as its amount value
 *
 * Does not convert amount into dinero scale
 * @param {number} amount
 * @returns {Dinero<number>}
 */
export const integerToDinero = (amount: number): Dinero<number> =>
  dinero({ amount, currency: EUR });

/**
 * Returns an integer equal to give dinero object`s amount value
 *
 * Does not convert dinero into euro scale
 * @param {Dinero<number>} dineroObject
 * @returns {number}
 */
export const dineroToInteger = (dineroObject: Dinero<number>): number => {
  const parsedObject: DineroSnapshot<number> = toSnapshot(dineroObject);
  return parsedObject.amount;
};

/**
 * Returns a new dinero object with the given integer as its amount value
 *
 * Converts amount into dinero scale (10 => 1000)
 * @param {number} amount
 * @returns {Dinero<number>}
 */
export const convertToDinero = (amount: number): Dinero<number> =>
  dinero({ amount: Math.round(amount * 100), currency: EUR });
