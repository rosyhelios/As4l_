import Layout from "@/components/layout";

export default function FailedPage() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 text-red-700 p-10">
        <h1 className="text-4xl font-bold mb-4">Transaction Failed</h1>
        <p className="text-lg">You have insufficient Sepolia ETH to send this amount.</p>
      </div>
    </Layout>
  );
}
