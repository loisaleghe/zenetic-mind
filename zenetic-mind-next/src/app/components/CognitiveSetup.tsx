"use client";

import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const blockers = [
  "I don't have time.",
  "I'm too tired.",
  "It's not important.",
  "I don't have one",
];

export default function CognitiveSetup() {
  const { setPage, setBlocker } = useHabit();
  const [selectedBlocker, setSelectedBlocker] = useState("");
  const [customBlocker, setCustomBlocker] = useState("");

  const handleStart = () => {
    const blocker = customBlocker || selectedBlocker;
    if (blocker) {
      setBlocker(blocker);
      setPage("dashboard");
    } else {
      alert("Please select or add a blocker.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
      <h1 className="text-4xl font-bold text-black">Cognitive Setup</h1>
      <p className="mb-8 text-black">What&apos;s a common blocker for you?</p>

      <div className="w-full max-w-2xl">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {blockers.map((blocker) => (
            <button
              key={blocker}
              onClick={() => {
                setSelectedBlocker(blocker);
                setCustomBlocker("");
              }}
              className={`w-full text-left p-4 rounded-lg transition-colors border text-black ${
                selectedBlocker === blocker
                  ? "bg-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {blocker}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black">
          Or Add Your Own
        </h2>
        <input
          type="text"
          value={customBlocker}
          onChange={(e) => {
            setCustomBlocker(e.target.value);
            setSelectedBlocker("");
          }}
          placeholder="e.g., I feel overwhelmed"
          className="w-full text-left p-4 rounded-lg transition-colors border bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setPage("onboarding")}
            className="w-full py-3 bg-gray-200 text-black font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleStart}
            className="w-full py-3 blue-gradient-button text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Start My Journey
          </button>
        </div>
      </div>
    </div>
  );
}
