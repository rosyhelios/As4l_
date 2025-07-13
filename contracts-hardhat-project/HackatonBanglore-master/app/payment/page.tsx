"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Layout from "@/components/layout";
import { ethers } from "ethers";

export default function payment() {
  const [fromAmount, setFromAmount] = useState("");
  const [status, setStatus] = useState("Not connected");
  const [wallet, setWallet] = useState(null);
  const [recipient, setRecipient] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const recipientParam = searchParams.get("to");
    if (recipientParam) {
      setRecipient(recipientParam);
    }
  }, [searchParams]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const signer = await provider.getSigner();
        setWallet({ provider, signer, address: accounts[0] });
        setStatus("Wallet connected: " + accounts[0]);
      } catch (err) {
        setStatus("Connection failed");
        console.error(err);
      }
    } else {
      alert("MetaMask not found");
    }
  };

  const simulateSwap = async () => {
    if (!wallet) {
      setStatus("Please connect wallet first.");
      return;
    }

    try {
      setStatus("Checking balance...");

      const balance = await wallet.provider.getBalance(wallet.address);
      const balanceInEth = parseFloat(ethers.formatEther(balance));
      const ethToSend = parseFloat(fromAmount);

      if (isNaN(ethToSend) || ethToSend <= 0) {
        setStatus("Please enter a valid ETH amount.");
        return;
      }

      if (balanceInEth < ethToSend) {
        setStatus("Insufficient balance.");
        router.push("/failed"); // redirect to failed page
      } else {
        setStatus("Transaction successful!");
        router.push(`/success?to=${encodeURIComponent(recipient)}&amount=${ethToSend}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen hero-bg -mt-20 pt-28 px-6 md:px-12">
        <h1 className="text-3xl md:text-5xl font-black text-black mb-6">Send ETH</h1>

        <p className="text-md text-gray-800 mb-4">{status}</p>

        <button
          onClick={connectWallet}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded mb-6"
        >
          Connect Wallet
        </button>

        <div className="bg-purple-100 p-8 rounded-2xl max-w-3xl mx-auto shadow-md">
          {recipient && (
            <div className="mb-4 text-md text-black font-medium">
              Sending to: <span className="text-purple-800 break-all">{recipient}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 mb-6">
            <label className="text-black font-medium">ETH Amount:</label>
            <input
              type="number"
              placeholder="Enter ETH amount"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="md:col-span-2 w-full p-3 rounded-md bg-white text-black border border-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={simulateSwap}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-md transition"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
