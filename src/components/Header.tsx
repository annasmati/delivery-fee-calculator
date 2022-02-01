import React from 'react';
import Typography from '@mui/material/Typography';
import logo from '../assets/images/logo.png';
import '../assets/scss/fonts.scss';

/**
 * Component for site header
 */
const Header: React.FC = () => {
  const css = `
  header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: #2b2b2b;
      width: 100%;
      background-color: white;
      box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
    }

    .flex-item {
        padding: 0.5em 0em 0.5em 0.5em;
        height: 80px;
        width: 80px;
    }

    .title-font {
        font-family: 'Open Sans', sans-serif;
        font-weight: bold;
    }

    img {
        padding: 0.5em 0em 0.5em 0.5em;
        height: 80px;
        width: 80px;
    }
      `;
  return (
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
      <style>{css}</style>
    </header>
  );
};

export default Header;
