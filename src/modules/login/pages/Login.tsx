"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiLock, FiMail, FiAlertCircle } from "react-icons/fi";
import clsx from "clsx";
import { useAuthStore } from "../stores/useAuthStore";
import { TEST_CREDENTIALS } from "@/constants/testCredentials";
import { ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();

  // Use the auth store
  const { login, isAuthenticated } = useAuthStore();

  // Fill test credentials on first load (helpful for evaluators)
  useEffect(() => {
    // Uncomment to auto-fill credentials
    // setEmail(TEST_CREDENTIALS.email);
    // setPassword(TEST_CREDENTIALS.password);
  }, []);

  // If already authenticated, redirect to main page
  if (isAuthenticated) {
    return <Navigate to={ROUTES.TRANSACTIONS} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // For a technical test, restrict login to only the test credentials
      if (
        email === TEST_CREDENTIALS.email &&
        password === TEST_CREDENTIALS.password
      ) {
        await login(email, password);
        navigate(ROUTES.TRANSACTIONS); // Navigate to the main page after login
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid credentials. Please use the test account credentials.");
    } finally {
      setLoading(false);
    }
  };

  const toggleShowCredentials = () => {
    setShowCredentials(!showCredentials);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">TransactSign</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage your real estate transactions
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-800">
              Sign In
            </h2>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600">
                <FiAlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={toggleShowCredentials}
                    className="mt-1 font-medium underline hover:text-red-700"
                  >
                    {showCredentials
                      ? "Hide test credentials"
                      : "Show test credentials"}
                  </button>
                  {showCredentials && (
                    <div className="mt-2 rounded bg-white p-2 text-gray-700">
                      <p>
                        <strong>Email:</strong> {TEST_CREDENTIALS.email}
                      </p>
                      <p>
                        <strong>Password:</strong> {TEST_CREDENTIALS.password}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder={TEST_CREDENTIALS.email}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className={clsx(
                    "flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    loading && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {loading ? "Signing in..." : "Sign in to TransactSign"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 TransactSign. All rights reserved.</p>
          <p className="mt-2 text-xs text-gray-400">
            This is a technical demo for transaction management and e-signature
            functionality.
          </p>
        </div>
      </div>
    </div>
  );
}
