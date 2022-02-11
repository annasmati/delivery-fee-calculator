import React from 'react';
import './Header.scss';
import { EuiText } from '@elastic/eui';
import CalculatorGuide from './PricingGuide';
/**
 * Component for site header
 */
const Header: React.FC = () => (
  <header>
    <EuiText className="title" size="m">
      <h1>Delivery Fee Calculator</h1>
    </EuiText>
    <CalculatorGuide />
  </header>
);

export default Header;
