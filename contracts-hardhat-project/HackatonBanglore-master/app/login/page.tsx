"use client";

declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Layout from "@/components/layout";

export default function Login() {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("");

  // Function to switch to Sepolia
  const switchToSepolia = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chain ID
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Chain not added
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                rpcUrls: ["https://rpc.sepolia.org"],
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "SepoliaETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
        }
      } else {
        console.error("Failed to switch to Sepolia:", switchError);
      }
    }
  };

  // Connect wallet and get Sepolia balance
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use this feature.");
        return;
      }

      await switchToSepolia();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      setWalletAddress(address);

      const balanceBigInt = await provider.getBalance(address);
      const ethBalance = ethers.formatEther(balanceBigInt);
      setBalance(ethBalance);
    } catch (error) {
      console.error(error);
      alert("Could not connect to wallet.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-start justify-start px-6 py-10">
        <h1 className="text-4xl font-black mb-10">LOGIN</h1>

        <button
          onClick={connectWallet}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium text-lg"
        >
          Connect to MetaMask
        </button>

        {walletAddress && (
          <div className="mt-10 bg-purple-100 rounded-xl p-6 text-black w-full max-w-lg">
            <p className="font-bold">Wallet Address:</p>
            <p className="break-all mb-4">{walletAddress}</p>

            <p className="font-bold">Sepolia Balance:</p>
            <p>{balance} SepoliaETH</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
