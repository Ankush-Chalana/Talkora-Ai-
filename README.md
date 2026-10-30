# Talkora AI – Intelligent AI Chatbot

Talkora AI is a modern AI-powered chatbot web application built using Python, Flask, HTML, CSS, JavaScript, and Google Gemini API.

It provides an interactive chat experience where users can ask questions, learn new topics, generate code, and receive intelligent AI-powered responses.

## 1. Project Introduction

Talkora AI is designed to make communication with artificial intelligence simple, fast, and user-friendly.

The application uses Google's Gemini API to understand user messages and generate helpful responses through a modern ChatGPT-style interface.

## 2. Features

* AI-powered real-time conversations
* Modern ChatGPT-style user interface
* New chat functionality
* Chat history saved in browser local storage
* Educational question answering
* Programming and coding assistance
* Responsive website design
* Google Gemini API integration
* Secure API key configuration using environment variables

## 3. Technologies Used

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| Python            | Backend programming       |
| Flask             | Web application framework |
| HTML5             | Website structure         |
| CSS3              | Website styling           |
| JavaScript        | Frontend functionality    |
| Google Gemini API | AI responses              |
| Python dotenv     | Secure API configuration  |

## 4. Project Folder Structure

```text
Talkora_AI/
│
├── app.py
├── requirements.txt
├── .env
├── .gitignore
├── README.md
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

## 5. System Requirements

* Python 3.10 or later
* Visual Studio Code
* Internet connection
* Google Gemini API key

## 6. Installation Guide

### Step 1: Open the project

Open the Talkora AI project folder in Visual Studio Code.

### Step 2: Create a virtual environment

Open the VS Code terminal and run:

```powershell
py -m venv .venv
```

### Step 3: Activate the environment

```powershell
.venv\Scripts\Activate.ps1
```

### Step 4: Install required packages

```powershell
py -m pip install -r requirements.txt
```

## 7. Google Gemini API Setup

Talkora AI uses the Google Gemini API to generate chatbot responses.

Follow these steps:

1. Visit Google AI Studio.
2. Sign in with your Google account.
3. Create a new API key.
4. Copy your API key.
5. Create a `.env` file in the main project folder.

Google AI Studio API key link:

https://aistudio.google.com/app/apikey

Add the following configuration to your `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=gemini-3.8-flash
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key.

**Security:** Never share your API key or upload your `.env` file to GitHub.

## 8. Run the Project

After completing the installation, execute:

```powershell
py app.py
```

Open your browser and visit:

```text
http://127.0.0.1:5000
```

Talkora AI is now ready to use!

## 9. How Talkora AI Works

1. The user enters a message in the chatbot.
2. JavaScript sends the message to the Flask backend.
3. Flask processes the incoming request.
4. The backend communicates with Google Gemini API.
5. Gemini generates an appropriate response.
6. Flask sends the response back to the frontend.
7. JavaScript displays the AI response to the user.

## 10. API Endpoints

| HTTP Method | Endpoint    | Description                              |
| ----------- | ----------- | ---------------------------------------- |
| GET         | `/`         | Opens the chatbot homepage               |
| POST        | `/api/chat` | Sends messages and receives AI responses |

## 11. Troubleshooting

**Python not recognized**

Run:

```powershell
py --version
```

**Missing Python packages**

Run:

```powershell
py -m pip install -r requirements.txt
```

**Gemini API key error**

Check your `.env` file and make sure your API key is valid.

**Gemini 503 error**

The Gemini service or selected model may be experiencing high demand. Wait and retry.

**Website not opening**

Make sure Flask is running and visit:

```text
http://127.0.0.1:5000
```

## 12. Future Improvements

* User authentication and registration
* Database integration
* Voice-based conversations
* Image and document understanding
* File upload functionality
* Dark and light themes
* Improved mobile experience

## 13. Conclusion

Talkora AI is an AI-powered chatbot project that demonstrates the integration of modern web technologies with Google's Gemini API.

It provides practical experience in Python programming, Flask development, frontend design, API integration, and artificial intelligence.

---

**Project Name:** Talkora AI

**Project Category:** Artificial Intelligence / Chatbot

**Backend:** Python and Flask

**Frontend:** HTML, CSS and JavaScript

**AI Integration:** Google Gemini API

**IDE:** Visual Studio Code
