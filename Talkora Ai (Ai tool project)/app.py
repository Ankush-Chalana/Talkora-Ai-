
import os
import time

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from google import genai
from google.genai import types

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 64 * 1024

API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash").strip()

client = genai.Client(api_key=API_KEY) if API_KEY else None


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    if client is None:
        return jsonify({
            "error": "Gemini API key missing. Check your .env file."
        }), 500

    data = request.get_json(silent=True) or {}
    messages = data.get("messages", [])

    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "Please enter a message."}), 400

    if len(messages) > 30:
        return jsonify({"error": "Please start a new chat."}), 400

    contents = []

    for message in messages:
        if not isinstance(message, dict):
            return jsonify({"error": "Invalid message format."}), 400

        role = message.get("role")
        content = message.get("content")

        if role not in ("user", "model") or not isinstance(content, str):
            return jsonify({"error": "Invalid message format."}), 400

        content = content.strip()

        if not content or len(content) > 4000:
            return jsonify({"error": "Message must contain 1-4000 characters."}), 400

        contents.append(
            types.Content(
                role=role,
                parts=[types.Part(text=content)]
            )
        )

    if not contents or contents[-1].role != "user":
        return jsonify({"error": "Latest message must be from the user."}), 400

    try:
        response = None

        # Retry temporary server overload errors.
        for attempt in range(3):
            try:
                response = client.models.generate_content(
                    model=MODEL,
                    contents=contents,
                    config=types.GenerateContentConfig(
                        system_instruction=(
                            "You are Talkora AI, a friendly and intelligent "
                            "AI assistant. Answer clearly and accurately. "
                            "Reply in the same language as the user. "
                            "Support Hindi, English and Hinglish. "
                            "Explain difficult topics in simple steps."
                        ),
                        temperature=0.7,
                        max_output_tokens=2048
                    )
                )
                break

            except Exception as error:
                error_text = str(error)
                print(
                    f"Gemini attempt {attempt + 1}: "
                    f"{type(error).__name__}: {error_text}"
                )

                if attempt == 2 or not any(
                    code in error_text for code in ("503", "500", "502", "504")
                ):
                    raise

                time.sleep(2 ** attempt)

        answer = response.text if response else None

        if not answer:
            return jsonify({
                "error": "AI returned an empty response. Please try again."
            }), 502

        return jsonify({"reply": answer})

    except Exception as error:
        print(f"Talkora AI error: {type(error).__name__}: {error}")

        return jsonify({
            "error": (
                f"Gemini API error: {type(error).__name__}. "
                "Check the VS Code terminal and API settings."
            )
        }), 502


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )