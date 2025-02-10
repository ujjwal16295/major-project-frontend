"use client";

import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/service/FirebaseConfig";

const Login = () => {
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect after login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg w-full p-8 shadow-lg rounded-xl bg-white border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Sign in to your account</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-gray-700 font-medium">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              required
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label className="text-gray-700 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              required
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
