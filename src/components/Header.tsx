import React from 'react';
import './Header.scss';
import { EuiText } from '@elastic/eui';
import logo from '../assets/images/logo.png';
/**
 * Component for site header
 */
const Header: React.FC = () => (
  <header>
    <EuiText className="title" size="m">
      <h1>Delivery Fee Calculator</h1>
    </EuiText>
    <div className="flex-title">
  </header>
);

export default Header;
