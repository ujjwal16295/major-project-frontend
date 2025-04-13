"use client";

import React, { useState } from "react";

const Documentation = () => {
  const [tech, setTech] = useState("react");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
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
    <div className="min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold text-center mb-4">QR Code API Documentation</h1>

      <div className="flex justify-center space-x-4 mb-6">
        {techOptions.map((option) => (
          <button
            key={option}
            onClick={() => setTech(option)}
            className={`px-4 py-2 border rounded-md ${tech === option ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>

      {Object.keys(codeBlocks).map((key) => (
        <div key={key} className="mb-6 p-4 border rounded-md bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h2>
          <div className="relative">
            <code className="block bg-gray-200 p-2 rounded-md whitespace-pre-wrap">{codeBlocks[key][tech]}</code>
            <button
              onClick={() => handleCopy(codeBlocks[key][tech])}
              className="absolute top-2 right-2 bg-gray-300 px-2 py-1 rounded-md"
            >
              Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documentation;
