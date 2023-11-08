import type { NextApiRequest, NextApiResponse } from "next";

async function fetchCoinGecko() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=usd"
  );
  const data = await response.json();
  return data["xcad-network"].usd;
}

async function fetchZilStream() {
  const response = await fetch(
    "https://io-cdn.zilstream.com/chart/aggr/zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y"
  );
  const data = await response.json();
  return data[data.length - 1].value;
}

async function fetchCryptoRank() {
  const response = await fetch(
    "https://api.cryptorank.io/v0/charts/prices-by-coin?keys=xcad-network&days=7"
  );
  const data = await response.json();
  const prices = data.data["xcad-network"].prices;
  const sum = prices.reduce((acc: number, price: number) => acc + price, 0);
  return sum / prices.length;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [coingeckoPrice, zilStreamPrice, cryptoRankPrice] = await Promise.all(
      [fetchCoinGecko(), fetchZilStream(), fetchCryptoRank()]
    );
    const prices = [coingeckoPrice, zilStreamPrice, cryptoRankPrice].filter(
      (price): price is number => typeof price === "number"
    );
    if (prices.length === 3) {
      const averagePrice = ((prices[0] + prices[1] + prices[2]) / 3).toFixed(2);
      res.status(200).json({ averagePrice });
    }
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" });
  }
}
