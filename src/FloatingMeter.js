import React from 'react';

const FloatingMeter = ({ interestIncome, totalMarketCap }) => {
  // Calculate interest income as a percentage of total market cap
  const incomePercentage = (interestIncome / totalMarketCap) * 100;

  // Define the thresholds
  const threshold = 5; // Threshold percentage
  const positiveRange = threshold; // Range for positive compliance
  const negativeRange = 100 - threshold; // Range for negative compliance

  // Initialize scaled value, color, and compliance message
  let scaledValue;
  let color;
  let complianceMessage;

  // Determine scaled value, color, and compliance message based on compliance
  if (incomePercentage <= positiveRange) {
    // Calculate the scaled value for positive compliance
    scaledValue = (incomePercentage / positiveRange) * 2;
    color = 'green';
    complianceMessage = `Interest income is ${scaledValue.toFixed(2)} scaled compliant with the threshold`;
  } else {
    // Calculate the scaled value for negative compliance
    const nonCompliance = incomePercentage - threshold;
    scaledValue = (nonCompliance / negativeRange) * 10;
    color = 'red';
    complianceMessage = `Interest income is ${scaledValue.toFixed(2)} scaled non-compliant with the threshold`;
  }

  // Ensure scaled value stays within the range of 1 to 10
  scaledValue = Math.max(1, Math.min(5, scaledValue));

  return (
    <div style={{ position: 'relative', bottom: '20px', right: '20px', zIndex: '9999' }}>
      <div className='card'>
        <div style={{ textAlign: 'center' }}>
          {scaledValue + "/" + 5 }<br />
        </div>
      <div style={{ width: '150px', height: '10px', border: '0.5px solid grey', position: 'relative' }}>
        <div style={{ width: `${scaledValue * 20}%`, height: '100%', backgroundColor: color, position: 'absolute', top: 0, left: 0 }}></div>
      </div>
      </div>
    </div>
  );
};

export default FloatingMeter;
