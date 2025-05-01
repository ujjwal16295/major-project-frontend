"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Clipboard, ClipboardCheck, User, LogOut, Key, Shield, AlertTriangle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="mr-4 p-3 bg-white/20 rounded-lg">
                <Key size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">API Keys Dashboard</h1>
                <p className="text-blue-100 text-sm">Manage your authentication credentials</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
          
          {/* User info */}
          <div className="flex items-center bg-white/10 rounded-lg p-3 mt-2">
            <User size={18} className="text-white mr-2" />
            <span className="text-white text-sm font-medium truncate">{email}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Security notice */}
          <div className="flex items-start p-4 rounded-lg bg-blue-50 border border-blue-100 mb-6">
            <Shield className="text-blue-600 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-sm text-blue-800">
              Your API keys are sensitive credentials. Never share them publicly or include them in client-side code.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 rounded-full border-4 border-t-blue-600 border-r-blue-600 border-b-blue-300 border-l-blue-300 animate-spin mb-4"></div>
              <p className="text-gray-600">Loading your API keys...</p>
            </div>
          ) : error ? (
            <div className="flex items-start p-4 rounded-lg bg-red-50 border border-red-100 text-red-800">
              <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Error loading API keys</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          ) : Object.keys(apiKeys).length > 0 ? (
            <div className="space-y-6">
              <button
                onClick={() => setShowKeys(!showKeys)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {showKeys ? <EyeOff size={18} /> : <Eye size={18} />} {showKeys ? "Hide API Keys" : "Show API Keys"}
              </button>

              <div className="space-y-4">
                {Object.entries(apiKeys).map(([key, count]) => (
                  <div key={key} className="p-4 border border-blue-200 rounded-lg bg-blue-50 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs text-gray-500 font-medium">ACTIVE</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">Usage: </span>
                        <span className="text-xs font-bold bg-blue-600 text-white py-0.5 px-2 rounded-full">{count}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-sm font-mono text-gray-800 w-5/6 overflow-hidden truncate">
                        {showKeys ? key : "•".repeat(Math.min(36, key.length))}
                      </code>
                      <button 
                        onClick={() => handleCopy(key)} 
                        className="p-2 rounded-md hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                        title="Copy API key"
                      >
                        {copiedKey === key ? 
                          <ClipboardCheck size={18} className="text-green-600" /> : 
                          <Clipboard size={18} className="text-blue-600" />
                        }
                      </button>
                    </div>
                    {copiedKey === key && (
                      <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="p-4 bg-gray-100 rounded-full mb-4">
                <Key size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No API Keys Found</h3>
              <p className="text-gray-600 mb-6 text-sm">You haven't generated any API keys yet.</p>
              <a
                href="/apikey"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Generate New API Key
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        {Object.keys(apiKeys).length > 0 && (
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
            <a
              href="/apikey"
              className="w-full block text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Generate Additional API Key
            </a>
          </div>
        )}
      </div>
    </div>
  );
}