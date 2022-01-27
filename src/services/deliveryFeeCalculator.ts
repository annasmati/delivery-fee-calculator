import sliceDecimals from '../utils/sliceDecimals';

// CART VALUE
const isUnderMinimumCartValue = (cartValue: number): boolean =>
  cartValue <= 10.0;

const isNotOverMaxCartValue = (cartValue: number): boolean =>
  cartValue <= 100.0;

// VALUE SURCHARGE
const calculateValueSurcharge = (cartValue: number) => {
  if (isUnderMinimumCartValue(cartValue)) return Math.round(10.0 - cartValue);
  return 0;
};

// DISTANCE SURCHARGE
const getDistanceMultiplier = (exceedingDistance: number): number => {
  const remainder: number = exceedingDistance / 500;
  if (remainder <= 1) return 1;
  if (remainder > 1) return sliceDecimals(remainder, 0);
  return 0;
};

const isOverDistanceLimit = (deliveryDistance: number): boolean =>
  deliveryDistance >= 1000;
const calculateDistanceSurcharge = (deliveryDistance: number) => {
  const baseFee: number = 2.0;
  if (isOverDistanceLimit(deliveryDistance)) {
    const exceedingDistance = deliveryDistance - 1000;
    const distanceMultiplier = getDistanceMultiplier(exceedingDistance);
    return baseFee + distanceMultiplier;
  }
  return baseFee;
};

// ITEM SURCHARGE
const isOverFourItems = (itemAmount: number): boolean => itemAmount > 4;

const calculateItemSurcharge = (itemAmount: number): number => {
  if (isOverFourItems(itemAmount)) {
    return (itemAmount - 4) * 0.5;
  }
  return 0;
};

// DELIVERY FEE LIMIT
const isNotUnderDeliveryFeeLimit = (deliveryFee: number): boolean =>
  deliveryFee >= 15.0;

// RUSH OUR SURCHARGE
const isRushHour = (deliveryTime: Date): boolean => {
  const weekDay = deliveryTime.getUTCDay(); // 0-6 Sunday to Saturday
  const hour = deliveryTime.getUTCHours();
  if (weekDay === 5) return hour >= 15 && hour <= 19;
  return false;
};

const calculateRushHourMultiplier = (deliveryTime: Date): number => {
  if (isRushHour(deliveryTime)) return 1.1;
  return 0;
};

const calculateDeliveryFee = (
  cartValue: number,
  deliveryDistance: number,
  itemAmount: number,
  deliveryTime: Date
) => {
  let finalFee: number = 0.0;
  if (isNotOverMaxCartValue(cartValue)) {
    finalFee += calculateValueSurcharge(cartValue);
    finalFee += calculateDistanceSurcharge(deliveryDistance);
    finalFee += calculateItemSurcharge(itemAmount);
    finalFee *= calculateRushHourMultiplier(deliveryTime);

    if (isNotUnderDeliveryFeeLimit(finalFee)) {
      finalFee = 15.0;
    }
  }

  return finalFee;
};

export default calculateDeliveryFee;
