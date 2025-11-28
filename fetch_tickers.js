// fetch_tickers.js
import fetch from "node-fetch";
import fs from "fs";

async function fetchPrices(tickers) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join(",")}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });

  const text = await response.text();

  // Vérification du contenu pour éviter JSON.parse sur une page HTML
  if (!text.startsWith("{")) {
    throw new Error("Réponse non JSON de Yahoo (probablement Too Many Requests):\n" + text.substring(0, 200));
  }

  const data = JSON.parse(text);

  if (!data.quoteResponse || !data.quoteResponse.result) {
    throw new Error("Structure Yahoo inattendue. Contenu:\n" + text.substring(0, 200));
  }

  return data.quoteResponse.result;
}

async function main() {
  // LISTE TEST — on augmentera plus tard
  const tickers = ["AAPL", "MSFT"];

  try {
    const prices = await fetchPrices(tickers);

    fs.writeFileSync("prices.json", JSON.stringify(prices, null, 2));
    console.log("Prix sauvegardés dans prices.json");
  } catch (err) {
    console.error("Erreur:", err.message);
    process.exit(1);
  }
}

main();
