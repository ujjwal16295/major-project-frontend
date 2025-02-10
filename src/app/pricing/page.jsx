"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleGetApiKey = () => {
    router.push("/apikey");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl w-full p-8 shadow-lg rounded-xl bg-white border border-gray-200 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
        <p className="text-gray-600 mb-6 text-lg">
          Our API is currently <span className="font-semibold text-green-600">free</span>, but usage is limited to
          <span className="font-semibold"> 100 requests per day</span> per user.
        </p>

        <div className="border border-gray-300 p-6 rounded-lg bg-gray-100 text-gray-800">
          <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
          <p className="text-lg mb-4">✅ 100 API requests per day</p>
          <p className="text-sm text-gray-600">Upgrade options may be available in the future.</p>
        </div>

        <button
          onClick={handleGetApiKey}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
        >
          Get API Key
        </button>
      </div>
    </div>
  );
}
