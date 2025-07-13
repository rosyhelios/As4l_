"use client";
import { useSearchParams } from "next/navigation";
import Layout from "@/components/layout";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const recipient = searchParams.get("to");
  const amount = searchParams.get("amount");

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 text-green-700 p-10">
        <h1 className="text-4xl font-bold mb-4">Transaction Successful</h1>
        <p className="text-lg">
          You sent <strong>{amount} ETH</strong> to <br />
          <span className="font-mono break-words">{recipient}</span>
        </p>
      </div>
    </Layout>
  );
}
