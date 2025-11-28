const fetch = require('node-fetch');
const fs = require('fs');

const tickers = ["AAPL", "MSFT"]; // plus tard 500 tickers

async function fetchPrices(tickers) {
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join(',')}`;
    const res = await fetch(url, { headers: { "User-Agent": "" } });
    const data = await res.json();
    const prices = {};
    if(data.quoteResponse && data.quoteResponse.result) {
        data.quoteResponse.result.forEach(q => {
            prices[q.symbol] = q.regularMarketPrice;
        });
    }
    return prices;
}

(async () => {
    const prices = await fetchPrices(tickers);
    console.log(prices);

    fs.writeFileSync('prices.json', JSON.stringify(prices, null, 2));
})();

