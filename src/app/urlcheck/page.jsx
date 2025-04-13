"use client"
import { useState } from 'react';

const Page = () => {
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
      console.log(data)
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
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-4">URL Safety Checker</h1>
      
      <div className="mb-6 p-4 border rounded-md bg-gray-100">
        <form onSubmit={checkUrl} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-xl font-semibold mb-2">
              URL to Check
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 transition duration-200"
          >
            {loading ? 'Checking...' : 'Check URL Safety'}
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 border rounded-md bg-red-100 text-red-700">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={`mb-6 p-4 border rounded-md ${result.is_safe ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <button
              onClick={() => handleCopy(JSON.stringify(result, null, 2))}
              className="bg-gray-300 px-2 py-1 rounded-md hover:bg-gray-400"
            >
              Copy
            </button>
          </div>
          
          <div className="rounded-md p-4 bg-white shadow-sm">
            <div className="mb-3">
              <span className="font-medium">URL:</span> {result.url}
            </div>
            
            <div className="mb-3">
              <span className="font-medium">Safety Status:</span>{' '}
              {result.is_safe ? (
                <span className="text-green-600 font-bold">Safe</span>
              ) : (
                <span className="text-red-600 font-bold">Potentially Unsafe</span>
              )}
            </div>
            
            {!result.is_safe && result.threat_categories && result.threat_categories.length > 0 && (
              <div>
                <span className="font-medium">Detected Threats:</span>
                <ul className="list-disc list-inside mt-2">
                  {result.threat_categories.map((threat, index) => (
                    <li key={index} className="text-red-600 capitalize">{threat}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;

