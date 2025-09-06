"use client";

import Image from "next/image";
import { useHabit } from "../context/HabitContext";

export default function LandingPage() {
  const { setPage } = useHabit();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4 blue-gradient-text pb-10">
        Zenetic Mind
      </h1>
      <p className="text-xl mb-8">
        Build lasting habits with science-backed micro-actions.
      </p>
      <button
        onClick={() => setPage("onboarding")}
        className="px-8 py-3 blue-gradient-button text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition-opacity"
      >
        Get Started
      </button>
      <Image
        src="/landingpageimg.png"
        alt="Landing Page Image"
        width={500}
        height={300}
        className="mt-8"
      />
    </div>
  );
}
