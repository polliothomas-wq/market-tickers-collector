const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchPrices() {
  const url =
    "https://query2.finance.yahoo.com/v7/finance/quote?symbols=AAPL,MSFT";

  const res = await fetch(url);

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    return json.quoteResponse?.result || [];
  } catch (err) {
    console.error("Réponse brute reçue:", text);
    throw err;
  }
}

(async () => {
  try {
    const data = await fetchPrices();
    console.log("Données récupérées :", data);
  } catch (err) {
    console.error("Erreur :", err);
    process.exit(1);
  }
})();
