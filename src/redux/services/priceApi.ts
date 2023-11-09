import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const priceApi = createApi({
  reducerPath: "price",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getAveragePrice: builder.query<number, void>({
      query: () => "api/price",
      transformResponse: (response: { averagePrice: number }) =>
        Number(response.averagePrice),
    }),
  }),
});

export const { useGetAveragePriceQuery } = priceApi;
