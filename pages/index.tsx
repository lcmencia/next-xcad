"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next'
import Head from 'next/head' 
import { Typography, Grid, Input, Box, Container, Stack, Toolbar, AppBar } from '@mui/material';

import { fromBech32Address } from '@zilliqa-js/crypto';

import { useFetchCoinGeckoQuery, useFetchZilStreamQuery, useFetchCryptoRankQuery } from '../src/redux/services/priceApi';
import { setAveragePrice } from '../src/redux/services/priceSlice';
import type { RootState } from '../src/redux/store';

/**
 * TODO [Part 1]:
 * Use the '@zilliqa-js/crypto' package to convert a Bech32 address to a Base16 address.
 * Allow the user to enter a Bech32 address, displaying the converted Base16 address on-screen.
 * 
 * Example: 
 *    Bech32 Address: zil1tym3sy8sary2y3lqy56dx4ej9v7fsxku52gl6z
 *    Base16 Address: 0x59371810F0E8c8a247E02534D357322B3c981AdC
 * 
 * 
 * TODO [Part 2]:
 * Using the "price" API, display the current XCAD price on-screen.
 * 
 * 
 * TODO [Part 3]:
 * Using the "balance" API, add button to allow a user to query the balance of any valid Base16 and Bech32 address.
 * Display the balance of the address on the client.
 */

const Home: NextPage = (props) => {
  const dispatch = useDispatch();

  const averagePrice = useSelector((state: RootState) => state.priceReducer.averagePrice);

  const [bech32Address, setBech32Address] = useState('');
  const [base16Address, setBase16Address] = useState('');

  const {
    data: coingeckoPrice,
    isSuccess: isSuccessCoinGecko,
  } = useFetchCoinGeckoQuery();

  const {
    data: zilstreamPrice,
    isSuccess: isSuccessZilStream,
  } = useFetchZilStreamQuery();

  const {
    data: cryptorankPrice,
    isSuccess: isSuccessCryptoRank,
  } = useFetchCryptoRankQuery();

  const isBech32 = (address: string) => {
    const bech32Regex = /^(zil1)[0-9a-z]{38}$/;
    return bech32Regex.test(address);
  };

  const handleConvert = () => {
    if (isBech32(bech32Address)) {
      const convertedAddress = fromBech32Address(bech32Address);
      setBase16Address(convertedAddress);
    } else {
      alert('Invalid Bech32 address');
      setBase16Address('');
    }
  };

  useEffect(() => {
    if (isSuccessCoinGecko && isSuccessZilStream && isSuccessCryptoRank) {
      const average = ((coingeckoPrice + zilstreamPrice + cryptorankPrice) / 3).toFixed(2);
      dispatch(setAveragePrice(Number(average)));
    }
  }, [isSuccessCoinGecko, isSuccessZilStream, isSuccessCryptoRank, coingeckoPrice, zilstreamPrice, cryptorankPrice, dispatch]);
  
  return (
    <Box>
      <AppBar position='fixed'>
        <Container>
          <Toolbar disableGutters sx={{justifyContent:'space-between'}}>
            <Typography variant="h6" component="div" > Address Converter </Typography>
            <Typography>XCAD: {averagePrice ? `${averagePrice}` : '0.00'}</Typography>
          </Toolbar>
        </Container>
      </AppBar>
      
      <Container>
        <Head>
          <title>Address Converter</title>
          <meta name="description" content="Zilliqa Address Converter" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <Stack mt={16} alignItems="center"> 
          <Grid container maxWidth={600} spacing={3}>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder='Bech32 Address'
                value={bech32Address}
                onChange={(e) => setBech32Address(e.target.value)}
                onBlur={handleConvert}
              />
            </Grid>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder='Hex Address'
                value={base16Address}
                readOnly
              />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  )
}

export async function getStaticProps() {
  return {
    props: {
     
    },
    revalidate: 240,
  };
}


export default Home;
