import { Dinero, dinero, add, subtract, lessThan, greaterThanOrEqual, toUnit } from 'dinero.js';
import { EUR } from '@dinero.js/currencies';
import moment, { Moment } from 'moment';
import { convertToDinero, dineroToInteger } from '../utils/dineroParser';
import roundToMultipleOfFive from '../utils/roundToMultipleOfFive';
import {
  additionalDistanceDivisor,
  additionalDistanceSurcharge,
  additionalItemSurcharge,
  maxCartValue,
  maxDeliveryFee,
  minCartValue,
  minCartValueSurcharge,
  minDeliveryDistance,
  minDistanceSurcharge,
  minItemAmount,
  minItemSurcharge,
  rushHourDay,
  rushHourEnd,
  rushHourMultiplier,
  rushHourStart
} from '../constants';

/**
 * Checks if given distance is greater than set minimum
 * @param {number} deliveryDistance distance as an integer
 * @returns {boolean} true or false
 */
export const isOverDistanceLimit = (deliveryDistance: number): boolean =>
  deliveryDistance > minDeliveryDistance;

/**
 * Calculates surcharge resulting from additional distance
 * @param {number} deliveryDistance distance as an integer
 * @returns {Dinero<number>} surcharge as a dinero object
 */
export const calculateDistanceSurcharge = (deliveryDistance: number): Dinero<number> => {
  if (isOverDistanceLimit(deliveryDistance)) {
    const finalCharge = Math.ceil(deliveryDistance / additionalDistanceDivisor);
    return dinero({ amount: finalCharge * additionalDistanceSurcharge, currency: EUR });
  }
  return dinero({ amount: minDistanceSurcharge, currency: EUR });
};

/**
 * Checks if given amount of items is greater than set minimum
 * @param {number} itemAmount amount of items as an integer
 * @returns {boolean} true or false
 */
export const isOverFourItems = (itemAmount: number): boolean => itemAmount > minItemAmount;

/**
 * Calculates the surcharge resulting from amount of additional items
 * @param {number} itemAmount amount of items as an integer
 * @returns {Dinero<number>} surcharge as a dinero object
 */
export const calculateItemSurcharge = (itemAmount: number): Dinero<number> => {
  if (isOverFourItems(itemAmount)) {
    return dinero({
      amount: additionalItemSurcharge * (itemAmount - minItemAmount),
      currency: EUR
    });
  }
  return dinero({ amount: minItemSurcharge, currency: EUR });
};

/**
 * Checks if given date falls into rush hour window
 * @param {Moment | null} deliveryDate date of delivery
 * @param {Moment | null} deliveryTime time of delivery
 * @returns {boolean} true or false
 */
export const isRushHour = (deliveryDate: Moment | null, deliveryTime: Moment | null): boolean => {
  if (deliveryDate && deliveryTime != null) {
    const hour = moment(deliveryTime).utc().hours();
    if (moment(deliveryDate).utc().day() === rushHourDay)
      return hour >= rushHourStart && hour < rushHourEnd;
  }
  return false;
};
/**
 * Multiplies given dinero value with set multiplier
 * @param {Dinero<number>} dineroObject dinero object to multiply
 * @returns {Dinero<number} new dinero object with updated amount
 */
export const multiplyWithRushHourMultiplier = (dineroObject: Dinero<number>): Dinero<number> => {
  const parsedAmount = dineroToInteger(dineroObject);
  const multipliedAmount = parsedAmount * rushHourMultiplier;
  return dinero({ amount: Math.round(multipliedAmount), currency: EUR });
};

/**
 * Checks if given dinero amount is less than set minimum cart value
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {boolean} true or false
 */
export const isUnderMinCartValue = (cartValue: Dinero<number>): boolean =>
  lessThan(cartValue, dinero({ amount: minCartValue, currency: EUR }));

/**
 * Checks if given dinero amount is less than set maxiumum cart value
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {boolean} true or false
 */
export const isNotOverMaxCartValue = (cartValue: Dinero<number>): boolean =>
  lessThan(cartValue, dinero({ amount: maxCartValue, currency: EUR }));

/**
 * Calculates surcharge resulting from cart value being too low
 * @param {Dinero<number>} cartValue cart value as a dinero object
 * @returns {Dinero<number} surcharge as a dinero object
 */
export const calculateCartValueSurcharge = (cartValue: Dinero<number>): Dinero<number> => {
  if (isUnderMinCartValue(cartValue)) {
    return subtract(dinero({ amount: minCartValue, currency: EUR }), cartValue);
  }
  return dinero({ amount: minCartValueSurcharge, currency: EUR });
};

/**
 * Checks if given dinero value is equal to or greater than set maximum delivery fee
 * @param {Dinero<number>} deliveryFee delivery fee as a dinero object
 * @returns {boolean} true or false
 */
export const isNotUnderDeliveryFeeLimit = (deliveryFee: Dinero<number>): boolean =>
  greaterThanOrEqual(deliveryFee, dinero({ amount: maxDeliveryFee, currency: EUR }));

/**
 * Calculates the final delivery fee
 * @param {number} cartValueAsNumber cart value as a number
 * @param {number} deliveryDistance delivery distance
 * @param {number} itemAmount amount of items
 * @param {Moment | null} deliveryDate date of delivery
 * @param {Moment | null} deliveryTime time of delivery
 * @returns {number} final delivery fee as a float number (two decimals)
 */
export const calculateDeliveryFee = (
  cartValueAsNumber: number,
  deliveryDistance: number,
  itemAmount: number,
  deliveryDate: Moment | null,
  deliveryTime: Moment | null
): number => {
  // Rounding possible float number to nearest 0.05 to prevent rounding errors later on
  const roundedCartValue = roundToMultipleOfFive(cartValueAsNumber);
  const cartValue = convertToDinero(roundedCartValue);
  let finalFee = dinero({ amount: 0, currency: EUR });

  if (isNotOverMaxCartValue(cartValue) && cartValueAsNumber !== 0) {
    finalFee = add(finalFee, calculateCartValueSurcharge(cartValue));
    finalFee = add(finalFee, calculateDistanceSurcharge(deliveryDistance));
    finalFee = add(finalFee, calculateItemSurcharge(itemAmount));

    if (isRushHour(deliveryDate, deliveryTime)) {
      finalFee = multiplyWithRushHourMultiplier(finalFee);
    }

    if (isNotUnderDeliveryFeeLimit(finalFee)) {
      finalFee = dinero({ amount: maxDeliveryFee, currency: EUR });
    }
  }

  return toUnit(finalFee, { digits: 2 });
};

export default calculateDeliveryFee;
