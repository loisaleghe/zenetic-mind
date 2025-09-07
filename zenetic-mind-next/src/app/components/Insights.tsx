"use client";

import { useHabit } from "../context/HabitContext";

export default function Insights() {
  const { streak, habitData, setPage } = useHabit();

  const getMotivationalMessage = () => {
    if (streak === 0) {
      return "Every new beginning starts with a single step. You can do it!";
    }
    if (streak < 7) {
      return `You're building momentum! Keep it up for ${streak} days.`;
    }
    return `Wow, ${streak} days in a row! You are on a roll. Keep pushing forward!`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8 text-black">Your Progress</h1>

      <div className="w-full max-w-md text-center space-y-6 text-white">
        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Current Habit</h2>
          <p className="text-lg mt-2">{habitData?.name || "No habit set"}</p>
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Current Streak</h2>
          <p className="text-5xl font-bold mt-2">{streak} days</p>
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Motivational Message</h2>
          <p className="text-lg mt-2 italic text-gray-600">
            {getMotivationalMessage()}
          </p>
        </div>

        <button
          onClick={() => setPage("dashboard")}
          className="w-full mt-8 py-3 blue-gradient-button text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
