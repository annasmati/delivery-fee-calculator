import React, { useState } from 'react';
import './PricingGuide.scss';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiText,
  EuiTitle,
  EuiIcon
} from '@elastic/eui';
import Button from '@mui/material/Button';

/**
 * Component that shows a flyout containing
 * pricing information when button is pressed
 */
const CalculatorGuide: React.FC = () => {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  let flyout;

  if (isFlyoutVisible) {
    flyout = (
      <EuiFlyout
        type="push"
        size="s"
        onClose={() => setIsFlyoutVisible(false)}
        data-testid="pricing-flyout"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2>Pricing</h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiText>
            <p>
              The following elements will have an affect on the total price of
              delivery:
            </p>
            <ul>
              <li>
                <p>
                  <strong>Cart Value</strong>
                </p>
                If the cart value is less than 10€, a small order surcharge is
                added. The surcharge is calculated by subtracting the cart value
                from 10€.
              </li>
              <li>
                <p>
                  <strong>Delivery Distance</strong>
                </p>
                The delivery fee for the first 1000 meters (=1km) is 2€. For
                every additional 500 meters, 1€ is added.
              </li>
              <li>
                <p>
                  <strong>Amount of items</strong>
                </p>
                If the number of items exceeds 4, an additional 50 cent
                surcharge is added for each item.
              </li>
              <li>
                <p>
                  <strong>Rush Hour</strong>
                </p>
                During the Friday rush (3 - 7 PM UTC), a 10% increase is added
                to the total fee (total fee including possible surcharges).
              </li>
              <li>
                <p>
                  <strong>Maximum Delivery Price</strong>
                </p>
                The total price of delivery will never exceed 15€.
              </li>
              <li>
                <p>
                  <strong>Free Delivery</strong>
                </p>
                The delivery is free (0€) when the cart value is equal to or
                more than 100€.
              </li>
            </ul>
          </EuiText>
        </EuiFlyoutBody>
      </EuiFlyout>
    );
  }

  return (
    <div>
      <div className="guide-container">
        <Button
          className="pricing-button"
          onClick={() => setIsFlyoutVisible(true)}
          variant="text"
          startIcon={<EuiIcon type="tableOfContents" />}
        >
          Delivery Pricing
        </Button>
      </div>
      {flyout}
    </div>
  );
};

export default CalculatorGuide;
