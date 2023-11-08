import { setAveragePrice } from '../redux/services/priceSlice';
import { useEffect } from 'react';
import {
  useFetchCoinGeckoQuery,
  useFetchZilStreamQuery,
  useFetchCryptoRankQuery,
} from '../../pages/api/price';

export function useAveragePrice(dispatch: any) {
  const { data: coingeckoPrice, isSuccess: isSuccessCoinGecko } = useFetchCoinGeckoQuery();
  const { data: zilstreamPrice, isSuccess: isSuccessZilStream } = useFetchZilStreamQuery();
  const { data: cryptorankPrice, isSuccess: isSuccessCryptoRank } = useFetchCryptoRankQuery();

  useEffect(() => {
    if (isSuccessCoinGecko && isSuccessZilStream && isSuccessCryptoRank) {
      const prices = [coingeckoPrice, zilstreamPrice, cryptorankPrice].filter((price): price is number => typeof price === 'number');
      if (prices.length === 3) {
        const average = (
          (prices[0] + prices[1] + prices[2]) /
          3
        ).toFixed(2);
        dispatch(setAveragePrice(Number(average)));
      }
    }
  }, [
    isSuccessCoinGecko,
    isSuccessZilStream,
    isSuccessCryptoRank,
    coingeckoPrice,
    zilstreamPrice,
    cryptorankPrice,
    dispatch,
  ]);
}
