import React, { useState, useEffect } from 'react';
import "./mycss.css"
import FloatingMeter from './FloatingMeter'; // Assuming the FloatingMeter component is in a separate file


function Analysis() {
  const [ticker, setTicker] = useState('');
  const apiKey = 'A1mfcGTEDQJ2EcCCzoTs4apytPvHQx4Y';
 const [activeColumn, setActiveColumn] = useState(null);

  // Function to handle mouse enter event for a specific column
  const handleMouseEnter = (columnId) => {
    setActiveColumn(columnId);
  };

  // Function to handle mouse leave event for a specific column
  const handleMouseLeave = () => {
    setActiveColumn(null);
  };

  const [search, setSearch] = useState(false);

  const [combinedData, setCombinedData] = useState(null);
  const tangilbeFinancialElements = [
      "cashAndCashEquivalents",
      "shortTermInvestments",
      "netReceivables",
      "inventory",
      "propertyPlantEquipmentNet",
      "longTermInvestments"
  ];

  const interestBearingFinancialElements = [
      "cashAndCashEquivalents",
      "shortTermInvestments",
      "longTermInvestments"
  ];

  function sumNonZeroValues(data, keys) {
    let sum = 0;
    keys.forEach(key => {
        if (data[key] !== 0) {
            sum += data[key];
        }
    });
    return sum;
  }

  function dollarsToBillion(amountInDollars) {
    return (amountInDollars / 1000000000).toFixed(2) + ' B';
  }

  function calculateLiabilitiesPercentage(amount, combinedData, value) {
    if (value) {
      return ((amount / combinedData.balanceSheet['totalLiabilities']) * 100).toFixed(2);
    }
    return ((amount / combinedData.balanceSheet['totalLiabilities']) * 100).toFixed(2) + '%';
  }

  function calculateRevenuePercentage(amount, combinedData, value) {
    if (value) {
      return ((amount / combinedData.incomeStatement['revenue']) * 100).toFixed(2);
    }
    return ((amount / combinedData.incomeStatement['revenue']) * 100).toFixed(2) + '%';
  }

  function calculateAssetsPercentage(amount, combinedData, value) {
    if (value) {
      return ((amount / combinedData.balanceSheet['totalAssets']) * 100).toFixed(2);
    }
    return ((amount / combinedData.balanceSheet['totalAssets']) * 100).toFixed(2) + '%';
  }

  function calculateMCapPercentage(amount, combinedData, value) {
    let marketCap = combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap;

    if (value) {
      return ((amount / marketCap) * 100).toFixed(2)
    }
    return ((amount / marketCap) * 100).toFixed(2) + '%';
  }

  function rangeDate(date) {
    // Sample date string from your incomeStatementData
    let income_date_str = date;

    // Convert string to Date object
    let income_date = new Date(income_date_str);

    // Define milliseconds for 5 days
    let five_days_ms = 5 * 24 * 60 * 60 * 1000;

    // Calculate from_date and to_date
    let from_date = new Date(income_date.getTime() - five_days_ms);
    let to_date = new Date(income_date.getTime() + five_days_ms);

    // Convert Date objects to yyyy-mm-dd format
    function formatDate(date) {
      let yyyy = date.getFullYear();
      let mm = String(date.getMonth() + 1).padStart(2, '0');
      let dd = String(date.getDate()).padStart(2, '0');
      return yyyy + '-' + mm + '-' + dd;
    }

    from_date = formatDate(from_date);
    to_date = formatDate(to_date);

    const combinedDates = {
      from_date: from_date,
      to_date: to_date
    };

    return combinedDates;
  }

  // Function to calculate the average market cap for a date range
  function calculateAverageMarketCap(data, givenDate, range) {
      // Convert givenDate to a Date object
      let givenDateObj = new Date(givenDate);

      // Initialize variables to store market caps and count
      let totalMarketCap = 0;
      let count = 0;

      // Iterate through the data to find dates within the specified range
      for (let i = 0; i < data.length; i++) {
          let currentDate = new Date(data[i].date);
          let difference = Math.abs(currentDate - givenDateObj) / (1000 * 60 * 60 * 24);

          // Check if the difference is within the specified range
          if (difference <= range) {
              totalMarketCap += data[i].marketCap;
              count++;
          }
      }

      // Calculate the average market cap
      let averageMarketCap = count > 0 ? totalMarketCap / count : 0;
      return averageMarketCap;
    }

    // Function to get market cap for the nearest date
    function getNearestMarketCap(data, givenDate) {
        // Convert givenDate to a Date object for comparison
        let givenDateObj = new Date(givenDate);

        // Initialize variables to store the nearest date and market cap
        let nearestDate;
        let nearestMarketCap;

        // Initialize the minimum difference to a large value
        let minDifference = Number.MAX_SAFE_INTEGER;

        // Iterate through the data to find the nearest date
        for (let i = 0; i < data.length; i++) {
            let currentDate = new Date(data[i].date);
            let difference = Math.abs(currentDate - givenDateObj);

            // Update nearest date and market cap if the current date is closer
            if (difference < minDifference) {
                minDifference = difference;
                nearestDate = data[i].date;
                nearestMarketCap = data[i].marketCap;
            }
        }

        return { date: nearestDate, marketCap: nearestMarketCap };
    }

    // Function to get market cap for a specific date
    function getMarketCapForDate(data, givenDate) {
        let marketCap = null;
        for (let i = 0; i < data.length; i++) {
            if (data[i]['date'] === givenDate) {
                marketCap = data[i].marketCap;
                break;
            }
        }
        return marketCap;
    }

    // Function to combine all market cap data into an object
    function getAllMarketCapData(data, givenDate) {
      console.log(data);
        let marketCapForDate = getMarketCapForDate(data, givenDate);
        let nearestMarketCap = getNearestMarketCap(data, givenDate);
        let averageMarketCap1Day = calculateAverageMarketCap(data, givenDate, 1);
        let averageMarketCap2Days = calculateAverageMarketCap(data, givenDate, 2);
        let averageMarketCap3Days = calculateAverageMarketCap(data, givenDate, 3);
        let averageMarketCap4Days = calculateAverageMarketCap(data, givenDate, 3);
        let averageMarketCap5Days = calculateAverageMarketCap(data, givenDate, 3);

        return {
            marketCapForDate,
            nearestMarketCap,
            averageMarketCap1Day,
            averageMarketCap2Days,
            averageMarketCap3Days,
            averageMarketCap4Days,
            averageMarketCap5Days
        };
    }

    const handleSearch = async () => {
      setCombinedData(null);
      setSearch(true);
      const companyDetailUrl = `https://financialmodelingprep.com/api/v3/profile/${ticker}?apikey=${apiKey}`
      const incomeStatementUrl = `https://financialmodelingprep.com/api/v3/income-statement/${ticker}?period=annual&apikey=${apiKey}`;
      const balanceSheetUrl = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?period=annual&apikey=${apiKey}`;

      try {
        const [companyDetailResponse, incomeStatementResponse, balanceSheetResponse] = await Promise.all([
          fetch(companyDetailUrl),
          fetch(incomeStatementUrl),
          fetch(balanceSheetUrl)
        ]);

        const [companyDetailData, incomeStatementData, balanceSheetData] = await Promise.all([
          companyDetailResponse.json(),
          incomeStatementResponse.json(),
          balanceSheetResponse.json()
        ]);

        const historicalMarketCap = `https://financialmodelingprep.com/api/v3/historical-market-capitalization/${ticker}?limit=${11}&from=${rangeDate(incomeStatementData[0]['date']).from_date}&to=${rangeDate(incomeStatementData[0]['date']).to_date}&apikey=${apiKey}`;

        const historicalMarketCapResponse = await fetch(historicalMarketCap)
        console.log("historicalMarketCapResponse.json():", historicalMarketCapResponse);
        const historicalMarketCapData = await Promise.all([historicalMarketCapResponse.json()]);

        console.log("historicalMarketCapData:", historicalMarketCapData);

        let allMarketCapData = getAllMarketCapData(historicalMarketCapData[0], incomeStatementData[0]['date']);

        const combinedData = {
          incomeStatement: incomeStatementData[0],
          balanceSheet: balanceSheetData[0],
          historicalMarketCap: allMarketCapData,
          companyDetails: companyDetailData[0]
        };
        console.log(combinedData);

        setCombinedData(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setSearch(false);
    };

  return (
    <div className = 'analysis-main'>
    <div className = "container1">
      <h1 className ="mb-4">Financial Data Analysis</h1>
      <div className ="row mb-3">
        <div className ="col">
          <input
            type="text"
            className ="form-control"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter ticker"
          />
        </div>
        <div className ="col">
          <button className ="btn btn-primary" onClick={handleSearch}>Analyse</button>
        </div>
      </div>
      {combinedData ? (
        <div className ="main-container">
          <div className = "company-title">
              <h4>{combinedData.companyDetails['symbol']} - {combinedData.companyDetails['companyName']}</h4>
            </div>
          <div className = "row table-headers">
            <div className = "column"><strong>{combinedData.companyDetails['symbol']}</strong></div>
            <div className = "column"><strong>{"$"} Amount</strong></div>
            <div className = "column"><strong>{"$"} Billion</strong></div>
            <div className = "column"><strong>{"%"} Assets</strong></div>
            <div className = "column"><strong>{"%"} M.Cap</strong></div>
            <div className = "column"><strong>{"%"} Liabilities</strong></div>
            <div className = "column"><strong>{"%"} Revenue</strong></div>
          </div>
          <div className = "table">
            <div className = "row table-title">
              <h4>From Income Statement</h4>
              <span>As of {combinedData.incomeStatement['date']}</span>
            </div>
            <div className ="row red-border">
              <div className ="column column-h">Revenue </div>
              <div className ="column"><strong>{"$" + combinedData.incomeStatement['revenue']}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.incomeStatement['revenue'])}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage(combinedData.incomeStatement['revenue'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateMCapPercentage(combinedData.incomeStatement['revenue'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(combinedData.incomeStatement['revenue'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(combinedData.incomeStatement['revenue'], combinedData)}</strong></div>
            </div>
            <div className ="row">
              <div className ="column column-h">InterestIncome </div>
              <div className ="column"><strong>{"$" + combinedData.incomeStatement['interestIncome']}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.incomeStatement['interestIncome'])}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage(combinedData.incomeStatement['interestIncome'], combinedData)}</strong></div>
              <div className = {"column" + ((calculateMCapPercentage(combinedData.incomeStatement['interestIncome'], combinedData, true) <= 5.0) ? " green" : " red") }
                ><strong>{calculateMCapPercentage(combinedData.incomeStatement['interestIncome'], combinedData)}</strong>
              </div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(combinedData.incomeStatement['interestIncome'], combinedData)}</strong></div>
              <div className = {"column" + ((calculateRevenuePercentage(combinedData.incomeStatement['interestIncome'], combinedData, true) <= 5.0) ? " green" : " red") }
                ><strong>{calculateRevenuePercentage(combinedData.incomeStatement['interestIncome'], combinedData)}</strong>
              </div>
            </div>
            <div className ="row">
              <div className ="column column-h">InterestExpense </div>
              <div className ="column"><strong>{"$" + combinedData.incomeStatement['interestExpense']}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.incomeStatement['interestExpense'])}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage(combinedData.incomeStatement['interestExpense'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateMCapPercentage(combinedData.incomeStatement['interestExpense'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(combinedData.incomeStatement['interestExpense'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(combinedData.incomeStatement['interestExpense'], combinedData)}</strong></div>
            </div>
          </div>
          <div className = "table">
            <div className = "row table-title">
              <h4>From Balance Sheet</h4>
              <span>As of {combinedData.incomeStatement['date']}</span>
            </div>
            <div className ="row">
              <div className ="column column-h">Total Assets </div>
              <div className ="column"><strong>{"$" + combinedData.balanceSheet['totalAssets']}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.balanceSheet['totalAssets'])}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage(combinedData.balanceSheet['totalAssets'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateMCapPercentage(combinedData.balanceSheet['totalAssets'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(combinedData.balanceSheet['totalAssets'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(combinedData.balanceSheet['totalAssets'], combinedData)}</strong></div>
            </div>
            <div className ="row">
              <div className ="column column-h">Interest Bearing Debt </div>
              <div className ="column"><strong>{"$" + combinedData.balanceSheet['totalDebt']}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.balanceSheet['totalDebt'])}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage(combinedData.balanceSheet['totalDebt'], combinedData)}</strong></div>
              <div className = {"column" + ((calculateMCapPercentage(combinedData.balanceSheet['totalDebt'], combinedData, true) <= 30.0) ? " green" : " red") }><strong>{calculateMCapPercentage(combinedData.balanceSheet['totalDebt'], combinedData)}</strong></div>
              <div className = {"column" + ((calculateLiabilitiesPercentage(combinedData.balanceSheet['totalDebt'], combinedData, true) <= 30.0) ? " green" : " red") }><strong>{calculateLiabilitiesPercentage(combinedData.balanceSheet['totalDebt'], combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(combinedData.balanceSheet['totalDebt'], combinedData)}</strong></div>
            </div>
            <div className ="row">
              <div className ="column column-h">Tangilbe Assets </div>
              <div className ="column"><strong>{"$" + sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements)}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements))}</strong></div>
              <div className = {"column" + ((calculateAssetsPercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData, true) >= 95.0) ? " green" : " red") }><strong>{calculateAssetsPercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData)}</strong></div>
              <div className = {"column" + ((calculateMCapPercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData, true) >= 95.0) ? " green" : " red") }><strong>{calculateMCapPercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(sumNonZeroValues(combinedData.balanceSheet, tangilbeFinancialElements), combinedData)}</strong></div>
            </div>
            <div className ="row">
              <div className ="column column-h">Interest Bearing Assets </div>
              <div className ="column"><strong>{"$" + sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements)}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements))}</strong></div>
              <div className = {"column" + ((calculateAssetsPercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData, true) <= 30.0) ? " green" : " red") }><strong>{calculateAssetsPercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData)}</strong></div>
              <div className = {"column" + ((calculateMCapPercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData, true) <= 30.0) ? " green" : " red") }><strong>{calculateMCapPercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage(sumNonZeroValues(combinedData.balanceSheet, interestBearingFinancialElements), combinedData)}</strong></div>
            </div>
          </div>
          <div className = "table">
            <div className = "row table-title">
              <h4>From historical market cap</h4>
              <span>{combinedData.historicalMarketCap.marketCapForDate ? ("As of date "+combinedData.incomeStatement['date']) : ("As of nearest date "+combinedData.historicalMarketCap.nearestMarketCap.date)}</span>
            </div>
            <div className ="row">
              <div className ="column column-h">Market Capitalization </div>
              <div className ="column"><strong>{"$" + (combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap)}</strong></div>
              <div className = "column"><strong>{"$" + dollarsToBillion(combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap)}</strong></div>
              <div className = "column"><strong>{calculateAssetsPercentage((combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateMCapPercentage((combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateLiabilitiesPercentage((combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap), combinedData)}</strong></div>
              <div className = "column"><strong>{calculateRevenuePercentage((combinedData.historicalMarketCap.marketCapForDate || combinedData.historicalMarketCap.nearestMarketCap.marketCap), combinedData)}</strong></div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p>{search ? "Loading data..." : "enter a ticker to search"}</p>
        </div>
      )}
    </div>
    </div>
  );
}

export default Analysis;

