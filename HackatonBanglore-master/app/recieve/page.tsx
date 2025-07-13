"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import Layout from "@/components/layout";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

export default function ReceivePage() {
  const [selectedToken, setSelectedToken] = useState("Select Token");
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState("0.00");
  const [wallet, setWallet] = useState(null);
  const router = useRouter();

  const tokens = ["ETH", "USDT", "DAI", "MATIC", "BNB"];

  useEffect(() => {
    const connectWalletAndFetchBalance = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const signer = await provider.getSigner();
        setWallet({ provider, signer, address: accounts[0] });

        const balanceWei = await provider.getBalance(accounts[0]);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(parseFloat(balanceEth).toFixed(4));
      } else {
        alert("MetaMask not found.");
      }
    };

    connectWalletAndFetchBalance();
  }, []);

  const handleSelect = (token: string) => {
    setSelectedToken(token);
    setIsOpen(false);
  };

  return (
    <Layout>
      <div className="hero-bg min-h-screen px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 max-w-7xl mx-auto items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-10 w-full max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black mb-2">RECEIVE</h1>

            {/* Spend Funds Card */}
            <div className="p-6 bg-white rounded-2xl shadow-md">
              <h2 className="text-2xl font-bold mb-1">spend funds</h2>
              <p className="text-base text-black">
                spend on gift cards or other purchase
              </p>
              <div className="mt-3 border-b border-black w-full" />
            </div>

            {/* Withdraw Funds Card */}
            <div
              onClick={() => router.push("/withdraw")}
              className="p-6 bg-white rounded-2xl shadow-md cursor-pointer hover:bg-purple-50 transition"
            >
              <h2 className="text-2xl font-bold mb-1">withdraw funds</h2>
              <p className="text-base text-black">
                get funds out of RUMI and into a bank acc, card, UPI to get mobile money
              </p>
              <div className="mt-3 border-b border-black w-full" />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full max-w-md bg-purple-100 p-8 rounded-3xl shadow-md relative mt-2">
            <h2 className="text-2xl font-black mb-2">TOTAL BALANCE</h2>
            <p className="text-3xl font-black mb-4">{balance} ETH</p>

            <div className="h-[152px]" />

            {/* Dropdown */}
            <div
              className="flex items-center justify-between bg-white px-4 py-2 rounded-lg cursor-pointer border border-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="font-bold">{selectedToken}</span>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
              <ul className="absolute bg-white border border-black mt-2 rounded-lg w-full z-10 shadow-lg">
                {tokens.map((token) => (
                  <li
                    key={token}
                    onClick={() => handleSelect(token)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {token}
                  </li>
                ))}
              </ul>
            )}

            <div className="border-b border-black mt-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
