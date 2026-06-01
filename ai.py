import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_ai(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are my personal AI assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content

while True:
    user_input = input("Ask your AI → ")
    answer = ask_ai(user_input)
    print("\nAI: ", answer, "\n")
import webbrowser
import pyautogui



import subprocess
def perform_task(command):
    command=command.lower()
    if "open chrome" in command:
webbrowser.open("https://www.google.com")
    if "open youtube" in command:
        webbrowser.open("https://youtube.com")
        return "Opening YouTube."
    if "play song" in command:
        webbrowser.open("https://youtube.com/results?search_query=songs")
        return "Playing songs on YouTube."
    if "open notepad" in command:
        subprocess.Popen("notepad.exe")
        return "Opening Notepad."
    if "type" in command:
        text = command.replace("type", "").strip()
        time.sleep(1)
        pyautogui.write(text)
        return "Typing your text."
    return None

while True:
    user_input = input("Ask your AI → ")

    # First check if the command is an automation task
    action_result = perform_task(user_input)
    if action_result:
        print("\nAI:", action_result, "\n")
answer = ask_ai(user_input)
    print("\nAI:", answer, "\n")
    continue

    # Otherwise, it's a normal AI question
    answer = ask_ai(user_input)
    print("\nAI:", answer, "\n")
action_result = perform_task(user_input)
    continue

# Otherwise, it's a normal AI question
answer = ask_ai(user_input)
print("\nAI:", answer, "\n")

import os
import webbrowser
import pyautogui
import time
import subprocess
from openai import OpenAI
from dotenv import load_dotenv

# Load API key
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ------------------------------
# AI RESPONSE FUNCTION
# ------------------------------
def ask_ai(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are my personal AI assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


# ------------------------------
# AUTOMATION FUNCTIONS
# ------------------------------
def perform_task(command):
    command = command.lower()

    # ---- Open Chrome ----
    if "open chrome" in command:
        webbrowser.open("https://www.google.com")
        return "Opening Chrome browser."

    # ---- Open YouTube ----
    if "open youtube" in command:
        webbrowser.open("https://youtube.com")
        return "Opening YouTube."

    # ---- Play songs ----
    if "play song" in command or "play songs" in command:
        webbrowser.open("https://youtube.com/results?search_query=bollywood+songs")
        return "Playing songs on YouTube."

    # ---- Open Notepad ----
    if "open notepad" in command:
        subprocess.Popen("notepad.exe")
        return "Opening Notepad."

    # ---- Type text ----
    if "type" in command:
        text = command.replace("type", "").strip()
        time.sleep(1)  # Give 1 second to focus
        pyautogui.write(text)
        return f"Typing: {text}"

    return None  # No automation command detected


# ------------------------------
# MAIN LOOP
# ------------------------------
while True:
    user_input = input("Ask your AI → ")

    if user_input.lower() == "exit":
        print("AI: Goodbye!")
        break

    # First check if the command is an automation task
    action_result = perform_task(user_input)
    if action_result:
        print("\nAI:", action_result, "\n")
        continue

    # Otherwise, it's a normal AI question
    answer = ask_ai(user_input)
    print("\nAI:", answer, "\n")
chat his
chat history
delete chat history
import cv2
import speech_recognition as sr
import pyttsx3
from ollama import Client

client = Client()
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = r.listen(source)
    try:
        return r.recognize_google(audio)
    except:
        return "I could not understand"

def see():
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()
    cv2.imwrite("frame.jpg", frame)
    return "frame.jpg"

def ask_ai(message, image_path=None):
    if image_path:
        img = open(image_path, "rb").read()
        response = client.chat(
            model="llama3",
            messages=[
                {"role": "user", "content": message, "images": [img]}
            ]
        )
    else:
        response = client.chat(
            model="llama3",
            messages=[{"role": "user", "content": message}]
        )
    return response["message"]["content"]

# MAIN LOOP
speak("BHAGYA online. How can I help you?")

while True:
    command = listen().lower()

    if "stop" in command or "shutdown" in command:
        speak("Shutting down.")
        break

    elif "look" in command or "see" in command:
        img = see()
        answer = ask_ai("Describe what you see.", img)
        speak(answer)

    else:
        answer = ask_ai(command)
        speak(answer)
import cv2
import speech_recognition as sr
import pyttsx3
from ollama import Client

client = Client()
engine = pyttsx3.init()

def speak(text):
    engine.say(text)
    engine.runAndWait()

def listen():
    r = sr.Recognizer()
    with sr.Microphone() as source:
        print("Listening...")
        audio = r.listen(source)
    try:
        return r.recognize_google(audio)
    except:
        return "I could not understand"

def see():
    cam = cv2.VideoCapture(0)
    ret, frame = cam.read()
    cam.release()
    cv2.imwrite("frame.jpg", frame)
    return "frame.jpg"

def ask_ai(message, image_path=None):
    if image_path:
        img = open(image_path, "rb").read()
        response = client.chat(
            model="llama3",
            messages=[
                {"role": "user", "content": message, "images": [img]}
            ]
        )
    else:
        response = client.chat(
            model="llama3",
            messages=[{"role": "user", "content": message}]
        )
    return response["message"]["content"]

# MAIN LOOP
speak("BHAGYA online. How can I help you?")

while True:
    command = listen().lower()

    if "stop" in command or "shutdown" in command:
        speak("Shutting down.")
        break

    elif "look" in command or "see" in command:
        img = see()
        answer = ask_ai("Describe what you see.", img)
        speak(answer)

    else:
        answer = ask_ai(command)
        speak(answer)

IMPORT CV2
import CV2
fname(myai.py_del)
import cv 2
import cv2
speech recognition as super
import speech_recognition as sr
import pyttsx3
from ollama import client
client = client()
engine = pyttsx3.init()
def speak(text):
    engine.say(text)
    engine.runAndwait()
    def listen():
        r = sr.Recognizer()
        with sr.Microphone() as source:
            print("Listening...")
            audio = r.Listen(source)
            try:
                return r.recognize_google(audio)
            except:
                return "i could not understand "
            def see():
                cam = cv2.videocapture(0)
                ret, frame =cam.read()
                cam.release()
                cv2.imwrite("frame.jpg", frame)
                return "frame.jpg"
            def ask_ai(message, image_path=None):
                if image_path:
                    img = open(image_path, "rb").read()
                    response =client.chat()
                    model ="LLAMA3",
                    messgaes=[
                        {"role": "user", "content": mesage, "images": [img]}
                    ]
                else:
                    response =client.chat(
                        model ="LLANA3"
                        messages=[{"role":"user"."Content":messages}]
                    )
                    return response["messages"]["content"]
                # MAIN LOOP
                speak("BHAGYA online. How can i help you")
                while True:
                    command=listen().Lower()
                    if "stop" in command or "shutdown" in command:
                        speak("shutting down")
                        break
                    elif"look" in command or "see" in command:
                        img =see()
                        answer = ask_ai("Describe what you see.".img)
                        speak(answer)
                    else:
                        answer = ask_ai(command)
                        speak(answer)
                        cv2.destroyAllwindows()
