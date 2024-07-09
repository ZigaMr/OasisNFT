import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { ethers } from 'ethers';
import autoNFTAbi from "./abis/autoNFT.json";


const NFTGallery = () => {
  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const web3 = new Web3(window.ethereum);
    // const contract = new ethers.Contract('0xB362eB603C20833Ab97043cCd66eaaAC5c729164', autoNFTAbi.abi);
    const contractAddress = "0xB362eB603C20833Ab97043cCd66eaaAC5c729164";
    if (!account) {
      console.error("No Ethereum account found");
      return;
    }
    const fetchNFTs = async () => {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(autoNFTAbi.abi, contractAddress);
      const nftCount = await web3.eth.call({
        to: contractAddress,
        data: contract.methods.balanceOf(account).encodeABI(),
      });
      console.log(nftCount);
      const nfts = [];
      for (let i = 0; i < nftCount; i++) {
        const nft = await web3.eth.call({
          to: contractAddress,
          data: contract.methods.tokenOfOwnerByIndex(account, i).encodeABI(),
        });
        nfts.push(nft);
      }
      setNfts(nfts);
    };
    fetchNFTs();
  }, [account]);

  return (
    <div>
      <h1>NFT Gallery</h1>
      <label htmlFor="accountInput">Ethereum Account Address:</label>
      <input
        id="accountInput"
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="0x5713205c59B5ec4a7Db50B9E15598fc122B96CA9"
      />
      <ul>
        {nfts.map((nft, index) => (
          <li key={index}>
            <img src={`https://ipfs.infura.io/ipfs/${nft}`} alt={`NFT ${index}`} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NFTGallery;