"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/service/FirebaseConfig";

export default function NavbarComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname(); // ✅ Get current path dynamically

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
    {name:"urlChecker",path:"/urlcheck"}
  ];

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <Image src="/shopping.svg" alt="Flowbite Logo" width={32} height={32} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">PhishShield</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {navItems.map(({ name, path }) => (
              <li key={name}>
                <Link
                  href={path}
                  className={`block py-2 px-3 rounded-sm transition-colors duration-300 
                    ${pathname === path ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  {name}
                </Link>
              </li>
            ))}
            {user ? (
              <li>
                <Link
                  href="/dashboard"
                  className={`block py-2 px-3 rounded-sm transition-colors duration-300 
                    ${pathname === "/dashboard" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  Dashboard
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`block py-2 px-3 rounded-sm transition-colors duration-300 
                    ${pathname === "/login" ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
