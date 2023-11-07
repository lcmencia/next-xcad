"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { NextPage } from "next";
import Head from "next/head";
import {
  Typography,
  Grid,
  Input,
  Box,
  Container,
  Stack,
  Toolbar,
  AppBar,
  Button,
} from "@mui/material";

import { fromBech32Address } from "@zilliqa-js/crypto";

import type { RootState } from "../src/redux/store";
import { useAveragePrice } from '../src/utils/priceUtils';

const Home: NextPage = (props) => {
  const dispatch = useDispatch();

  useAveragePrice(dispatch);

  const averagePrice = useSelector(
    (state: RootState) => state.priceReducer.averagePrice
  );

  const [bech32Address, setBech32Address] = useState("");
  const [base16Address, setBase16Address] = useState("");
  const [balance, setBalance] = useState("");


  const isBech32 = (address: string) => {
    const bech32Regex = /^(zil1)[0-9a-z]{38}$/;
    return bech32Regex.test(address);
  };

  const handleConvert = () => {
    if (isBech32(bech32Address)) {
      const convertedAddress = fromBech32Address(bech32Address);
      setBase16Address(convertedAddress);
    } else {
      alert("Invalid Bech32 address");
      setBase16Address("");
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const response = await fetch("/api/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("Error fetching balance");
    }
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              Address Converter
            </Typography>
            <Typography>
              XCAD: {averagePrice ? `${averagePrice}` : "0.00"}
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Head>
        <title>Address Converter</title>
        <meta name="description" content="Zilliqa Address Converter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container sx={{ marginTop: "64px" }}>
        {" "}
        <Stack mt={16} alignItems="center">
          <Grid container maxWidth={600} spacing={3}>
            <Grid item xs={6}>
              <Input
                fullWidth
                placeholder="Bech32 Address"
                value={bech32Address}
                onChange={(e) => setBech32Address(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <Button
                onClick={() => handleConvert()}
                variant="contained"
                sx={{ marginTop: "8px" }}
              >
                Convert
              </Button>
            </Grid>
          </Grid>
        </Stack>
        <Grid item xs={12} mt={2}>
          {" "}
          <Input fullWidth value={base16Address} readOnly />
          <Button
            onClick={() => fetchBalance(base16Address)}
            variant="contained"
            sx={{ marginTop: "8px" }}
          >
            Check Balance
          </Button>
          <Typography mt={1}>Balance: {balance}</Typography>{" "}
        </Grid>
      </Container>
    </Box>
  );
};

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 240,
  };
}

export default Home;
