const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchPrices() {
  // Liste test — on augmentera plus tard
  const tickers = ["AAPL", "MSFT"];
  const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${tickers.join(",")}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    }
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (!json.quoteResponse || !json.quoteResponse.result) {
      throw new Error("Yahoo a renvoyé un format inattendu");
    }
    return json.quoteResponse.result;
  } catch (err) {
    console.error("Réponse brute reçue (premiers 300 caractères) :", text.substring(0, 300));
    throw err;
  }
}

(async () => {
  try {
    const data = await fetchPrices();

    if (data.length === 0) {
      console.warn("⚠️ Aucun ticker récupéré !");
    } else {
      fs.writeFileSync("prices.json", JSON.stringify(data, null, 2));
      console.log(`✅ prices.json créé avec succès ! ${data.length} tickers récupérés`);
    }
  } catch (err) {
    console.error("Erreur :", err);
    process.exit(1);
  }
})();
