import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const priceApi = createApi({
  reducerPath: 'priceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    fetchCoinGecko: builder.query<number, void>({
      query: () => `https://api.coingecko.com/api/v3/simple/price?ids=xcad-network&vs_currencies=usd`,
      transformResponse: (response: { 'xcad-network': { usd: number } }) => response['xcad-network'].usd,
    }),
    fetchZilStream: builder.query<number, void>({
      query: () => `https://io-cdn.zilstream.com/chart/aggr/zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y`,
      transformResponse: (response: { value: number }[]) => response[response.length - 1].value,
    }),
    fetchCryptoRank: builder.query<number, void>({
      query: () => `https://api.cryptorank.io/v0/charts/prices-by-coin?keys=xcad-network&days=7`,
      transformResponse: (response: { data: { [key: string]: { timestamps: number[], prices: number[] } } }) => {
        const prices = response.data['xcad-network'].prices;
        const sum = prices.reduce((acc, price) => acc + price, 0);
        return sum / prices.length;
      },
    }),
  }),
});

export const {
  useFetchCoinGeckoQuery,
  useFetchZilStreamQuery,
  useFetchCryptoRankQuery,
} = priceApi;