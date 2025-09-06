"use client";

import { useHabit } from "../context/HabitContext";

export default function LandingPage() {
  const { setPage } = useHabit();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to Zenetic Mind</h1>
      <p className="text-xl mb-8">
        A new way to build and track micro-habits for a better you.
      </p>
      <button
        onClick={() => setPage("onboarding")}
        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Get Started
      </button>
    </div>
  );
}
