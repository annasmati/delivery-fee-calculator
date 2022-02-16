/* eslint-disable no-shadow */
import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import moment from 'moment';
import { fireEvent, render, screen } from '@testing-library/react';
import FeeCalculator from './FeeCalculator';

describe('Component renders correctly', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<FeeCalculator />, div);
  });

  it('renders all calculator titles', () => {
    render(<FeeCalculator />);
    expect(screen.getByText('Cart Value')).toBeInTheDocument();
    expect(screen.getByText('Delivery distance')).toBeInTheDocument();
    expect(screen.getByText('Amount of items')).toBeInTheDocument();
    expect(screen.getByText('Date and time (UTC)')).toBeInTheDocument();
  });

  it('renders all calculator buttons', () => {
    render(<FeeCalculator />);
    expect(screen.getByText('Calculate delivery price')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders total amount text', () => {
    render(<FeeCalculator />);

    screen.getByText((content: any, node: any) => {
      const hasText = (node: any) => node.textContent === 'Total price of delivery: 0.00€';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every((child: any) => !hasText(child));

      return nodeHasText && childrenDontHaveText;
    });
  });

  it('renders all input fields', () => {
    const rendered = render(<FeeCalculator />);
    const dateElement = rendered.container.querySelector('#date');
    const timeElement = rendered.container.querySelector('#time');
    expect(screen.getByTestId('cartvalue')).toBeInTheDocument();
    expect(screen.getByTestId('distancevalue')).toBeInTheDocument();
    expect(screen.getByTestId('itemamountvalue')).toBeInTheDocument();
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toBeInTheDocument();
  });
});

describe('inputs work correctly', () => {
  it('changes cart value', () => {
    render(<FeeCalculator />);
    const cartValueElement = screen.getByTestId('cartvalue') as HTMLInputElement;
    fireEvent.change(cartValueElement, { target: { value: '15' } });
    expect(cartValueElement.value).toBe('15');
  });
  it('changes distance value', () => {
    render(<FeeCalculator />);
    const distanceElement = screen.getByTestId('distancevalue') as HTMLInputElement;
    fireEvent.change(distanceElement, { target: { value: '15' } });
    expect(distanceElement.value).toBe('15');
  });
  it('changes item amount', () => {
    render(<FeeCalculator />);
    const itemAmountElement = screen.getByTestId('itemamountvalue') as HTMLInputElement;
    fireEvent.change(itemAmountElement, { target: { value: '15' } });
    expect(itemAmountElement.value).toBe('15');
  });
  it('changes date', () => {
    const rendered = render(<FeeCalculator />);
    const inputElement = rendered.container.querySelector('#date') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '31/12/2022' } });
    expect(inputElement.value).toBe('31/12/2022');
  });

  it('changes time', () => {
    const rendered = render(<FeeCalculator />);
    const inputElement = rendered.container.querySelector('#time') as HTMLInputElement;
    inputElement.value = '12:00';
    expect(inputElement.value).toBe('12:00');
  });
});

describe('reset works correctly', () => {
  it('resets calculator values', () => {
    const rendered = render(<FeeCalculator />);

    const inputCartValue = screen.getByTestId('cartvalue') as HTMLInputElement;
    fireEvent.change(inputCartValue, { target: { value: '15' } });

    const inputDistance = screen.getByTestId('distancevalue') as HTMLInputElement;
    fireEvent.change(inputDistance, { target: { value: '15' } });

    const inputItemAmount = screen.getByTestId('itemamountvalue') as HTMLInputElement;
    fireEvent.change(inputItemAmount, { target: { value: '15' } });

    const inputDate = rendered.container.querySelector('#date') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '31/12/2022' } });

    const inputTime = rendered.container.querySelector('#time') as HTMLInputElement;
    inputTime.value = '12:00';

    const buttonReset = screen.getByText('Reset');
    fireEvent.click(buttonReset);

    expect(inputCartValue.value).toBe('0.00');
    expect(inputDistance.value).toBe('0');
    expect(inputItemAmount.value).toBe('0');
    expect(inputDate.value).toBe(moment().utc().format('L'));
    expect(inputTime.value).toBe(moment().utc().format('HH:mm'));
  });
});

describe('calculator works correctly', () => {
  it('shows calculated delivery price', () => {
    const rendered = render(<FeeCalculator />);

    const inputCartValue = screen.getByTestId('cartvalue') as HTMLInputElement;
    fireEvent.change(inputCartValue, { target: { value: '15' } });

    const inputDistance = screen.getByTestId('distancevalue') as HTMLInputElement;
    fireEvent.change(inputDistance, { target: { value: '2000' } });

    const inputItemAmount = screen.getByTestId('itemamountvalue') as HTMLInputElement;
    fireEvent.change(inputItemAmount, { target: { value: '15' } });

    const inputDate = rendered.container.querySelector('#date') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '31/2/2022' } });

    const inputTime = rendered.container.querySelector('#time') as HTMLInputElement;
    fireEvent.change(inputTime, { target: { value: '12:00' } });

    const buttonElement = screen.getByText('Calculate delivery price');
    fireEvent.click(buttonElement);

    screen.getByText((content: any, node: any) => {
      const hasText = (node: any) => node.textContent === 'Total price of delivery: 9.50€';
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node.children).every((child: any) => !hasText(child));

      return nodeHasText && childrenDontHaveText;
    });
  });
});
