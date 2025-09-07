"use client";

import { useState } from "react";
import Image from "next/image";
import { useHabit } from "../context/HabitContext";

const mock_streaks = [
  { day: "Sunday", number: 1, streak: false },
  { day: "Monday", number: 2, streak: true },
  { day: "Tuesday", number: 3, streak: true },
  { day: "Wednesday", number: 4, streak: false },
  { day: "Thursday", number: 5, streak: true },
  { day: "Friday", number: 6, streak: false },
  { day: "Saturday", number: 7, streak: true },
];

async function getLLMResponse(userInput: string, promptTemplate: string) {
  const finalPrompt = promptTemplate.replace("{user_input}", userInput);
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes
    
    const response = await fetch("https://loisaleghe-ollama-dockerfile.hf.space/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: finalPrompt,
        stream: false,
      }),
      signal: controller.signal, // Add abort signal
    });

    // Clear timeout if request completes
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.response;
    
  } catch (error) {
    console.error("Error getting LLM response:", error);
    
    return "Sorry, I'm having trouble connecting to my thoughts right now.";
  }
}

interface ParsedLlmResponse {
  assumption: string;
  moodImpact: string;
  reframe: string;
  microAction: string;
}

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
  </div>
);

export default function Dashboard() {
  const {
    habitData,
    streak,
    setStreak,
    mood,
    setMood,
    journal,
    setJournal,
    setPage,
    habitCompletedToday,
    setHabitCompletedToday,
  } = useHabit();

  const [llmResponse, setLlmResponse] = useState<ParsedLlmResponse | null>(
    null
  );
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const markDidIt = () => {
    if (!habitCompletedToday) {
      setStreak(streak + 1);
      setHabitCompletedToday(true);
      setMessage("🎉 Great job!");
    } else {
      setMessage("You've already marked this habit as done today!");
    }
  };

  const markDidntDoIt = () => {
    setMessage("🥲 Don't give up, you can always try again!");
    if (habitCompletedToday) {
      setStreak(streak > 0 ? streak - 1 : 0);
      setHabitCompletedToday(false);
    }
  };

  const submitReflection = async () => {
    if (journal.trim() === "") {
      setMessage("Please write a reflection before submitting.");
      return;
    }
    setMessage("");
    setIsLoading(true);
    setLlmResponse(null);

    const promptTemplate = `
User's selected habit:
{habit}

User reflection:
{user_input}

Prompted assumption:
If [this situation happens], then [this belief about myself must be true].

Respond in the following format:
1. Assumption: [One sentence, max 25 words]
2. Mood Impact: [One sentence, max 25 words]
3. Reframe: [One sentence, max 25 words]
4. Micro-action: [Short paragraph, max 3 sentences]

Use a supportive, non-judgmental tone. Avoid elaboration or repetition.
`;
    const habitName = habitData?.name || "not specified";
    const fullPrompt = promptTemplate.replace("{habit}", habitName);

    const response = await getLLMResponse(journal, fullPrompt);
    setIsLoading(false);

    const lines = response.split("\n");
    const parsedResponse: ParsedLlmResponse = {
      assumption: "",
      moodImpact: "",
      reframe: "",
      microAction: "",
    };

    lines.forEach((line: string) => {
      if (line.startsWith("1. Assumption:")) {
        parsedResponse.assumption = line.replace("1. Assumption:", "").trim();
      } else if (line.startsWith("2. Mood Impact:")) {
        parsedResponse.moodImpact = line.replace("2. Mood Impact:", "").trim();
      } else if (line.startsWith("3. Reframe:")) {
        parsedResponse.reframe = line.replace("3. Reframe:", "").trim();
      } else if (line.startsWith("4. Micro-action:")) {
        parsedResponse.microAction = line
          .replace("4. Micro-action:", "")
          .trim();
      }
    });

    setLlmResponse(parsedResponse);
  };

  if (!habitData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <LoadingSpinner />
        <p className="mt-2">Loading your habit...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <h1 className="text-4xl font-bold my-8 text-black">Dashboard</h1>

      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Your Daily Habit</h2>
          <p className="text-lg mt-2">Today&apos;s Habit: {habitData.name}</p>
          <p className="text-gray-500">Time: {habitData.time}</p>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={markDidIt}
              className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              I did it!
            </button>
            <button
              onClick={markDidntDoIt}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              I didn&apos;t do it!
            </button>
          </div>
          {message && <p className="text-center mt-4">{message}</p>}
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Streak</h2>
          {/* <div className="flex justify-around mt-2 gap-2">
            {mock_streaks.map((s, i) => (
              <div
                key={i}
                className={`flex items-center justify-center text-center p-4 rounded-lg w-full ${
                  s.streak ? "bg-blue-300 text-white" : "bg-gray-300"
                }`}
              >
                {s.streak && (
                  <Image
                    src="/streak_smile.png"
                    alt="Streak Smile"
                    width={24}
                    height={24}
                    className="mx-auto mb-1 w-[24px] h-[24px]"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold">
                    {s.day.substring(0, 3)}
                  </p>
                  <p className="text-lg font-bold">{s.number}</p>
                </div>
              </div>
            ))}
          </div> */}
          <p className="text-5xl font-bold text-center mt-4">
            {streak} <span className="text-2xl">day(s)</span>
          </p>
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold">Past Streaks</h2>
          <div className="flex flex-wrap justify-center mt-2 gap-2">
            {mock_streaks.map((s, i) => (
              <div
                key={i}
                className={`flex items-center justify-center text-center p-2 rounded-lg flex-1 min-w-[80px] ${
                  s.streak ? "bg-blue-300 text-white" : "bg-gray-300"
                }`}
              >
                {s.streak && (
                  <Image
                    src="/streak_smile.png"
                    alt="Streak Smile"
                    width={24}
                    height={24}
                    className="mr-1 w-[24px] h-[24px]"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold">
                    {s.day.substring(0, 3)}
                  </p>
                  <p className="text-lg font-bold">{s.number}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold mb-2">How are you feeling?</h2>
          <div className="flex justify-around">
            {["😊", "😐", "😔"].map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`text-4xl p-2 rounded-full transition-all ${
                  mood === m ? "bg-blue-200" : "hover:bg-gray-100"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
          <h2 className="text-2xl font-semibold mb-2">Journal / Reflection</h2>
          <div className="text-sm text-gray-600 space-y-1 mb-2">
            <p>Write a short reflection. These prompts may help:</p>
            <ul className="list-disc list-inside pl-4">
              <li>What was the situation: who, what, when, where?</li>
              <li>
                What did you feel: disappointed, depressed, angry, confused,
                pleased?
              </li>
              <li>
                What was going through your mind before you started to feel this
                way?
              </li>
            </ul>
            <p>Now, let’s go a little deeper. Try to complete this sentence:</p>
            <p className="pl-4 italic">
              If [this situation happens], then [this belief about myself must
              be true].
            </p>
            <p>For example: &quot;If I miss a day, then I’m failing.&quot;</p>
            <p>
              This helps uncover the rules you might be living by—often without
              realizing it.
            </p>
          </div>
          <textarea
            value={journal}
            onChange={(e) => {
              setJournal(e.target.value);
              setMessage("");
            }}
            className="w-full h-24 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            placeholder="What's on your mind?"
          />
          <button
            onClick={submitReflection}
            className="w-full mt-4 py-2 blue-gradient-button text-white rounded-lg hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : "Submit for Reframing"}
          </button>
        </div>

        {isLoading && (
          <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
            <LoadingSpinner />
            <p className="text-center mt-2">Analyzing your thoughts...</p>
          </div>
        )}

        {llmResponse && (
          <div className="bg-white border border-gray-300 p-6 rounded-lg text-black">
            <h2 className="text-2xl font-semibold mb-2">
              🧠 Thought Insight & Reframe
            </h2>
            <p>
              <strong>🧩 Assumption:</strong> {llmResponse.assumption}
            </p>
            <p>
              <strong>💭 Mood Impact:</strong> {llmResponse.moodImpact}
            </p>
            <p>
              <strong>💬 Reframe:</strong> <em>{llmResponse.reframe}</em>
            </p>
            <p>
              <strong>🧪 Micro-action:</strong> {llmResponse.microAction}
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={() => setPage("cognitive-setup")}
            className="w-full mt-8 py-3 bg-gray-300 text-black font-semibold rounded-lg shadow hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => setPage("insights")}
            className="w-full mt-8 py-3 blue-gradient-button text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors"
          >
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
}
