"use client";

import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const presetHabits = [
  "Drink a glass of water after waking up",
  "Stretch for 5 minutes",
  "Read one page of a book",
  "Write down one thing you are grateful for",
];

export default function Onboarding() {
  const { setPage, setHabitData } = useHabit();
  const [selectedHabit, setSelectedHabit] = useState("");
  const [customHabit, setCustomHabit] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleNext = () => {
    const habit = customHabit || selectedHabit;
    if (habit && selectedTime) {
      setHabitData({ name: habit, time: selectedTime });
      setPage("cognitive_setup");
    } else {
      alert("Please select a habit and a time.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Onboarding</h1>

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Choose a Micro-Habit</h2>
        <div className="space-y-2">
          {presetHabits.map((habit) => (
            <button
              key={habit}
              onClick={() => {
                setSelectedHabit(habit);
                setCustomHabit("");
              }}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedHabit === habit
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {habit}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Or Create Your Own</h2>
        <input
          type="text"
          value={customHabit}
          onChange={(e) => {
            setCustomHabit(e.target.value);
            setSelectedHabit("");
          }}
          placeholder="e.g., Meditate for 1 minute"
          className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          When do you want to do it?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {["Morning", "Afternoon", "Evening"].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-4 rounded-lg transition-colors ${
                selectedTime === time
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
