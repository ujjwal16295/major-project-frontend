"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, ClipboardCheck } from "lucide-react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Page() {
  const [email, setEmail] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
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
      const response = await axios.get("https://major-project-production-a554.up.railway.app/apiKey", {
        params: { email },
      });
      setApiKey(response.data.api_key);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full p-8 shadow-lg rounded-xl bg-white border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Get Your API Key</h1>
        <p className="text-gray-600 text-center mb-6">
          Generate a secure API key to access our services. This key will be shown only once, so make sure to copy and store it safely.
        </p>

        <div className="space-y-4">
          <label className="text-gray-700 font-medium">Your Email</label>
          <input
            type="email"
            value={email || "Not logged in"}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          />

          {user ? (
            <button
              onClick={handleGenerateKey}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-blue-400"
            >
              {loading ? "Generating..." : "Generate API Key"}
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg"
            >
              Login to Generate API Key
            </button>
          )}

          {error && <p className="text-red-500 text-center">{error}</p>}

          {apiKey && (
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-100">
              <span className="truncate w-5/6 text-gray-800">{apiKey}</span>
              <button onClick={handleCopy} className="hover:bg-gray-200 p-2 rounded-md">
                {copied ? <ClipboardCheck className="text-green-500" /> : <Clipboard className="text-black" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
