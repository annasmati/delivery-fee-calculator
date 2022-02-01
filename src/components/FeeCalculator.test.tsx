import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
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
    expect(
      screen.getByText('Date and time of delivery (UTC)')
    ).toBeInTheDocument();
  });

  it('renders all calculator buttons', () => {
    render(<FeeCalculator />);
    expect(screen.getByText('Calculate delivery price')).toBeInTheDocument();
    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders total amount text', () => {
    render(<FeeCalculator />);
    expect(screen.getByTestId('total')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    const rendered = render(<FeeCalculator />);

    const cartValueElement = rendered.container.querySelector('#cartvalue');
    const distanceElement = rendered.container.querySelector('#distancevalue');
    const itemAmountElement =
      rendered.container.querySelector('#itemamountvalue');
    const dateElement = rendered.container.querySelector('#date');
    const timeElement = rendered.container.querySelector('#time');

    expect(cartValueElement).toBeInTheDocument();
    expect(distanceElement).toBeInTheDocument();
    expect(itemAmountElement).toBeInTheDocument();
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toBeInTheDocument();
  });
});

describe('inputs work correctly', () => {
  it('changes cart value', () => {
    const rendered = render(<FeeCalculator />);
    const cartValueElement = rendered.container.querySelector(
      '#cartvalue'
    ) as HTMLInputElement;
    fireEvent.change(cartValueElement, { target: { value: '15' } });
    expect(cartValueElement.value).toBe('15');
  });
  it('changes distance value', () => {
    const rendered = render(<FeeCalculator />);
    const distanceElement = rendered.container.querySelector(
      '#distancevalue'
    ) as HTMLInputElement;
    fireEvent.change(distanceElement, { target: { value: '15' } });
    expect(distanceElement.value).toBe('15');
  });
  it('changes item amount', () => {
    const rendered = render(<FeeCalculator />);
    const itemAmountElement = rendered.container.querySelector(
      '#itemamountvalue'
    ) as HTMLInputElement;
    fireEvent.change(itemAmountElement, { target: { value: '15' } });
    expect(itemAmountElement.value).toBe('15');
  });
  it('changes date', () => {
    const rendered = render(<FeeCalculator />);
    const inputElement = rendered.container.querySelector(
      '#date'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '31/12/2022' } });
    expect(inputElement.value).toBe('31/12/2022');
  });

  it('changes time', () => {
    const rendered = render(<FeeCalculator />);
    const inputElement = rendered.container.querySelector(
      '#time'
    ) as HTMLInputElement;
    inputElement.value = '12:00 pm';
    expect(inputElement.value).toBe('12:00 pm');
  });
});

describe('reset works correctly', () => {
  it('resets calculator values', () => {
    const rendered = render(<FeeCalculator />);

    let inputElement = rendered.container.querySelector(
      '#cartvalue'
    ) as HTMLInputElement;

    inputElement = rendered.container.querySelector(
      '#distancevalue'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '15' } });
    inputElement = rendered.container.querySelector(
      '#itemamountvalue'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '15' } });

    const buttonElement = screen.getByText('Reset');
    fireEvent.click(buttonElement);

    inputElement = rendered.container.querySelector(
      '#cartvalue'
    ) as HTMLInputElement;
    expect(inputElement.value).toBe('0.00');
    inputElement = rendered.container.querySelector(
      '#distancevalue'
    ) as HTMLInputElement;
    expect(inputElement.value).toBe('0');
    inputElement = rendered.container.querySelector(
      '#itemamountvalue'
    ) as HTMLInputElement;
    expect(inputElement.value).toBe('0');
  });
});

describe('calculator works correctly', () => {
  it('shows calculated delivery price', () => {
    const rendered = render(<FeeCalculator />);
    let inputElement = rendered.container.querySelector(
      '#cartvalue'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '15' } });
    inputElement = rendered.container.querySelector(
      '#distancevalue'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '2000' } });
    inputElement = rendered.container.querySelector(
      '#itemamountvalue'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '15' } });
    inputElement = rendered.container.querySelector(
      '#date'
    ) as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: '31/2/2022' } });
    inputElement = rendered.container.querySelector(
      '#time'
    ) as HTMLInputElement;
    inputElement.value = '12:00 pm';

    const buttonElement = screen.getByText('Calculate delivery price');
    fireEvent.click(buttonElement);

    const textElement = screen.getByRole('heading', {
      name: 'Total price of delivery: 9.50€'
    });
    expect(textElement).toBeInTheDocument();
  });
});
