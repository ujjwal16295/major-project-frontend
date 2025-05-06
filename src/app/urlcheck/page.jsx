"use client";

import { useState } from 'react';
import { Link2, AlertTriangle, Copy, Shield, CheckCircle } from 'lucide-react';

const UrlSafetyChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const checkUrl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Replace with your actual backend URL
      const BACKEND_URL = 'https://major-project-production-a554.up.railway.app/predicturl';
      
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      console.log(data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check URL safety');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center">
          <div className="inline-flex justify-center items-center p-4 bg-white/20 rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">URL Safety Checker</h1>
          <p className="text-blue-100 mt-2">Verify if a URL is safe or potentially harmful</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="flex items-start p-4 rounded-lg bg-red-50 border border-red-100 text-red-800 mb-6">
              <AlertTriangle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={checkUrl} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-700 font-medium text-sm flex items-center">
                <Link2 size={16} className="mr-2 text-gray-500" />
                URL to Check
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full p-3 pl-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all"
                  placeholder="https://example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking URL...
                </span>
              ) : (
                "Check URL Safety"
              )}
            </button>
          </form>

          {result && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Results</h2>
                <button
                  onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                  className="flex items-center text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-1 px-2 rounded transition-colors"
                >
                  <Copy size={14} className="mr-1" />
                  Copy
                </button>
              </div>
              
              <div className={`p-4 rounded-lg border ${result.is_safe ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {result.is_safe ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <AlertTriangle size={20} className="text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {result.is_safe ? (
                          <span className="text-green-700">Safe</span>
                        ) : (
                          <span className="text-red-700">Potentially Unsafe</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 break-all">{result.url}</p>
                    </div>
                  </div>
                  
                  {/* {!result.is_safe && result.threat_categories && result.threat_categories.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded">
                      <p className="text-sm font-medium text-gray-700 mb-2">Detected Threats:</p>
                      <ul className="space-y-1">
                        {result.threat_categories.map((threat, index) => (
                          <li key={index} className="text-xs text-red-600 flex items-center">
                            <AlertTriangle size={12} className="mr-1 flex-shrink-0" />
                            <span className="capitalize">{threat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Try our{" "}
              <a href="/qr-scanner" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                QR Code Scanner
              </a>
              {" "}for checking links in QR codes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlSafetyChecker;