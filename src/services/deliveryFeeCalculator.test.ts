import { dinero, toSnapshot } from 'dinero.js';
import { EUR } from '@dinero.js/currencies';
import moment from 'moment';
import {
  isOverDistanceLimit,
  calculateDistanceSurcharge,
  isOverFourItems,
  calculateItemSurcharge,
  isUnderMinCartValue,
  isNotOverMaxCartValue,
  calculateCartValueSurcharge,
  isNotUnderDeliveryFeeLimit,
  isRushHour,
  multiplyWithRushHourMultiplier,
  calculateDeliveryFee
} from './deliveryFeeCalculator';

describe('Distance surcharge', () => {
  test('Should check if given distance is greater than 1000', () => {
    expect(isOverDistanceLimit(0)).toBeFalsy();
    expect(isOverDistanceLimit(999)).toBeFalsy();
    expect(isOverDistanceLimit(1000)).toBeFalsy();
    expect(isOverDistanceLimit(1001)).toBeTruthy();
    expect(isOverDistanceLimit(10000)).toBeTruthy();
  });

  test('Should calculate surcharge resulting from additional distance', () => {
    expect(toSnapshot(calculateDistanceSurcharge(1000))).toMatchObject(
      toSnapshot(dinero({ amount: 200, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(1001))).toMatchObject(
      toSnapshot(dinero({ amount: 300, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(1499))).toMatchObject(
      toSnapshot(dinero({ amount: 300, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(1500))).toMatchObject(
      toSnapshot(dinero({ amount: 300, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(1501))).toMatchObject(
      toSnapshot(dinero({ amount: 400, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(1999))).toMatchObject(
      toSnapshot(dinero({ amount: 400, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(2000))).toMatchObject(
      toSnapshot(dinero({ amount: 400, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(2001))).toMatchObject(
      toSnapshot(dinero({ amount: 500, currency: EUR }))
    );
    expect(toSnapshot(calculateDistanceSurcharge(10503))).toMatchObject(
      toSnapshot(dinero({ amount: 2200, currency: EUR }))
    );
  });
});

describe('Item amount surcharge', () => {
  test('Should check if amount of items is greater than 4', () => {
    expect(isOverFourItems(0)).toBeFalsy();
    expect(isOverFourItems(0.5)).toBeFalsy();
    expect(isOverFourItems(1)).toBeFalsy();
    expect(isOverFourItems(2)).toBeFalsy();
    expect(isOverFourItems(3)).toBeFalsy();
    expect(isOverFourItems(4)).toBeFalsy();
    expect(isOverFourItems(5)).toBeTruthy();
  });

  test('Should calculate surcharge resulting from amount of items', () => {
    expect(toSnapshot(calculateItemSurcharge(0))).toMatchObject(
      toSnapshot(dinero({ amount: 0, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(1))).toMatchObject(
      toSnapshot(dinero({ amount: 0, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(2))).toMatchObject(
      toSnapshot(dinero({ amount: 0, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(3))).toMatchObject(
      toSnapshot(dinero({ amount: 0, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(4))).toMatchObject(
      toSnapshot(dinero({ amount: 0, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(5))).toMatchObject(
      toSnapshot(dinero({ amount: 50, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(6))).toMatchObject(
      toSnapshot(dinero({ amount: 100, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(7))).toMatchObject(
      toSnapshot(dinero({ amount: 150, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(10))).toMatchObject(
      toSnapshot(dinero({ amount: 300, currency: EUR }))
    );
    expect(toSnapshot(calculateItemSurcharge(234))).toMatchObject(
      toSnapshot(dinero({ amount: 11500, currency: EUR }))
    );
  });
});

describe('Rush hour surcharge', () => {
  test('Should check if given date falls into rush hour window', () => {
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 1, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 1, 15, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 2, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 2, 15, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 3, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 3, 15, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 14, 59, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 14, 59, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 15, 0, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 15, 1, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 15, 1, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 16, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 16, 0, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 18, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 18, 0, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 18, 59, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 18, 59, 0)))
      )
    ).toBeTruthy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 4, 19, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 19, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 5, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 5, 15, 0, 0)))
      )
    ).toBeFalsy();
    expect(
      isRushHour(
        moment(new Date(Date.UTC(2022, 1, 6, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 6, 15, 0, 0)))
      )
    ).toBeFalsy();
  });

  test('Should multiply given dinero value with 1.1 and return new dinero object', () => {
    expect(
      toSnapshot(
        multiplyWithRushHourMultiplier(dinero({ amount: 0, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 0, currency: EUR })));
    expect(
      toSnapshot(
        multiplyWithRushHourMultiplier(dinero({ amount: 50, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 55, currency: EUR })));
    expect(
      toSnapshot(
        multiplyWithRushHourMultiplier(dinero({ amount: 500, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 550, currency: EUR })));
    expect(
      toSnapshot(
        multiplyWithRushHourMultiplier(dinero({ amount: 940, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 1034, currency: EUR })));
    expect(
      toSnapshot(
        multiplyWithRushHourMultiplier(
          dinero({ amount: 1000000, currency: EUR })
        )
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 1100000, currency: EUR })));
  });
});

describe('Cart value surcharge', () => {
  test('Should check if given dinero value is less than 10€', () => {
    expect(
      isUnderMinCartValue(dinero({ amount: 0, currency: EUR }))
    ).toBeTruthy();
    expect(
      isUnderMinCartValue(dinero({ amount: 50, currency: EUR }))
    ).toBeTruthy();
    expect(
      isUnderMinCartValue(dinero({ amount: 900, currency: EUR }))
    ).toBeTruthy();
    expect(
      isUnderMinCartValue(dinero({ amount: 1000, currency: EUR }))
    ).toBeFalsy();
  });

  test('Should check if given dinero value is less than 100€', () => {
    expect(
      isNotOverMaxCartValue(dinero({ amount: 0, currency: EUR }))
    ).toBeTruthy();
    expect(
      isNotOverMaxCartValue(dinero({ amount: 50, currency: EUR }))
    ).toBeTruthy();
    expect(
      isNotOverMaxCartValue(dinero({ amount: 9999, currency: EUR }))
    ).toBeTruthy();
    expect(
      isNotOverMaxCartValue(dinero({ amount: 10000, currency: EUR }))
    ).toBeFalsy();
    expect(
      isNotOverMaxCartValue(dinero({ amount: 10100, currency: EUR }))
    ).toBeFalsy();
  });

  test('Should calculate surcharge resulted from cart value being too low', () => {
    expect(
      toSnapshot(
        calculateCartValueSurcharge(dinero({ amount: 0, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 1000, currency: EUR })));
    expect(
      toSnapshot(
        calculateCartValueSurcharge(dinero({ amount: 50, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 950, currency: EUR })));
    expect(
      toSnapshot(
        calculateCartValueSurcharge(dinero({ amount: 500, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 500, currency: EUR })));
    expect(
      toSnapshot(
        calculateCartValueSurcharge(dinero({ amount: 940, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 60, currency: EUR })));
    expect(
      toSnapshot(
        calculateCartValueSurcharge(dinero({ amount: 1000, currency: EUR }))
      )
    ).toMatchObject(toSnapshot(dinero({ amount: 0, currency: EUR })));
  });
});

describe('Delivery fee limit', () => {
  test('Should check if given dinero value is equal to or greater than 15€', () => {
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 0, currency: EUR }))
    ).toBeFalsy();
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 50, currency: EUR }))
    ).toBeFalsy();
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 1000, currency: EUR }))
    ).toBeFalsy();
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 1499, currency: EUR }))
    ).toBeFalsy();
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 1500, currency: EUR }))
    ).toBeTruthy();
    expect(
      isNotUnderDeliveryFeeLimit(dinero({ amount: 1501, currency: EUR }))
    ).toBeTruthy();
  });
});

describe('delivery fee calculator functionality', () => {
  test('Should calculate delivery fee with 20€ cart value and no surcharges', () =>
    expect(
      calculateDeliveryFee(
        20,
        1000,
        1,
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0)))
      )
    ).toBe(2));

  test('Should calculate delivery fee with 20€ cart value and all surcharges', () => {
    expect(
      calculateDeliveryFee(
        20,
        2000,
        10,
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0)))
      )
    ).toBe(7.7);
  });

  test('Should calculate delivery fee with 5€ (under limit) cart value and no additional surcharges', () => {
    expect(
      calculateDeliveryFee(
        5,
        1000,
        1,
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0)))
      )
    ).toBe(7);
  });

  test('Should calculate delivery fee with 5€ (under limit) cart value and all surcharges', () => {
    expect(
      calculateDeliveryFee(
        5,
        2000,
        10,
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0)))
      )
    ).toBe(13.2);
  });

  test('Should calculate delivery fee to be 0€ with 100€ cart value and no surcharges', () => {
    expect(
      calculateDeliveryFee(
        100,
        1000,
        1,
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0))),
        moment(new Date(Date.UTC(2022, 0, 31, 15, 0, 0)))
      )
    ).toBe(0);
  });

  test('Should calculate delivery fee to be 0€ with 100€ cart value and all surcharges', () => {
    expect(
      calculateDeliveryFee(
        100,
        1500,
        10,
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0)))
      )
    ).toBe(0);
  });

  test('Should calculate delivery fee to be max 15€', () => {
    expect(
      calculateDeliveryFee(
        0.2,
        1500,
        50,
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0))),
        moment(new Date(Date.UTC(2022, 1, 4, 17, 0, 0)))
      )
    ).toBe(15);
  });
});
