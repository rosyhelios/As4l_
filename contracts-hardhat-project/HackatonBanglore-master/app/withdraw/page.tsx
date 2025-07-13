"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const [inrAmount, setInrAmount] = useState("");
  const [ethRate] = useState(80000); // 1 ETH = ₹80,000
  const [requiredEth, setRequiredEth] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("Connecting...");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        setStatus("❌ MetaMask not found.");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const signer = await provider.getSigner();
        const balanceWei = await provider.getBalance(accounts[0]);
        const ethBalance = parseFloat(ethers.formatEther(balanceWei));

        setWallet({ provider, signer, address: accounts[0] });
        setWalletBalance(ethBalance);
        setStatus(`Wallet connected: ${accounts[0]}`);
      } catch (err) {
        console.error(err);
        setStatus("❌ Could not connect wallet.");
      }
    };

    connectWallet();
  }, []);

  // Live INR ➜ ETH conversion
  useEffect(() => {
    const inr = parseFloat(inrAmount);
    if (!isNaN(inr) && inr > 0) {
      const eth = inr / ethRate;
      setRequiredEth(parseFloat(eth.toFixed(6)));
    } else {
      setRequiredEth(0);
    }
  }, [inrAmount, ethRate]);

  // Simulated transaction on Withdraw
  const handleWithdraw = async () => {
    setError("");
    setSuccessMsg("");

    if (!wallet) {
      setError("Please connect your wallet.");
      return;
    }

    const eth = parseFloat(requiredEth.toString());

    if (walletBalance < eth || eth === 0) {
      setError("❌ Not enough balance to withdraw.");
      return;
    }

    // Simulate transaction (you could send a real tx here later)
    try {
      setStatus("🔄 Processing withdrawal...");
      await new Promise((res) => setTimeout(res, 2000));

      setSuccessMsg(`✅ Withdrawal of ₹${inrAmount} (~${eth} ETH) simulated successfully!`);
      setStatus("✅ Transaction complete.");
    } catch (err) {
      console.error(err);
      setError("❌ Transaction failed.");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center text-gray-800 px-4">
        <h1 className="text-3xl font-bold mb-4">Withdraw Funds</h1>
        <p className="text-md mb-6">{status}</p>

        <div className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full">
          <label className="block mb-2 font-semibold">Enter INR amount:</label>
          <input
            type="number"
            placeholder="e.g. 1000"
            value={inrAmount}
            onChange={(e) => setInrAmount(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
          />

          <p className="text-sm mb-4 text-gray-700">
            Required ETH: <strong>{requiredEth > 0 ? requiredEth + " ETH" : "--"}</strong>
          </p>

          <button
            onClick={handleWithdraw}
            className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-700 transition"
          >
            Withdraw
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          {successMsg && (
            <p className="mt-4 text-sm text-green-600 font-medium">{successMsg}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
