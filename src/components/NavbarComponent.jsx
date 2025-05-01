"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/service/FirebaseConfig";
import { Shield, Menu, X, LogIn, User } from "lucide-react";

export default function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Check Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "API Key", path: "/apikey" },
    { name: "Documentation", path: "/documentation" },
    { name: "Pricing", path: "/pricing" },
    { name: "URL Checker", path: "/urlcheck" },
    { name: "QR Checker", path: "/qrchecker" }
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-2 rounded-full">
            <Shield size={24} className="text-white" />
          </div>
          <span className="self-center text-xl font-semibold text-gray-800">PhishShield</span>
        </Link>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Toggle menu</span>
          {isOpen ? (
            <X size={20} className="text-gray-600" />
          ) : (
            <Menu size={20} className="text-gray-600" />
          )}
        </button>

        {/* Menu items */}
        <div 
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto transition-all duration-300 ease-in-out`} 
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 md:mt-0 md:flex-row md:space-x-1">
            {navItems.map(({ name, path }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={`block py-2 px-3 rounded-md transition-all duration-200 
                    ${
                      pathname === path 
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm" 
                        : "text-gray-700 hover:bg-blue-50"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {name}
                </Link>
              </li>
            ))}
            
            {/* Auth button */}
            <li>
              <Link
                href={user ? "/dashboard" : "/login"}
                className={`block py-2 px-3 rounded-md transition-all duration-200 
                  ${
                    pathname === (user ? "/dashboard" : "/login")
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm" 
                      : "text-gray-700 hover:bg-blue-50"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  {user ? (
                    <>
                      <User size={16} className="mr-1" />
                      <span>Dashboard</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} className="mr-1" />
                      <span>Login</span>
                    </>
                  )}
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}