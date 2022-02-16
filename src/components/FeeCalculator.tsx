/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import '../assets/scss/fonts.scss';
import './FeeCalculator.scss';
import {
  EuiFlexGrid,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiFieldNumber,
  EuiDatePicker,
  EuiText
} from '@elastic/eui';
import Button from '@mui/material/Button';
import moment, { Moment } from 'moment';
import calculateDeliveryFee from '../calculator/deliveryFeeCalculator';

/**
 * Component that shows calculated delivery fee based on given user input
 */
const FeeCalculator: React.FC = () => {
  // Number inputs need to be handled partly as strings due to unsolved React bug
  // See https://github.com/facebook/react/issues/9402

  const [total, setTotal] = useState<string>('0.00€');
  const [cartValue, setCartValue] = useState<number | string>((0).toFixed(2));
  const [distanceValue, setDistanceValue] = useState<number | string>(0);
  const [itemAmountValue, setItemAmountValue] = useState<number | string>(0);
  const [minDate] = useState<Moment>(moment());
  const [date, setDate] = useState<Moment | null>(moment().utc());
  const [time, setTime] = useState<Moment | null>(moment().utc());

  /**
   * Calculates delivery fee with current input states and shows it with two decimals
   */
  const calculateFee = (): void => {
    const finalFee = calculateDeliveryFee(
      Number(cartValue),
      Number(distanceValue),
      Number(itemAmountValue),
      date,
      time
    );
    setTotal(`${finalFee.toFixed(2)}€`);
  };

  /**
   * Resets input states back to default values
   */
  const resetValues = (): void => {
    setCartValue((0).toFixed(2));
    setDistanceValue(0);
    setItemAmountValue(0);
    setDate(moment().utc());
    setTime(moment().utc());
    setTotal('0.00€');
  };

  /**
   * Handles onChange events on input fields
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    switch (event.target.id) {
      case 'cartvalue':
        setCartValue(value);
        break;
      case 'distancevalue':
        setDistanceValue(value);
        break;
      case 'itemamountvalue':
        setItemAmountValue(value);
        break;
      default:
        throw new Error(`Input element with id ${event.target.id} not found.`);
    }
  };

  /**
   * Handles onBlur events on input fields
   *
   * Used for slicing unnecessary leading zeroes and adding two decimals
   * when needed as user clicks out of a field
   * @param {React.FocusEvent<HTMLInputElement>} event
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    const value = event.target.value.replace(/^0+(?!\.|$)/, '');
    switch (event.target.id) {
      case 'cartvalue':
        setCartValue(parseFloat(value).toFixed(2));
        break;
      case 'distancevalue':
        setDistanceValue(value);
        break;
      case 'itemamountvalue':
        setItemAmountValue(value);
        break;
      default:
        throw new Error(`Input element with id ${event.target.id} not found.`);
    }
  };

  return (
    <div className="calculator-container">
      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiFlexGrid columns={2}>
            <EuiFlexItem>
              <EuiText>Cart Value</EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFieldNumber
                append="€"
                value={cartValue}
                onChange={handleChange}
                onBlur={handleBlur}
                id="cartvalue"
                data-testid="cartvalue"
                min={0}
                step={0.01}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText>Delivery distance</EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFieldNumber
                append="m"
                value={distanceValue}
                onChange={handleChange}
                onBlur={handleBlur}
                id="distancevalue"
                data-testid="distancevalue"
                min={0}
                step={1}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText>Amount of items</EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFieldNumber
                append="items"
                value={itemAmountValue}
                onChange={handleChange}
                onBlur={handleBlur}
                id="itemamountvalue"
                data-testid="itemamountvalue"
                min={0}
                step={1}
              />
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText>Date and time (UTC)</EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup direction="column">
                <EuiFlexItem>
                  <EuiDatePicker selected={date} onChange={setDate} minDate={minDate} id="date" />
                  <EuiSpacer size="s" />
                  <EuiDatePicker
                    showTimeSelect
                    showTimeSelectOnly
                    selected={time}
                    onChange={setTime}
                    dateFormat="HH:mm"
                    timeFormat="HH:mm"
                    id="time"
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
          </EuiFlexGrid>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiSpacer size="xxl" />
          <EuiFlexGroup direction="column" alignItems="center">
            <Button className="calculator-button" onClick={calculateFee} variant="contained">
              Calculate delivery price
            </Button>
            <EuiSpacer size="s" />
            <Button className="calculator-button-empty" onClick={resetValues} variant="text">
              Reset
            </Button>
            <EuiSpacer />
            <EuiText>
              Total price of delivery: <strong>{total}</strong>
            </EuiText>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
};

export default FeeCalculator;
