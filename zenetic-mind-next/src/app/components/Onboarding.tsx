"use client";

import { useState } from "react";
import { useHabit } from "../context/HabitContext";

const presetHabits = [
  "Drink a glass of water after waking up",
  "Stretch for 5 minutes",
  "Read one page of a book",
  "Write one sentence in journal",
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
    <div className="flex flex-col items-center justify-center min-h-screen  text-white p-4">
      <h2 className="text-3xl font-bold text-black">Select a Micro-Habit</h2>
      <p className="text-black mb-8">Select one habit you would like to do</p>

      <div className="w-full max-w-2xl ">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {presetHabits.map((habit) => (
            <button
              key={habit}
              onClick={() => {
                setSelectedHabit(habit);
                setCustomHabit("");
              }}
              className={`w-full text-left p-4 rounded-lg transition-colors border text-black ${
                selectedHabit === habit
                  ? "bg-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {habit}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={customHabit}
          onChange={(e) => {
            setCustomHabit(e.target.value);
            setSelectedHabit("");
          }}
          placeholder="e.g., Meditate for 1 minute"
          className="w-full p-4 rounded-lg bg-white text-black border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <h2 className="text-2xl font-medium mt-8 mb-4 text-black text-center">
          When do you want to do it?
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {["Morning", "Afternoon", "Evening"].map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-4 rounded-lg transition-colors border text-black ${
                selectedTime === time
                  ? "bg-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-50"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setPage("landing")}
            className="w-full py-3 bg-gray-200 text-black font-semibold rounded-lg shadow-md hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="w-full py-3 blue-gradient-button text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
