ask_aiimport cv2
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
