"use client";

import { useHabit } from "./context/HabitContext";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import CognitiveSetup from "./components/CognitiveSetup";
import Dashboard from "./components/Dashboard";
import Insights from "./components/Insights";

export default function Home() {
  const { page } = useHabit();

  const renderPage = () => {
    switch (page) {
      case "landing":
        return <LandingPage />;
      case "onboarding":
        return <Onboarding />;
      case "cognitive_setup":
        return <CognitiveSetup />;
      case "dashboard":
        return <Dashboard />;
      case "insights":
        return <Insights />;
      default:
        return <LandingPage />;
    }
  };

  return <main className="min-h-screen">{renderPage()}</main>;
}
