import React, { useState } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import autoNFTAbi from "./abis/autoNFT.json";
import axios from 'axios';


const MintNFT = () => {
  const [account, setAccount] = useState('');
  const [nftCount, setNftCount] = useState(0);
  const [ipfsHash, setIpfsHash] = useState('');

  const handleMint = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new ethers.Contract('0xB362eB603C20833Ab97043cCd66eaaAC5c729164', autoNFTAbi.abi);
    const contract_web3 = new web3.eth.Contract(autoNFTAbi.abi, "0xB362eB603C20833Ab97043cCd66eaaAC5c729164");
    const ipfsAddress = "";

    // Step 1: Generate image from OpenAI API
    console.log("Fecthing image")
    try {
      console.log("Fecthing image")
      ipfsAddress  = await axios.get('http://localhost:5000/api/fetch-data'); // Request to your backend API
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }


    const txCount = await web3.eth.getTransactionCount(account);
    const tx = {
      from: account,
      to: contract.address,
      value: '0',
      gas: '20000',
      gasPrice: '20',
      nonce: txCount,
      data: contract.interface.encodeFunctionData('safeMint', [account, contract_web3.methods.balanceOf(account).encodeABI(), ipfsAddress]),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, '0xcf0f9c986e261d7a10e4d374be05b1b46d0c0eb7f3619e2b77e3d669bcae2225');
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log(`NFT minted with receipt ${receipt.transactionHash}`);
    setNftCount(nftCount + 1);
  };

  return (
    <div>
      <h1>Mint NFT</h1>
      <label htmlFor="accountInput">Ethereum Account Address:</label>
      <input
        id="accountInput"
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="Enter Ethereum account address"
      />
      <input type="file" id="fileInput" />
      {/* <button onClick={handleIpfsUpload}>Upload to IPFS</button> */}
      <button onClick={handleMint}>Mint NFT</button>
      <p>Account: {account}</p>
      <p>NFT Count: {nftCount}</p>
      <p>IPFS Hash: {ipfsHash}</p>
    </div>
  );
};

export default MintNFT;