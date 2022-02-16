import { dinero, toSnapshot } from 'dinero.js';
import { EUR } from '@dinero.js/currencies';
import { integerToDinero, dineroToInteger, convertToDinero } from '../../utils/dineroParser';

test('Should return a new dinero object with the given integer as its amount value', () => {
  expect(toSnapshot(integerToDinero(200))).toMatchObject(
    toSnapshot(dinero({ amount: 200, currency: EUR }))
  );
  expect(toSnapshot(integerToDinero(4000))).toMatchObject(
    toSnapshot(dinero({ amount: 4000, currency: EUR }))
  );
  expect(toSnapshot(integerToDinero(121212))).toMatchObject(
    toSnapshot(dinero({ amount: 121212, currency: EUR }))
  );
});

test('Should return an integer equal to give dinero object`s amount value', () => {
  expect(dineroToInteger(dinero({ amount: 200, currency: EUR }))).toBe(200);
  expect(dineroToInteger(dinero({ amount: 4000, currency: EUR }))).toBe(4000);
  expect(dineroToInteger(dinero({ amount: 121212, currency: EUR }))).toBe(121212);
});

test('Should return a new dinero object with the given integer as its amount value', () => {
  expect(toSnapshot(convertToDinero(0.05))).toMatchObject(
    toSnapshot(dinero({ amount: 5, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(0.5))).toMatchObject(
    toSnapshot(dinero({ amount: 50, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(1.1))).toMatchObject(
    toSnapshot(dinero({ amount: 110, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(1.02))).toMatchObject(
    toSnapshot(dinero({ amount: 102, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(200.05))).toMatchObject(
    toSnapshot(dinero({ amount: 20005, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(400.01))).toMatchObject(
    toSnapshot(dinero({ amount: 40001, currency: EUR }))
  );
  expect(toSnapshot(convertToDinero(100000.05))).toMatchObject(
    toSnapshot(dinero({ amount: 10000005, currency: EUR }))
  );
});
