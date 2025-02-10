"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Clipboard, ClipboardCheck } from "lucide-react";

export default function Dashboard() {
  const [email, setEmail] = useState("");
  const [apiKeys, setApiKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showKeys, setShowKeys] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email || "");
        await fetchApiKeys(user.email);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  const fetchApiKeys = async (userEmail) => {
    try {
      const docRef = doc(db, "apikeys", userEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setApiKeys(docSnap.data().usage_counts || {});
      } else {
        setApiKeys({});
      }
    } catch (err) {
      setError("Failed to fetch API keys.");
    }
    setLoading(false);
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full p-8 shadow-lg rounded-xl bg-white border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Your API Keys</h1>
        <p className="text-gray-600 text-center mb-6">
          Here are your API keys along with their usage counts. Keep them secure and do not share them with anyone.
        </p>

        <div className="mb-4">
          <label className="text-gray-700 font-medium">Your Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : Object.keys(apiKeys).length > 0 ? (
          <>
            <button
              onClick={() => setShowKeys(!showKeys)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 mb-4"
            >
              {showKeys ? <EyeOff /> : <Eye />} {showKeys ? "Hide Keys" : "Show Keys"}
            </button>

            <div className="space-y-4">
              {Object.entries(apiKeys).map(([key, count]) => (
                <div key={key} className="flex flex-col p-4 border border-gray-300 rounded-md bg-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="truncate w-5/6 text-gray-800">
                      {showKeys ? key : "••••••••••••••••"}
                    </span>
                    <button onClick={() => handleCopy(key)} className="p-2 rounded-md hover:bg-gray-200">
                      {copiedKey === key ? <ClipboardCheck className="text-green-500" /> : <Clipboard className="text-black"/>}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Usage Count: <span className="font-semibold">{count}</span></p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No API keys found.</p>
            <a
              href="/apikey"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Generate API Key
            </a>
          </div>
        )}

        {/* Logout Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
