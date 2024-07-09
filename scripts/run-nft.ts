// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import { ethers } from 'hardhat';

async function main() {
  const signer = await ethers.provider.getSigner();
  const NFT = await ethers.getContractFactory('autoNFT');
  const contract_nft = await NFT.deploy(signer);
  console.log('NFT deployed to:', await contract_nft.getAddress());

  const tx = await contract_nft.safeMint(
    "0x8eAb9988eCe1aD6D098A47456074D55aaDf88023",
    0,
    "MyURI"
  );
  console.log("Waiting...");
  await tx.wait();

  await new Promise((resolve) => setTimeout(resolve, 30_000));
  console.log('Checking token URI');
  const URI = await contract_nft.tokenURI(0); // URI
  console.log("Token URI: ", URI);

  const balance = await contract_nft.balanceOf("0x8eAb9988eCe1aD6D098A47456074D55aaDf88023"); // URI
  console.log("Token balance: ", balance);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});