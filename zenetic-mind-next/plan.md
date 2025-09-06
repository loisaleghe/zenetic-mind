# Plan: Porting Streamlit Micro Habit App to Next.js

## 1. Overview

We will migrate the functionality of `micro_habit_app.py` (a Streamlit app) into the Next.js app (`zenetic-mind-next`). The goal is to replicate the user experience and features using React components, Next.js routing, and modern frontend best practices.

## 2. Key Features to Port

- **Landing Page**: Welcome, navigation to onboarding or dashboard.
- **Onboarding**: Habit selection (preset/custom), timing selection.
- **Cognitive Setup**: Blocker selection, mindful check-in toggle.
- **Dashboard**: Daily habit check-in, streak tracking, mood selection, journal/reflection, LLM integration for thought reframing.
- **Insights**: Progress summary, motivational message.

## 3. Architecture & Approach

- **Pages/Routes**: Use Next.js pages or App Router for multi-step navigation (`/`, `/onboarding`, `/dashboard`, `/insights`).
- **State Management**: Use React Context for global state (habit data, streak, etc.), mimicking Streamlit's session state. Zustand is not required for now.
- **Styling**: Use Tailwind CSS for all UI components and layouts. Remove references to `bootstrap.min.css` and update classes to use Tailwind utility classes for a modern, responsive design.
- **LLM Integration**: Replace Python `requests` with `fetch` in React to call the LLM API.
- **Persistence**: Use localStorage for streaks and habit data (optional for MVP).

## 4. Component Mapping

| Streamlit Function | Next.js Equivalent Component/Page |
| ------------------ | --------------------------------- |
| landing_page()     | `LandingPage.tsx`                 |
| onboarding()       | `Onboarding.tsx`                  |
| cognitive_setup()  | `CognitiveSetup.tsx`              |
| dashboard()        | `Dashboard.tsx`                   |
| insights()         | `Insights.tsx`                    |

## 5. Example Code Snippets

### a. State Management (React Context Example)

```tsx
// context/HabitContext.tsx
import React, { createContext, useContext, useState } from "react";

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [page, setPage] = useState("landing");
  const [habitData, setHabitData] = useState({});
  const [habitCompletedToday, setHabitCompletedToday] = useState(false);
  return (
    <HabitContext.Provider
      value={{
        page,
        setPage,
        habitData,
        setHabitData,
        habitCompletedToday,
        setHabitCompletedToday,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  return useContext(HabitContext);
}
```

### b. LLM API Call (React/TS)

```ts
async function getLLMResponse(userInput: string, promptTemplate: string) {
  const finalPrompt = promptTemplate.replace("{user_input}", userInput);
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2", prompt: finalPrompt }),
  });
  // Stream handling omitted for brevity
  const data = await response.json();
  return data.response;
}
```

### c. Navigation (App Router Example)

```tsx
"use client";
import { useRouter } from "next/navigation";
const router = useRouter();
<button onClick={() => router.push("/onboarding")}>Get Started</button>;
```

### d. Dashboard UI (Streak, Mood, Reflection)

```tsx
// ...existing code...
<div>
  <h2>Your Daily Habit</h2>
  <p>Today's Habit: {habit}</p>
  <button onClick={markDidIt}>I did it!</button>
  <button onClick={markDidntDoIt}>I didn't do it!</button>
  <p>Streak: {streak} days</p>
  <div>
    <label>Mood:</label>
    <select value={mood} onChange={(e) => setMood(e.target.value)}>
      <option>😊</option>
      <option>😐</option>
      <option>😔</option>
    </select>
  </div>
  <textarea value={journal} onChange={(e) => setJournal(e.target.value)} />
  <button onClick={submitReflection}>Submit Reflection</button>
</div>
// ...existing code...
```

## 6. Next Steps

1. Set up state management using React Context.
2. Scaffold pages/components for each feature.
3. Install and configure Tailwind CSS in the Next.js project.
4. Implement navigation and UI for each step using Tailwind utility classes.
5. Integrate LLM API and handle streaming responses.
6. Style components for a polished, modern look with Tailwind.
7. Test the flow end-to-end.

---

This plan ensures a modular, maintainable migration from Streamlit to Next.js, leveraging modern React patterns and Tailwind CSS for styling, while preserving all core features.
