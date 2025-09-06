"use client";

import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const blockers = [
  "I don't have time.",
  "I'm too tired.",
  "I'll do it later.",
  "It's not important.",
  "I don't have one"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Cognitive Setup</h1>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          What&apos;s a common blocker for you?
        </h2>
        <div className="space-y-2">
          {blockers.map((blocker) => (
            <button
              key={blocker}
              onClick={() => {
                setSelectedBlocker(blocker);
                setCustomBlocker("");
              }}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedBlocker === blocker
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {blocker}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Or Add Your Own</h2>
        <input
          type="text"
          value={customBlocker}
          onChange={(e) => {
            setCustomBlocker(e.target.value);
            setSelectedBlocker("");
          }}
          placeholder="e.g., I feel overwhelmed"
          className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          onClick={handleStart}
          className="w-full mt-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Start My Journey
        </button>
      </div>
    </div>
  );
}
