import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('ticker');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [columns, setColumns] = useState([]);

  const apiKey = 'A1mfcGTEDQJ2EcCCzoTs4apytPvHQx4Y';

  const handleSearch = async () => {
    let url = '';
    console.log("searchType:", searchType)
    switch (searchType) {
      case 'company':
        url = `https://financialmodelingprep.com/api/v3/search?query=${searchQuery}&apikey=${apiKey}`;
        break;
      case 'ticker':
        url = `https://financialmodelingprep.com/api/v3/profile/${searchQuery}?apikey=${apiKey}`;
        break;
      case 'name':
        url = `https://financialmodelingprep.com/api/v3/search-name?query=${searchQuery}&limit=${limit}&apikey=${apiKey}`;
        break;
      case 'cik-search':
        url = `https://financialmodelingprep.com/api/v3/cik-search/${searchQuery}?apikey=${apiKey}`;
        break;
      case 'market-capitalization':
        url = `https://financialmodelingprep.com/api/v3/market-capitalization/${searchQuery}?apikey=${apiKey}`;
        break;
      case 'historical-market-capitalization':
        url = `https://financialmodelingprep.com/api/v3/historical-market-capitalization/${searchQuery}?limit=${limit}&from=2023-09-10&to=2023-12-10&apikey=${apiKey}`;
        break;
      case 'income-statement':
        url = `https://financialmodelingprep.com/api/v3/income-statement/${searchQuery}?period=annual&apikey=${apiKey}`;
        break;
      case 'balance-sheet-statement':
        url = `https://financialmodelingprep.com/api/v3/balance-sheet-statement/${searchQuery}?period=annual&apikey=${apiKey}`;
        break;
      case 'cash-flow-statement':
        url = `https://financialmodelingprep.com/api/v3/cash-flow-statement/${searchQuery}?period=annual&apikey=${apiKey}`;
        break;
      default:
        break;
    }

    try {

      const response = await axios.get(url);
      console.log("url:", url, "response:", response);
      console.log("url:", url, "response:", response.data);
      setData(response.data);
      setTotalPages(Math.ceil(response.data.length / limit));
      if (response.data.length > 0) {
        const keys = Object.keys(response.data[0]);
        setColumns(keys);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Financial Data Search</h1>
      <div className="row mb-3">
        <div className="col">
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter search query"
          />
        </div>
        <div className="col">
          <select
            className="form-control"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
        <option value="ticker">Company Details</option>
        <option value="name">Company Ticker Search</option>
        <option value="cik-search">Company CIK Search</option>
        <option value="market-capitalization">Market Capitalization</option>
        <option value="historical-market-capitalization">Historical Market Capitalization</option>
        <option value="income-statement">Income Statement</option>
        <option value="balance-sheet-statement">Balance Sheet Statement</option>
        <option value="cash-flow-statement">Cash Flow Statement</option>
      </select>
      </div>
        <div className="col">
          <input
            type="number"
            className="form-control"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="Limit"
          />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="row">
        <div className="col">
          <button
            className="btn btn-primary mr-2"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-primary ml-2"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
