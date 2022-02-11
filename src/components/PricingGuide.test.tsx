import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PricingGuide from './PricingGuide';

describe('Component renders correctly', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PricingGuide />, div);
  });

  it('renders main heading', () => {
    render(<PricingGuide />);
    expect(screen.getByText('Delivery Pricing')).toBeInTheDocument();
  });
});

describe('Flyout operations', () => {
  it('shows flyout when button is clicked', () => {
    render(<PricingGuide />);

    expect(screen.queryByTestId('pricing-flyout')).toBe(null);

    const buttonPricing = screen.getByText('Delivery Pricing');
    fireEvent.click(buttonPricing);

    expect(screen.queryByTestId('pricing-flyout')).not.toBe(null);
  });

  it('renders the heading', () => {
    render(<PricingGuide />);
    const buttonPricing = screen.getByText('Delivery Pricing');
    fireEvent.click(buttonPricing);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders list', () => {
    render(<PricingGuide />);
    const buttonPricing = screen.getByText('Delivery Pricing');
    fireEvent.click(buttonPricing);

    expect(
      screen.getByText(
        'The following elements will have an affect on the total price of delivery:'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Cart Value')).toBeInTheDocument();

    expect(
      screen.getByText(
        'If the cart value is less than 10€, a small order surcharge is added. ' +
          'The surcharge is calculated by subtracting the cart value from 10€.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Delivery Distance')).toBeInTheDocument();

    expect(
      screen.getByText(
        'The delivery fee for the first 1000 meters (=1km) is 2€. ' +
          'For every additional 500 meters, 1€ is added.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Amount of items')).toBeInTheDocument();

    expect(
      screen.getByText(
        'If the number of items exceeds 4, an additional ' +
          '50 cent surcharge is added for each item.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Rush Hour')).toBeInTheDocument();

    expect(
      screen.getByText(
        'During the Friday rush (3 - 7 PM UTC), a 10% increase is added ' +
          'to the total fee (total fee including possible surcharges).'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('Maximum Delivery Price')).toBeInTheDocument();

    expect(
      screen.getByText('The total price of delivery will never exceed 15€.')
    ).toBeInTheDocument();

    expect(screen.getByText('Free Delivery')).toBeInTheDocument();

    expect(
      screen.getByText(
        'The delivery is free (0€) when the cart value is equal to or more than 100€.'
      )
    ).toBeInTheDocument();
  });
});
