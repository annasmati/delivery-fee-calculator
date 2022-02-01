/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import '../assets/scss/fonts.scss';

import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import getCurrentTimeAndDate from '../utils/getCurrentTimeAndDate';
import calculateDeliveryFee from '../services/deliveryFeeCalculator';

/**
 * Component that calculates delivery fee based on given user input
 */
const FeeCalculator: React.FC = () => {
  // Number inputs need to be handled partly as strings due to unsolved React bug
  const [total, setTotal] = useState<string>('0.00€');
  const [cartValue, setCartValue] = useState<number | string>((0).toFixed(2));
  const [distanceValue, setDistanceValue] = useState<number | string>(0);
  const [itemAmountValue, setItemAmountValue] = useState<number | string>(0);
  const [minDate] = useState<Date>(getCurrentTimeAndDate());
  const [date, setDate] = useState<Date | null>(getCurrentTimeAndDate());
  const [time, setTime] = useState<Date | null>(getCurrentTimeAndDate());

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
    setDate(getCurrentTimeAndDate());
    setTime(getCurrentTimeAndDate());
    setTotal('0.00€');
  };

  /**
   * Handles onChange event on date picker
   *
   * Sets new value as state
   * @param {Date | null} newTimeAndDate new value
   */
  const handleDateChange = (newDate: Date | null): void => {
    setDate(newDate);
  };

  /**
   * Handles onChange event on time picker
   *
   * Sets new value as state
   * @param {Date | null} newTimeAndDate new value
   */
  const handleTimeChange = (newTime: Date | null): void => {
    setTime(newTime);
  };

  /**
   * Handles onChange events on input fields
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value: number = Number(event.target.value);
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
    const value: string = event.target.value.replace(/^0+(?!\.|$)/, '');
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

  const css = `
  .calculator-container {
    margin-top: 5em;
    padding: 3em;
    max-width: 500px;
    border-radius: 10px;
    background-color: white;
    font-family: 'Open Sans', sans-serif;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  `;

  const buttonCss = { backgroundColor: '#009de0' };

  return (
    <div className="calculator-container">
      <Stack
        spacing={6}
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid container spacing={3}>
          <Grid container item spacing={3}>
            <Grid item xs={6}>
              <Typography>Cart Value</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                id="cartvalue"
                value={cartValue}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">€</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    step: 0.01
                  }
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={6}>
              <Typography>Delivery distance</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                id="distancevalue"
                value={distanceValue}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">m</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    step: 1
                  }
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={6}>
              <Typography>Amount of items</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                id="itemamountvalue"
                value={itemAmountValue}
                onChange={handleChange}
                onBlur={handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">items</InputAdornment>
                  ),
                  inputProps: {
                    min: 0,
                    step: 1
                  }
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={6}>
              <Typography>Date and time of delivery (UTC)</Typography>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    inputFormat="dd/MM/yyyy"
                    value={date}
                    minDate={minDate}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField {...params} id="date" />
                    )}
                  />
                  <TimePicker
                    value={time}
                    onChange={handleTimeChange}
                    renderInput={(params) => (
                      <TextField {...params} id="time" />
                    )}
                  />
                </LocalizationProvider>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Stack spacing={2}>
          <Button onClick={calculateFee} variant="contained" sx={buttonCss}>
            Calculate delivery price
          </Button>
          <Button onClick={resetValues} variant="contained" sx={buttonCss}>
            Reset
          </Button>
        </Stack>
        <Typography variant="h6" data-testid="total">
          Total price of delivery: {total}
        </Typography>
      </Stack>
      <style>{css}</style>
    </div>
  );
};

export default FeeCalculator;
