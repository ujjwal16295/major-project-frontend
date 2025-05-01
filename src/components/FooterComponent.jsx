"use client";

import React from 'react';
import Link from 'next/link';
import { Shield, Mail, Github, Twitter } from 'lucide-react';

export const FooterComponent = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo & Description */}
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-white/20 p-2 rounded-full mr-3">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-xl">PhishShield</h3>
              <p className="text-blue-100 text-sm">QR Code Analysis API</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="text-blue-100 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/documentation" className="text-blue-100 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="/pricing" className="text-blue-100 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/apikey" className="text-blue-100 hover:text-white transition-colors">
              Get API Key
            </Link>
          </div>
          
          {/* Social Links */}
          <div className="flex space-x-4 mt-6 md:mt-0">
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <Mail size={20} className="text-white" />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <Github size={20} className="text-white" />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <Twitter size={20} className="text-white" />
            </a>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-100 text-sm">
            © {currentYear} PhishShield. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-blue-100 hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;