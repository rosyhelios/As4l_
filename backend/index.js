require('dotenv').config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { JsonRpcProvider, Wallet, Contract } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize provider and wallet
const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);

// Load ABIs
const usdcAbiPath = path.join(__dirname, "abi", "TestUSDC.json");
const transferAbiPath = path.join(__dirname, "abi", "SecureUSDCTransfer.json");

const usdcAbi = JSON.parse(fs.readFileSync(usdcAbiPath)).abi;
const transferAbi = JSON.parse(fs.readFileSync(transferAbiPath)).abi;

// Initialize contracts
const usdc = new Contract(process.env.USDC_CONTRACT_ADDRESS, usdcAbi, wallet);
const transfer = new Contract(process.env.TRANSFER_CONTRACT_ADDRESS, transferAbi, wallet);

// Routes

// Get USDC balance of an address
app.get("/balance/:address", async (req, res) => {
  try {
    const balance = await usdc.balanceOf(req.params.address);
    res.json({ balance: balance.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch balance." });
  }
});

// Get all whitelisted addresses
app.get("/whitelist", async (req, res) => {
  try {
    const addresses = await transfer.getWhitelistedAddresses();
    res.json({ whitelist: addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch whitelist." });
  }
});

// Get total fees collected by the contract
app.get("/fees", async (req, res) => {
  try {
    const fees = await transfer.getTotalFeesCollected();
    res.json({ fees: fees.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch fees." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
