import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);

const tokenAddress = "0xCfD9F58d0E9F035890DB489B9785d5c230Da01Ba";
const tokenAbi = [
  "function approve(address spender, uint256 amount) public returns (bool)",
];
export const tokenApprove = async (spenderAddress: string, amount: ethers.BigNumberish) => {
  try {
    const privateKey = 'YOUR_PRIVATE_KEY';
    const wallet = new ethers.Wallet(privateKey, provider);

    const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, wallet);

    const tx = await tokenContract.approve(spenderAddress, amount);
    await tx.wait();
    console.log(`Approval successful: ${tx.hash}`);
  } catch (error) {
    console.error(`Approval failed: ${error}`);
  }
};

// Example usage
tokenApprove("0xSpenderAddressHere", "1000000000000000000");
