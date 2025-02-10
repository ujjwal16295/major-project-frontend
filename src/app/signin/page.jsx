"use client";

import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/service/FirebaseConfig";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.replace("/dashboard"); // Redirect logged-in user to dashboard
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after successful signup
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full p-8 shadow-lg rounded-xl bg-white border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Create an Account</h1>
        <p className="text-gray-600 text-center mb-6">Sign up to get access to our services.</p>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="text-gray-700 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Page;
