import {
  Dinero,
  dinero,
  add,
  subtract,
  multiply,
  lessThan,
  lessThanOrEqual,
  greaterThanOrEqual
} from 'dinero.js';
import { EUR } from '@dinero.js/currencies';

// DISTANCE SURCHARGE
export const isOverDistanceLimit = (deliveryDistance: number): boolean =>
  deliveryDistance > 1000;

export const calculateDistanceSurcharge = (
  deliveryDistance: number
): Dinero<number> => {
  if (isOverDistanceLimit(deliveryDistance)) {
    const finalFee: number = Math.ceil(deliveryDistance / 500);
    return dinero({ amount: finalFee * 100, currency: EUR });
  }
  return dinero({ amount: 200, currency: EUR });
};

// ITEM AMOUNT SURCHARGE
export const isOverFourItems = (itemAmount: number): boolean => itemAmount > 4;

export const calculateItemSurcharge = (itemAmount: number): Dinero<number> => {
  if (isOverFourItems(itemAmount)) {
    return dinero({ amount: 50 * (itemAmount - 4), currency: EUR });
  }
  return dinero({ amount: 0, currency: EUR });
};

// RUSH HOUR SURCHARGE
export const isRushHour = (deliveryTime: Date): boolean => {
  const weekDay = deliveryTime.getUTCDay(); // 0-6 Sunday to Saturday
  const hour = deliveryTime.getUTCHours();
  if (weekDay === 5) return hour >= 15 && hour <= 19;
  return false;
};

export const calculateRushHourMultiplier = (deliveryTime: Date): number => {
  if (isRushHour(deliveryTime)) return 1.1;
  return 0;
};

// CART VALUE SURCHARGE
export const isUnderMinCartValue = (cartValue: Dinero<number>): boolean =>
  lessThan(cartValue, dinero({ amount: 1000, currency: EUR }));

export const isNotOverMaxCartValue = (cartValue: Dinero<number>): boolean =>
  lessThanOrEqual(cartValue, dinero({ amount: 10000, currency: EUR }));

export const calculateCartValueSurcharge = (cartValue: Dinero<number>) => {
  if (isUnderMinCartValue(cartValue)) {
    return subtract(dinero({ amount: 1000, currency: EUR }), cartValue);
  }
  return dinero({ amount: 0, currency: EUR });
};

// DELIVERY FEE LIMIT
export const isNotUnderDeliveryFeeLimit = (
  deliveryFee: Dinero<number>
): boolean =>
  greaterThanOrEqual(deliveryFee, dinero({ amount: 1500, currency: EUR }));

export const calculateDeliveryFee = (
  cartValue: Dinero<number>,
  deliveryDistance: number,
  itemAmount: number,
  deliveryTime: Date
): Dinero<number> => {
  let finalFee: Dinero<number> = dinero({ amount: 0, currency: EUR });
  if (isNotOverMaxCartValue(cartValue)) {
    finalFee = add(finalFee, calculateCartValueSurcharge(cartValue));
    finalFee = add(finalFee, calculateDistanceSurcharge(deliveryDistance));
    finalFee = add(finalFee, calculateItemSurcharge(itemAmount));
    finalFee = multiply(finalFee, calculateRushHourMultiplier(deliveryTime));

    if (isNotUnderDeliveryFeeLimit(finalFee)) {
      finalFee = dinero({ amount: 1500, currency: EUR });
    }
  }

  return finalFee;
};

export default calculateDeliveryFee;
