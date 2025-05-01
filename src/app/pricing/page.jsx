"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Zap, CheckCircle } from "lucide-react";

export default function Pricing() {
  const router = useRouter();

  const handleGetApiKey = () => {
    router.push("/apikey");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center">
          <div className="inline-flex justify-center items-center p-4 bg-white/20 rounded-full mb-4">
            <CreditCard size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Pricing</h1>
          <p className="text-blue-100 mt-2">Our API is currently free with usage limits</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex items-center mb-4">
                <Zap size={24} className="text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-800">Free Plan</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    <span className="font-semibold">100</span> API requests per day
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    Full access to all features
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    No credit card required
                  </p>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Upgrade options may be available in the future.
              </p>
            </div>

            <button
              onClick={handleGetApiKey}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            >
              Get API Key
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Need help with your API usage?{" "}
              <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}