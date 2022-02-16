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
import {
  additionalDistanceDivisorAsString,
  additionalDistanceSurchargeAsString,
  additionalItemSurchargeAsString,
  maxCartValueAsString,
  maxDeliveryFeeAsString,
  minCartValueAsString,
  minDeliveryDistanceAsString,
  minDistanceSurchargeAsString,
  minItemAmountAsString,
  rushHourDayAsString,
  rushHourEndAsString,
  rushHourMultiplierAsString,
  rushHourStartAsString
} from '../constants';

/**
 * Component that shows a flyout containing
 * pricing information when button is pressed
 */
const PricingGuide: React.FC = () => {
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
            <p>The following elements will have an affect on the total price of delivery:</p>
            <ul>
              <li>
                <p>
                  <strong>Cart Value</strong>
                </p>
                If the cart value is less than {minCartValueAsString}€, a small order surcharge is
                added. The surcharge is calculated by subtracting the cart value from{' '}
                {minCartValueAsString}€.
              </li>
              <li>
                <p>
                  <strong>Delivery Distance</strong>
                </p>
                The delivery fee for the first {minDeliveryDistanceAsString} meters is{' '}
                {minDistanceSurchargeAsString}€. For every additional{' '}
                {additionalDistanceDivisorAsString} meters, {additionalDistanceSurchargeAsString}€
                is added.
              </li>
              <li>
                <p>
                  <strong>Amount of items</strong>
                </p>
                If the number of items exceeds {minItemAmountAsString}, an additional{' '}
                {additionalItemSurchargeAsString}€ surcharge is added for each item.
              </li>
              <li>
                <p>
                  <strong>Rush Hour</strong>
                </p>
                During the {rushHourDayAsString} rush ({rushHourStartAsString} -{' '}
                {rushHourEndAsString} UTC), a {rushHourMultiplierAsString}% increase is added to the
                total fee (total fee including possible surcharges).
              </li>
              <li>
                <p>
                  <strong>Maximum Delivery Price</strong>
                </p>
                The total price of delivery will never exceed {maxDeliveryFeeAsString}€.
              </li>
              <li>
                <p>
                  <strong>Free Delivery</strong>
                </p>
                The delivery is free (0€) when the cart value is equal to or more than{' '}
                {maxCartValueAsString}€.
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

export default PricingGuide;
