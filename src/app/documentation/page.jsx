"use client";

import React, { useState } from "react";
import { Code, Copy, BookOpen, CheckCircle } from "lucide-react";

const Documentation = () => {
  const [tech, setTech] = useState("react");
  const [copiedSection, setCopiedSection] = useState(null);

  const handleCopy = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const techOptions = ["react", "vue", "angular"];

  const codeBlocks = {
    npm: {
      react: "npm install jsqr axios",
      vue: "npm install jsqr axios",
      angular: "npm install jsqr axios",
    },
    extractLinkFromPath: {
      react: `import jsQR from 'jsqr';\n\nasync function extractLinkFromImagePath(imagePath) {\n  const img = new Image();\n  img.src = imagePath;\n  await img.decode();\n  const canvas = document.createElement('canvas');\n  const ctx = canvas.getContext('2d');\n  canvas.width = img.width;\n  canvas.height = img.height;\n  ctx.drawImage(img, 0, 0, img.width, img.height);\n  const imageData = ctx.getImageData(0, 0, img.width, img.height);\n  return jsQR(imageData.data, img.width, img.height)?.data || null;\n}`,
      vue: `import jsQR from 'jsqr';\n\nexport async function extractLinkFromImagePath(imagePath) {\n  const img = new Image();\n  img.src = imagePath;\n  await img.decode();\n  const canvas = document.createElement('canvas');\n  const ctx = canvas.getContext('2d');\n  canvas.width = img.width;\n  canvas.height = img.height;\n  ctx.drawImage(img, 0, 0, img.width, img.height);\n  const imageData = ctx.getImageData(0, 0, img.width, img.height);\n  return jsQR(imageData.data, img.width, img.height)?.data || null;\n}`,
      angular: `import jsQR from 'jsqr';\n\nexport async function extractLinkFromImagePath(imagePath: string): Promise<string | null> {\n  const img = new Image();\n  img.src = imagePath;\n  await img.decode();\n  const canvas = document.createElement('canvas');\n  const ctx = canvas.getContext('2d');\n  canvas.width = img.width;\n  canvas.height = img.height;\n  ctx.drawImage(img, 0, 0, img.width, img.height);\n  const imageData = ctx.getImageData(0, 0, img.width, img.height);\n  return jsQR(imageData.data, img.width, img.height)?.data || null;\n}`,
    },
    sendRequest: {
      react: `import axios from 'axios';\n\nasync function sendToBackend(url, email, api_key) {\n  try {\n    const response = await axios.post('https://major-project-production-a554.up.railway.app/predict', { url, email, api_key });\n    return response.data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}`,
      vue: `import axios from 'axios';\n\nexport async function sendToBackend(url, email, api_key) {\n  try {\n    const response = await axios.post('https://major-project-production-a554.up.railway.app/predict', { url, email, api_key });\n    return response.data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}`,
      angular: `import axios from 'axios';\n\nexport async function sendToBackend(url: string, email: string, api_key: string): Promise<any> {\n  try {\n    const response = await axios.post('https://major-project-production-a554.up.railway.app/predict', { url, email, api_key });\n    return response.data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}`,
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center">
          <div className="inline-flex justify-center items-center p-4 bg-white/20 rounded-full mb-4">
            <BookOpen size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">QR Code API Documentation</h1>
          <p className="text-blue-100 mt-2">Integrate our QR code scanning and analysis into your application</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Choose your framework:</h2>
            <div className="flex space-x-3 mb-6">
              {techOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setTech(option)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    tech === option 
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-blue-50 text-gray-700 hover:bg-blue-100"
                  }`}
                >
                  {option.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {Object.keys(codeBlocks).map((key) => (
              <div key={key} className="rounded-lg overflow-hidden shadow-md border border-blue-100">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                  <div className="flex items-center">
                    <Code size={20} className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">
                      {key === "npm" 
                        ? "Installation" 
                        : key === "extractLinkFromPath" 
                        ? "Extract Link from QR Code" 
                        : "Send Request to API"}
                    </h3>
                  </div>
                </div>
                <div className="bg-gray-50 relative">
                  <pre className="p-4 overflow-x-auto text-sm">
                    <code className="text-gray-800">{codeBlocks[key][tech]}</code>
                  </pre>
                  <button
                    onClick={() => handleCopy(codeBlocks[key][tech], key)}
                    className="absolute top-3 right-3 bg-white hover:bg-gray-100 p-2 rounded-md shadow-sm transition-all border border-gray-200"
                  >
                    {copiedSection === key ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : (
                      <Copy size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="p-6 rounded-lg bg-blue-50 border border-blue-100">
              <h3 className="font-semibold text-gray-800 mb-2">Need an API key?</h3>
              <p className="text-gray-700 mb-4">Get your free API key to start using our QR code API services.</p>
              <a
                href="/pricing"
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow-md"
              >
                View Pricing
              </a>
            </div>

            <p className="text-sm text-gray-600 text-center mt-6">
              Need help with implementation?{" "}
              <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;