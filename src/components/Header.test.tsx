import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Component renders correctly', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Header />, div);
  });

  it('renders main heading', () => {
    render(<Header />);
    expect(screen.getByText('Delivery Fee Calculator')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Header />);
    expect(screen.getByAltText('logo')).toBeInTheDocument();
  });
});
