import os
import speech_recognition as sr
import pyttsx3
from google import genai
from google.genai import types

# --- CONFIGURATION (Keep as is) ---
GEMINI_API_KEY = "AIzaSyBVv4KXASNpL3cQ8jKpX3Hwc5grOvFYlHU"
MODEL_NAME = 'gemini-2.5-flash' 
r = sr.Recognizer()

# ---------------------------------------------------------------------
# 1. FIND YOUR MICROPHONE INDEX (TEMPORARY FUNCTION)
# ---------------------------------------------------------------------
def find_microphone_index():
    """Prints all available microphone indexes and names."""
    print("\n--- AVAILABLE MICROPHONE DEVICES ---")
    try:
        # Get list of device names and their corresponding index
        mic_list = sr.Microphone.list_microphone_names()
        if not mic_list:
            print("ERROR: No microphones found by PyAudio/SpeechRecognition.")
            return -1

        for index, name in enumerate(mic_list):
            print(f"Index {index}: {name}")
            
        print("------------------------------------")
        print("ACTION: Copy the INDEX NUMBER (e.g., 1 or 3) next to your intended microphone.")
        print("Then, paste it into the 'YOUR_MIC_INDEX' variable below and run the script again.")
        return -1 # Return value doesn't matter, we only care about the printout

    except Exception as e:
        print(f"Error listing microphones: {e}")
        return -1
# ---------------------------------------------------------------------


# --- IMPORTANT: PASTE YOUR MICROPHONE INDEX HERE ---
# e.g., if you saw 'Index 1: Headset Microphone', set it to 1.
YOUR_MIC_INDEX = 2 # <-- RUN STEP 1 FIRST TO GET THIS NUMBER! 
# ---------------------------------------------------


# --- SETUP ---
def setup_tts():
    engine = pyttsx3.init()
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate + 20)
    return engine

tts_engine = setup_tts()

# ----------------------------------------------------
# 2. Helper Functions (MODIFIED LISTEN FUNCTION)
# ----------------------------------------------------
def speak(text):
    """Converts text to speech and plays it."""
    print(f"🤖 AI: {text}")
    tts_engine.say(text)
    tts_engine.runAndWait()

def listen():
    """Captures audio from the microphone and converts it to text."""
    # Use the specific index you found in Step 1
    with sr.Microphone(device_index=YOUR_MIC_INDEX) as source: 
        # Increase duration to 1 second for better noise calibration
        r.adjust_for_ambient_noise(source, duration=1.0) 
        speak("Listening...")
        print("Listening...")
        
        try:
            # Increased timeout and phrase time limit slightly
            audio = r.listen(source, timeout=6, phrase_time_limit=15)
        except sr.WaitTimeoutError:
            print("No speech detected.")
            return ""

    try:
        text = r.recognize_google(audio)
        print(f"👤 You: {text}")
        return text
    except sr.UnknownValueError:
        print("Sorry, I did not catch that.")
        speak("Sorry, I did not catch that.")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return ""

# ----------------------------------------------------
# 3. Main Conversation Logic
# ----------------------------------------------------
def start_conversation():
    # If the index is still -1, run the finder function first
    if YOUR_MIC_INDEX == -1:
        find_microphone_index()
        return

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        chat = client.chats.create(
            model=MODEL_NAME,
            config=types.GenerateContentConfig(
                system_instruction="You are a helpful and concise voice assistant named BizzBoost AI. Keep your answers brief for an oral conversation."
            )
        )
        
        speak("Hello! Welcome")

    except Exception as e:
        print(f"\n--- API Key/Initialization Error ---")
        print(f"Failed to initialize Gemini Client. Check your API key and network connection.")
        print(f"Error: {e}")
        return

    while True:
        user_input = listen()
        
        if not user_input:
            continue

        if user_input.lower() in ["end", "stop", "exit", "thank you", "that's all"]:
            speak("Goodbye! Have a great day.")
            break

        try:
            response = chat.send_message(user_input)
            speak(response.text)

        except Exception as e:
            speak(f"An error occurred with the AI request: {e}. Please try again.")
            print(f"Error details: {e}")
            break

if _name_ == "_main_":
    start_conversation()