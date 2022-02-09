import React from 'react';
import './Header.scss';
import Typography from '@mui/material/Typography';
import logo from '../assets/images/logo.png';

/**
 * Component for site header
 */
const Header: React.FC = () => (
  <header>
    <div className="flex-logo">
      <img src={logo} alt="logo" />
    </div>
    <div className="flex-title">
      <Typography className="title-font" variant="h3">
        Delivery Fee Calculator
      </Typography>
    </div>
    <div className="flex-item" />
  </header>
);

export default Header;
