
const form = document.getElementById("chatForm");
const promptBox = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");
const messagesBox = document.getElementById("messages");
const chatList = document.getElementById("chatList");
const welcome = document.getElementById("welcome");

let chats = [];
let activeId = null;
let busy = false;

try {
    chats = JSON.parse(localStorage.getItem("talkora_chats") || "[]");
    if (!Array.isArray(chats)) chats = [];
} catch {
    chats = [];
}

function saveChats() {
    localStorage.setItem("talkora_chats", JSON.stringify(chats));
}

function activeChat() {
    return chats.find(chat => chat.id === activeId);
}

function createChat() {
    const chat = {
        id: Date.now().toString(),
        title: "New Chat",
        messages: []
    };

    chats.unshift(chat);
    activeId = chat.id;

    saveChats();
    renderChatList();
    renderMessages();

    promptBox.focus();
    document.getElementById("sidebar").classList.remove("open");
}

function renderChatList() {
    chatList.replaceChildren();

    chats.forEach(chat => {
        const item = document.createElement("div");

        item.className =
            "chat-item" + (chat.id === activeId ? " active" : "");

        item.textContent = chat.title;

        item.addEventListener("click", () => {
            if (busy) return;

            activeId = chat.id;
            renderChatList();
            renderMessages();
        });

        chatList.appendChild(item);
    });
}

function addMessage(role, text) {
    const row = document.createElement("div");

    row.className =
        "message " + (role === "user" ? "user" : "assistant");

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.textContent = role === "user" ? "Y" : "✦";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = text;

    row.append(avatar, bubble);
    messagesBox.appendChild(row);

    messagesBox.scrollTop = messagesBox.scrollHeight;

    return row;
}

function renderMessages() {
    messagesBox.replaceChildren();

    const chat = activeChat();

    if (!chat || chat.messages.length === 0) {
        messagesBox.appendChild(welcome);
        welcome.style.display = "flex";
        return;
    }

    welcome.style.display = "none";

    chat.messages.forEach(message => {
        addMessage(message.role, message.content);
    });
}

async function sendMessage(text) {
    if (busy || !text.trim()) return;

    if (!activeChat()) createChat();

    const chat = activeChat();
    const content = text.trim();

    if (!chat.messages.length) {
        chat.title = content.slice(0, 30);
    }

    chat.messages.push({
        role: "user",
        content: content
    });

    saveChats();
    renderChatList();
    renderMessages();

    promptBox.value = "";
    promptBox.style.height = "auto";

    busy = true;
    sendBtn.disabled = true;

    const loading = addMessage("model", "Thinking...");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: chat.messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        if (typeof data.reply !== "string" || !data.reply.trim()) {
            throw new Error("AI returned an empty response.");
        }

        loading.remove();

        chat.messages.push({
            role: "model",
            content: data.reply
        });

        saveChats();
        addMessage("model", data.reply);

    } catch (error) {
        loading.querySelector(".bubble").textContent =
            "Error: " + error.message;

    } finally {
        busy = false;
        sendBtn.disabled = false;
        renderChatList();
        promptBox.focus();
    }
}

form.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage(promptBox.value);
});

promptBox.addEventListener("input", () => {
    promptBox.style.height = "auto";
    promptBox.style.height =
        Math.min(promptBox.scrollHeight, 180) + "px";
});

promptBox.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        form.requestSubmit();
    }
});

document.getElementById("newChat").addEventListener("click", () => {
    if (!busy) createChat();
});

document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll("[data-prompt]").forEach(button => {
    button.addEventListener("click", () => {
        sendMessage(button.dataset.prompt);
    });
});

if (chats.length) {
    activeId = chats[0].id;
} else {
    createChat();
}

renderChatList();
renderMessages();