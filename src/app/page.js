"use client";

import Link from "next/link";
import { BookOpen, Key, Shield, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl bg-white mb-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center">
          <div className="inline-flex justify-center items-center p-4 bg-white/20 rounded-full mb-4">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to PhishShield</h1>
          <p className="text-blue-100 mt-2 max-w-2xl mx-auto">
            PhishShield provides seamless QR code detection and link extraction from images.
            Developers can easily integrate our API into their applications to analyze QR codes in real-time.
          </p>
        </div>

        {/* How It Works Section */}
        <div className="p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-flex justify-center items-center p-2 bg-blue-100 rounded-full mr-2">
              <Shield size={18} className="text-blue-600" />
            </span>
            How It Works
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <span className="font-semibold text-blue-600">1</span>
              </div>
              <p className="text-gray-700">Upload an image containing a QR code</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <span className="font-semibold text-blue-600">2</span>
              </div>
              <p className="text-gray-700">Our API extracts and decodes the QR data</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <span className="font-semibold text-blue-600">3</span>
              </div>
              <p className="text-gray-700">Use the extracted link for redirections or further processing</p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-start">
              <div className="bg-blue-100 rounded-full p-2 mr-3 flex-shrink-0">
                <span className="font-semibold text-blue-600">4</span>
              </div>
              <p className="text-gray-700">Fast, reliable, and easy-to-integrate for developers</p>
            </div>
          </div>
          
          {/* CTA Boxes */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/documentation" className="block">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-200 rounded-full mr-3">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Documentation</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Explore how to integrate and use the API in your project
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  View documentation
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/apikey" className="block">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-200 rounded-full mr-3">
                    <Key size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Get API Key</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Register and generate your API key to start using PhishShield
                </p>
                <div className="flex items-center text-blue-600 font-medium">
                  Get your key
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Ready to get started?</h3>
              <p className="text-gray-700 mb-4">Check out our pricing plans to see what works best for your needs.</p>
              <Link 
                href="/pricing" 
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all shadow-sm hover:shadow-md"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}