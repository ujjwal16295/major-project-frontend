"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, ClipboardCheck, Key, Shield, AlertTriangle } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleGenerateKey = async () => {
    if (!email) {
      setError("User email is missing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Using fetch instead of axios
      const response = await fetch(`https://major-project-production-a554.up.railway.app/apiKey?email=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        throw new Error("Server error");
      }
      
      const data = await response.json();
      setApiKey(data.api_key);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      setError("Failed to generate API key. Try again later.");
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 flex items-center">
          <div className="mr-4 p-3 bg-white/20 rounded-lg">
            <Key size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">API Key Generator</h1>
            <p className="text-blue-100 text-sm">Secure access to our services</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Info box */}
            <div className="flex items-start p-4 rounded-lg bg-blue-50 border border-blue-100">
              <Shield className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
              <p className="text-sm text-blue-800">
                Your API key is a sensitive credential. It will be shown only once, so make sure to copy and store it securely.
              </p>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm">Your Email Address</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50">
                <input
                  type="email"
                  value={email || "Not logged in"}
                  readOnly
                  className="w-full bg-transparent border-none focus:ring-0 text-gray-700 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Success message */}
            {showSuccess && (
              <div className="flex items-center p-3 rounded-lg bg-green-50 border border-green-100 text-green-800">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">API key generated successfully!</span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center p-3 rounded-lg bg-red-50 border border-red-100 text-red-800">
                <AlertTriangle size={16} className="mr-2 text-red-500" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* API Key display */}
            {apiKey && (
              <div className="space-y-2">
                <label className="text-gray-700 font-medium text-sm">Your API Key</label>
                <div className="flex items-center justify-between p-3 border border-blue-200 rounded-lg bg-blue-50 overflow-hidden">
                  <span className="truncate w-5/6 text-gray-800 text-sm font-mono">{apiKey}</span>
                  <button 
                    onClick={handleCopy}
                    className="p-2 rounded-md transition-all hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {copied ? 
                      <ClipboardCheck size={18} className="text-green-600" /> : 
                      <Clipboard size={18} className="text-blue-600" />
                    }
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-green-600 text-right">Copied to clipboard!</p>
                )}
              </div>
            )}

            {/* Action button */}
            {user ? (
              <button
                onClick={handleGenerateKey}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate API Key"
                )}
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Login to Generate API Key
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}