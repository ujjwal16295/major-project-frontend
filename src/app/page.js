"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to PhishShield</h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
        PhishShield provides seamless QR code detection and link extraction from images. 
          Developers can easily integrate our API into their applications to analyze QR codes in real-time.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-12 px-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">How It Works</h2>
        <ul className="list-disc list-inside space-y-3 text-gray-700">
          <li>Upload an image containing a QR code.</li>
          <li>Our API extracts and decodes the QR data.</li>
          <li>Use the extracted link for redirections or further processing.</li>
          <li>Fast, reliable, and easy-to-integrate for developers.</li>
        </ul>
      </section>

      {/* CTA Boxes */}
      <section className="py-16 px-6 flex justify-center space-x-6">
        {/* Documentation Box */}
        <Link href="/documentation">
          <div className="p-6 w-72 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-600">📖 Documentation</h3>
            <p className="text-gray-700 mt-2">
              Explore how to integrate and use the API in your project.
            </p>
          </div>
        </Link>

        {/* API Key Box */}
        <Link href="/apikey">
          <div className="p-6 w-72 bg-white rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105">
            <h3 className="text-xl font-semibold text-green-600">🔑 Get API Key</h3>
            <p className="text-gray-700 mt-2">
              Register and generate your API key to start using PhishShield.
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
