"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
ArrowUp,
Bot,
Globe2,
Plus,
Sparkles,
Trash2
} from "lucide-react";

type Message = {
role: "user" | "assistant";
content: string;
};

export default function Home() {
const [messages, setMessages] = useState<Message[]>([]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function sendMessage() {
const text = input.trim();

if (!text || loading) return;

const nextMessages: Message[] = [
  ...messages,
  { role: "user", content: text }
];

setMessages(nextMessages);
setInput("");
setError("");
setLoading(true);

try {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: nextMessages })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  setMessages([
    ...nextMessages,
    { role: "assistant", content: data.answer }
  ]);
} catch {
  setError(
    "AXION AI could not respond. Check your API configuration and try again."
  );
} finally {
  setLoading(false);
}

}

function startNewChat() {
setMessages([]);
setInput("");
setError("");
}

return (
<main className="app-shell">
<aside className="sidebar">
<a className="brand" href="/" aria-label="AXION AI home">
<span className="brand-icon">
<Sparkles size={21} />
</span>
<span>
<strong>AXION</strong>
<small>ARTIFICIAL INTELLIGENCE</small>
</span>
</a>

    <button className="new-chat" onClick={startNewChat}>
      <Plus size={18} />
      New conversation
    </button>

    <div className="sidebar-label">YOUR WORKSPACE</div>

    <div className="workspace-item">
      <Bot size={18} />
      <span>AI Assistant</span>
    </div>

    <div className="workspace-item muted">
      <Globe2 size={18} />
      <span>Global intelligence</span>
    </div>

    <div className="sidebar-bottom">
      <div className="status-dot" />
      <span>AXION AI Platform</span>
    </div>
  </aside>

  <section className="main-panel">
    <header className="topbar">
      <div>
        <span className="online-indicator" />
        AXION AI <span className="version">PREVIEW</span>
      </div>
      <div className="global-label">
        <Globe2 size={16} />
        GLOBAL EDITION
      </div>
    </header>

    <section className="conversation">
      {messages.length === 0 ? (
        <div className="welcome">
          <div className="hero-icon">
            <Sparkles size={30} />
          </div>

          <div className="eyebrow">A NEW ERA OF INTELLIGENCE</div>

          <h1>
            Intelligence
            <br />
            <span>without limits.</span>
          </h1>

          <p>
            Meet AXION AI. Ask questions, explore ideas,
            solve problems and create something extraordinary.
          </p>

          <div className="suggestions">
            {[
              "Help me build a business",
              "Explain artificial intelligence",
              "Write a professional email",
              "Teach me something new"
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
              >
                <Sparkles size={15} />
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="messages">
          {messages.map((message, index) => (
            <article
              className={`message ${message.role}`}
              key={`${index}-${message.role}`}
            >
              <div className="message-avatar">
                {message.role === "assistant" ? (
                  <Sparkles size={17} />
                ) : (
                  "U"
                )}
              </div>

              <div className="message-content">
                <div className="message-name">
                  {message.role === "assistant"
                    ? "AXION AI"
                    : "YOU"}
                </div>
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </article>
          ))}

          {loading && (
            <div className="thinking">
              <Sparkles size={16} />
              AXION is thinking...
            </div>
          )}

          <div className="error-message">{error}</div>
        </div>
      )}
    </section>

    <footer className="composer-area">
      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage();
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              void sendMessage();
            }
          }}
          placeholder="Message AXION AI..."
          aria-label="Message AXION AI"
          maxLength={12000}
          rows={2}
        />

        <button
          className="send-button"
          type="submit"
          disabled={!input.trim() || loading}
          aria-label="Send message"
        >
          <ArrowUp size={20} />
        </button>
      </form>

      <div className="composer-note">
        <span>
          <Sparkles size={12} /> Powered by AI
        </span>
        <span>AXION AI can make mistakes. Verify important information.</span>
      </div>
    </footer>
  </section>
</main>

);
}
