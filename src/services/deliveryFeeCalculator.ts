import {
  Dinero,
  dinero,
  add,
  subtract,
  lessThan,
  greaterThanOrEqual,
  toUnit
} from 'dinero.js';
import { EUR } from '@dinero.js/currencies';
import { format, getHours, isFriday } from 'date-fns';
import { convertToDinero, dineroToInteger } from '../utils/dineroParser';
import roundToMultipleOfFive from '../utils/roundToMultipleOfFive';

/**
 * Checks if given distance is greater than 1000
 * @param {number} deliveryDistance distance as an integer
 * @returns {boolean} true or false
 */
export const isOverDistanceLimit = (deliveryDistance: number): boolean =>
  deliveryDistance > 1000;

/**
 * Calculates surcharge resulting from additional distance
 * @param {number} deliveryDistance deliveryDistance distance as an integer
 * @returns {Dinero<number>} surcharge as a dinero object
 */
export const calculateDistanceSurcharge = (
  deliveryDistance: number
): Dinero<number> => {
  if (isOverDistanceLimit(deliveryDistance)) {
    const finalCharge: number = Math.ceil(deliveryDistance / 500);
    return dinero({ amount: finalCharge * 100, currency: EUR });
  }
  return dinero({ amount: 200, currency: EUR });
};

/**
 * Checks if given amount of items is greater than 4
 * @param {number} itemAmount amount of items as an integer
 * @returns {boolean} true or false
 */
export const isOverFourItems = (itemAmount: number): boolean => itemAmount > 4;

/**
 * Calculates the surcharge resulting from amount of additional items
 * @param {number} itemAmount amount of items as an integer
 * @returns {Dinero<number>} surcharge as a dinero object
 */
export const calculateItemSurcharge = (itemAmount: number): Dinero<number> => {
  if (isOverFourItems(itemAmount)) {
    return dinero({ amount: 50 * (itemAmount - 4), currency: EUR });
  }
  return dinero({ amount: 0, currency: EUR });
};

/**
 * Checks if given date falls into rush hour window.
 * @param {Date | null} deliveryTime time of delivery
 * @returns {boolean} true or false
 */
export const isRushHour = (
  deliveryDate: Date | null,
  deliveryTime: Date | null
): boolean => {
  if (deliveryDate && deliveryTime != null) {
    format(deliveryTime, 'aaa');
    const hour: number = getHours(deliveryTime);
    if (isFriday(deliveryDate)) return hour >= 15 && hour <= 18;
  }
  return false;
};
/**
 * Multiplies given dinero value with 1.1
 * @param {Dinero<number>} dineroObject dinero object to multiply
 * @returns {Dinero<number} new dinero object with updated amount
 */
export const multiplyWithRushHourMultiplier = (
  dineroObject: Dinero<number>
): Dinero<number> => {
  const parsedAmount = dineroToInteger(dineroObject);
  const multipliedAmount = parsedAmount * 1.1;
  return dinero({ amount: Math.round(multipliedAmount), currency: EUR });
};

/**
 * Checks if given dinero amount is less than 1000 (10€)
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {boolean} true or false
 */
export const isUnderMinCartValue = (cartValue: Dinero<number>): boolean =>
  lessThan(cartValue, dinero({ amount: 1000, currency: EUR }));

/**
 * Checks if given dinero amount is less than 10000 (100€)
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {boolean} true or false
 */
export const isNotOverMaxCartValue = (cartValue: Dinero<number>): boolean =>
  lessThan(cartValue, dinero({ amount: 10000, currency: EUR }));

/**
 * Calculates surcharge resulting from cart value being too low
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {Dinero<number} surcharge as a dinero object
 */
export const calculateCartValueSurcharge = (
  cartValue: Dinero<number>
): Dinero<number> => {
  if (isUnderMinCartValue(cartValue)) {
    return subtract(dinero({ amount: 1000, currency: EUR }), cartValue);
  }
  return dinero({ amount: 0, currency: EUR });
};

/**
 * Checks if given dinero value is equal to or greater than 1500 (15€)
 * @param {Dinero<number>} deliveryFee delivery fee as a dinero object
 * @returns {boolean} true or false
 */
export const isNotUnderDeliveryFeeLimit = (
  deliveryFee: Dinero<number>
): boolean =>
  greaterThanOrEqual(deliveryFee, dinero({ amount: 1500, currency: EUR }));

/**
 * Calculates the final delivery fee
 * @param {number} cartValueAsNumber cart value as a number
 * @param {number} deliveryDistance delivery distance
 * @param {number} itemAmount amount of items
 * @param {Date | null} deliveryDate date of delivery
 * @param {Date | null} deliveryTime time of delivery
 * @returns {number} final delivery fee as a float number (two decimals)
 */
export const calculateDeliveryFee = (
  cartValueAsNumber: number,
  deliveryDistance: number,
  itemAmount: number,
  deliveryDate: Date | null,
  deliveryTime: Date | null
): number => {
  // Rounding possible float number to nearest 0.05 to prevent rounding errors later on
  const roundedCartValue: number = roundToMultipleOfFive(cartValueAsNumber);
  const cartValue: Dinero<number> = convertToDinero(roundedCartValue);
  let finalFee: Dinero<number> = dinero({ amount: 0, currency: EUR });
  if (isNotOverMaxCartValue(cartValue) && cartValueAsNumber !== 0) {
    finalFee = add(finalFee, calculateCartValueSurcharge(cartValue));
    finalFee = add(finalFee, calculateDistanceSurcharge(deliveryDistance));
    finalFee = add(finalFee, calculateItemSurcharge(itemAmount));
    if (isRushHour(deliveryDate, deliveryTime)) {
      finalFee = multiplyWithRushHourMultiplier(finalFee);
    }
    if (isNotUnderDeliveryFeeLimit(finalFee)) {
      finalFee = dinero({ amount: 1500, currency: EUR });
    }
  }
  return toUnit(finalFee, { digits: 2 });
};

export default calculateDeliveryFee;
