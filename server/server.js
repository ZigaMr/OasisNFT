// server/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
// import { create } from 'ipfs-http-client';
const { create } = require('ipfs-http-client');

const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const app = express();
const PORT = process.env.PORT || 5000; // Choose any port you prefer

// Enable CORS for all routes
app.use(cors());

// Example route to fetch data from LimeWire API
app.get('/api/fetch-data', async (req, res) => {
    const apiUrl = 'https://api.limewire.com/api/image/generation';
    const apiKey = 'lmwr_sk_kmo8Yls2Yh_ewQpqV8mCUgp4JG6wAzWyjvga0ZYLkWnYpV5x'; // Replace with your LimeWire API key
    console.log("Fetching: api");
    try {
      const response = await axios.post(
        apiUrl,
        {
          prompt: 'A cool nft image',
          aspect_ratio: '1:1',
        },
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-Api-Version': 'v1',
          },
        }
      );
    //   console.log("response: ", response.data);
      const data = await response.data;
  
      if (!data.data || data.data.length === 0) {
        throw new Error('Failed to generate image from LimeWire');
      }
  
      const imageUrl = data.data[0].asset_url; // Assuming OpenAI returns an array of images
    //   console.log(data);
      console.log(data.data[0].asset_url);
      // Upload to ipfs
      try {
        console.log("IPFS")
        const response = await fetch(imageUrl);
        const blob = await response.blob();
    
        const added = await ipfs.add(blob);
        return added.path;
      } catch (error) {
        console.error('Error uploading to IPFS:', error);
        throw error;
      }
      res.json(added.path);

    } catch (error) {
      console.error('Error generating image from LimeWire:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
