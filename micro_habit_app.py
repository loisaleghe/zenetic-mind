import streamlit as st
import datetime
import requests
import json
import pandas as pd

from my_component import my_component

##################################
# in folder of app run this command
#python -m streamlit run micro_habit_app.py
#######################################

def local_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

local_css("styles.css")

# Session state initialization
if "page" not in st.session_state:
    st.session_state.page = "landing"
if "habit_data" not in st.session_state:
    st.session_state.habit_data = {}

def get_LLM_response(ui, prompt_template):
    final_prompt = prompt_template.format(user_input=ui)
    url = 'http://localhost:11434/api/generate'
    data = {
        "model": "llama3.2",
        "prompt": final_prompt
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(data), headers=headers, stream=True)

    full_response = []
    try:
        for line in response.iter_lines():
            if line:
                decoded_line = json.loads(line.decode('utf-8'))
                full_response.append(decoded_line['response'])
                if "Micro-action:" in decoded_line['response']:
                    break
    finally:
        response.close()

    return ''.join(full_response), data, final_prompt

# Navigation
def navigate(page):
    st.session_state.page = page

# 1. 🖥️ Landing Page
def landing_page():
    st.title("Tiny habits. Big change.")
    st.subheader("Build lasting habits with science-backed micro-actions.")
    st.button("Get Started", on_click=lambda: navigate("onboarding"))
    st.button("Go to dashboard", on_click=lambda: navigate("dashboard"))

    # st.title("test")
    # my_component("what")

# 2. 👤 Onboarding & Personalization
def onboarding():
    st.header("Choose Your Micro-Habit")
    habit = st.selectbox("Select a habit:", [
        "Drink one glass of water after waking up",
        "Write one sentence in journal",
        "Go for a walk",
        "Meditate",
        "Eat a healthy snack",
        "Other (custom)"
    ])
    if habit == "Other (custom)":
        custom_habit = st.text_input("Enter your custom habit:")
        if custom_habit.strip():
            habit = custom_habit.strip()
    timing = st.radio("When do you want to do this?", ["Morning", "Evening", "After an existing habit"])
    st.session_state.habit_data["habit"] = habit
    st.session_state.habit_data["timing"] = timing
    st.button("Next: Dashboard", on_click=lambda: navigate("dashboard"))

# 3. 🧠 Cognitive Setup
def cognitive_setup():
    st.header("Build Self-Awareness")
    blockers = st.multiselect("Which thought patterns tend to hold you back?", [
        "Perfectionism", "Procrastination", "Self-doubt", "Overthinking"
    ])
    st.markdown("> 💡 *Missing one day doesn’t erase your progress.*")
    mindful_checkin = st.checkbox("Enable Mindful Check-ins (10-second daily reflection)")
    st.session_state.habit_data["blockers"] = blockers
    st.session_state.habit_data["mindful_checkin"] = mindful_checkin
    st.button("Go to Dashboard", on_click=lambda: navigate("dashboard"))

# 4. 📅 Daily Habit Dashboard
def dashboard():
    st.header("Your Daily Habit")
    habit = st.session_state.habit_data.get("habit", "No habit selected")
    st.write(f"**Today's Habit:** {habit}")
    
    st.write(f"**Did you do it?**")
    if st.button("I did it!"):
        st.success("🎉 Great job!")
        st.session_state.habit_data.setdefault("streak", 0)
        st.session_state.habit_data["streak"] += 1

    st.write(f"**Streak:** {st.session_state.habit_data.get('streak', 0)} days")
    mood = st.radio("How did that feel?", ["😊", "😐", "😔"])

    journal = st.text_area(
        "Write a short reflection. These may help:\n"
        "- What was the situation: who, what, when, where?\n"
        "- What did you feel: disappointed, depressed, angry, confused, pleased?\n"
        "- What was going through your mind before you started to feel this way?\n\n"
        "Now, let’s go a little deeper:\n"
        "Try to complete this sentence:\n"
        "**If [this situation happens], then [this belief about myself must be true].**\n"
        "For example: *If I miss a day, then I’m failing.*\n"
        "This helps uncover the rules you might be living by—often without realizing it."
    )

    if st.button("Submit Reflection"):
        if journal.strip() == "":
            st.warning("Please write a reflection before submitting.")
        else:
            prompt_template1 = f"""
            User's selected habit:
            {habit}

            User reflection:
            {journal}

            Prompted assumption:
            If [this situation happens], then [this belief about myself must be true].

            Respond in the following format:
            1. Assumption: [One sentence, max 25 words]
            2. Mood Impact: [One sentence, max 25 words]
            3. Reframe: [One sentence, max 25 words]
            4. Micro-action: [Short paragraph, max 3 sentences]

            Use a supportive, non-judgmental tone. Avoid elaboration or repetition.
            """

            res, full_query, augmented_query = get_LLM_response(journal, prompt_template1)

            st.subheader("🧠 Thought Insight & Reframe")

            for line in res.strip().split("\n"):
                if line.startswith("1. Assumption:"):
                    st.markdown(f"**🧩 Assumption:**  \n{line.replace('1. Assumption:', '').strip()}")
                elif line.startswith("2. Mood Impact:"):
                    st.markdown(f"**💭 Mood Impact:**  \n{line.replace('2. Mood Impact:', '').strip()}")
                elif line.startswith("3. Reframe:"):
                    st.markdown(f"**💬 Reframe:**  \n*{line.replace('3. Reframe:', '').strip()}*")
                elif line.startswith("4. Micro-action:"):
                    st.markdown(f"**🧪 Micro-action:**  \n{line.replace('4. Micro-action:', '').strip()}")

    st.button("View Progress & Insights", on_click=lambda: navigate("insights"))

# 5. 📈 Progress & Insights Page
def insights():
    st.header("Your Progress & Insights")
    st.write(f"**Habit:** {st.session_state.habit_data.get('habit')}")
    st.write(f"**Streak:** {st.session_state.habit_data.get('streak', 0)} days")
    # st.write("**Thoughts that held you back:**")
    # st.write(", ".join(st.session_state.habit_data.get("blockers", [])))
    # st.write("**Suggested Reframe:**")
    st.markdown("> *You're building momentum. Keep going.*")
    st.button("Back to Dashboard", on_click=lambda: navigate("dashboard"))

# Page router
if st.session_state.page == "landing":
    landing_page()
elif st.session_state.page == "onboarding":
    onboarding()
elif st.session_state.page == "cognitive":
    cognitive_setup()
elif st.session_state.page == "dashboard":
    dashboard()
elif st.session_state.page == "insights":
    insights()