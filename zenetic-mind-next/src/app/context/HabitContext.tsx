"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface Habit {
  name: string;
  time: string;
}

interface HabitContextType {
  page: string;
  setPage: (page: string) => void;
  habitData: Habit | null;
  setHabitData: (data: Habit | null) => void;
  habitCompletedToday: boolean;
  setHabitCompletedToday: (completed: boolean) => void;
  streak: number;
  setStreak: (streak: number) => void;
  mood: string;
  setMood: (mood: string) => void;
  journal: string;
  setJournal: (journal: string) => void;
  blocker: string;
  setBlocker: (blocker: string) => void;
}

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState("landing");
  const [habitData, setHabitData] = useState<Habit | null>(null);
  const [habitCompletedToday, setHabitCompletedToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [mood, setMood] = useState("😊");
  const [journal, setJournal] = useState("");
  const [blocker, setBlocker] = useState("");

  return (
    <HabitContext.Provider
      value={{
        page,
        setPage,
        habitData,
        setHabitData,
        habitCompletedToday,
        setHabitCompletedToday,
        streak,
        setStreak,
        mood,
        setMood,
        journal,
        setJournal,
        blocker,
        setBlocker,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error("useHabit must be used within a HabitProvider");
  }
  return context;
}
