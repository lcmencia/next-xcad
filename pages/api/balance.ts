import type { NextApiRequest, NextApiResponse } from 'next'
import { Zilliqa } from '@zilliqa-js/zilliqa';

const zilliqa = new Zilliqa('https://api.zilliqa.com/');
const tokenAddress = 'zil1z5l74hwy3pc3pr3gdh3nqju4jlyp0dzkhq2f5y';

type RequestData = {
  address: string;
};

type ResponseData = {
  balance: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method === 'POST') {
    try {
      const body: RequestData = req.body;

      const { address } = body;

      const contract = zilliqa.contracts.at(tokenAddress);

      const state = await contract.getState();

      const balance = state.balances[address.toLowerCase()] || null;

      res.status(200).json({ balance });
    } catch (error) {
      console.error('ERROR', error);
      res.status(500).json({ balance: null });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
 