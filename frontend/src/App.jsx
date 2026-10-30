
import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Plus,
  MessageSquare,
  Send,
  Sparkles,
  UserRound,
  Copy,
  Menu,
  X,
  Trash2,
  LoaderCircle,
  PanelLeftClose,
  Mail,
  BrainCircuit,
} from "lucide-react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL = "https://mohitx-ai.onrender.com/api/chat";
const STORAGE_KEY = "mohitx-conversations";

const prompts = [
  "Explain Java in simple words",
  "Help me build a React app",
  "Suggest a software project idea",
  "Write a professional email",
];

function loadChats() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function makeId() {
  return crypto.randomUUID();
}

export default function App() {
  const [chats, setChats] = useState(loadChats);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const endRef = useRef(null);
  const textareaRef = useRef(null);
  const requestRef = useRef(false);

  const activeChat = chats.find((chat) => chat.id === activeId);
  const messages = activeChat?.messages || [];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
      setError("Browser storage is full. Try deleting older conversations.");
    }
  }, [chats]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function newChat() {
    setActiveId(null);
    setInput("");
    setError("");
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  function updateChat(id, updater) {
    setChats((previous) =>
      previous.map((chat) => (chat.id === id ? updater(chat) : chat))
    );
  }

  async function sendMessage(text = input) {
    const message = text.trim();

    if (!message || requestRef.current) return;

    requestRef.current = true;
    setLoading(true);
    setInput("");
    setError("");
    setSidebarOpen(false);

    const id = activeId || makeId();
    const now = new Date().toISOString();

    const userMessage = {
      id: makeId(),
      role: "user",
      content: message,
      timestamp: now,
    };

    const existingChat = chats.find((chat) => chat.id === id);

    if (!existingChat) {
      setChats((previous) => [
        {
          id,
          title:
            message.length > 35
              ? `${message.slice(0, 35)}…`
              : message,
          messages: [userMessage],
          timestamp: now,
        },
        ...previous,
      ]);
    } else {
      updateChat(id, (chat) => ({
        ...chat,
        messages: [...chat.messages, userMessage],
        timestamp: now,
      }));
    }

    setActiveId(id);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(
          details
            ? `Server error ${response.status}: ${details.slice(0, 300)}`
            : `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (typeof data.reply !== "string" || !data.reply.trim()) {
        throw new Error("MohitX received an empty response from the server.");
      }

      const assistantMessage = {
        id: makeId(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      updateChat(id, (chat) => ({
        ...chat,
        messages: [...chat.messages, assistantMessage],
      }));
    } catch (err) {
      const messageText =
        err instanceof TypeError
          ? "Could not connect to the backend. Check that Spring Boot is running on port 8080 and CORS allows this frontend."
          : err.message || "Something went wrong. Please try again.";

      setError(messageText);
    } finally {
      requestRef.current = false;
      setLoading(false);
    }
  }

  function deleteChat(id) {
    setChats((previous) => previous.filter((chat) => chat.id !== id));

    if (activeId === id) {
      setActiveId(null);
      setError("");
    }
  }

  async function copyMessage(content) {
    try {
      await navigator.clipboard.writeText(content);
    } catch {
      setError("Unable to copy. Check your browser clipboard permissions.");
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand">
            <span className="brand-icon">
              <Bot size={23} />
            </span>
            <span>
              Mohit<span className="brand-accent">X</span>
            </span>
          </div>

          <button
            className="icon-button mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>

          <button
            className="icon-button desktop-collapse"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <button className="new-chat" onClick={newChat}>
          <Plus size={18} />
          New chat
        </button>

        <p className="section-title">YOUR CONVERSATIONS</p>

        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.id === activeId ? "active" : ""}`}
            >
              <button
                className="chat-select"
                onClick={() => {
                  setActiveId(chat.id);
                  setInput("");
                  setError("");
                  setSidebarOpen(false);
                }}
                title={chat.title}
              >
                <MessageSquare size={16} />
                <span>{chat.title}</span>
              </button>

              <button
                className="delete-chat"
                onClick={() => deleteChat(chat.id)}
                title="Delete conversation"
                aria-label={`Delete ${chat.title}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {chats.length === 0 && (
            <p className="empty-history">
              Your conversations will appear here.
            </p>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="profile-card">
            <div className="profile-portrait">
              <img
                src=".\src\assets\profile.jpeg"
                alt="Mohit Kumar Pani"
                className="profile-photo"
              />
              <span className="ai-badge" aria-label="AI developer">
                <Bot size={23} />
              </span>
            </div>

            <div className="profile-details">
              <strong>Mohit Kumar Pani</strong>
              <span className="profile-designation">Full Stack Developer</span>
            </div>

            <div className="profile-divider">
              <span />
            </div>

            <p className="profile-bio">
              Building useful tools with AI to create smarter and brighter
              opportunities.
            </p>

            <div className="profile-socials">
              <a
                href="https://github.com/mohitkpani"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="social-link github-link"
              >
                <span className="github-text">GH</span>
              </a>

              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="social-link linkedin-link"
              >
                in
              </a>

              <a
                href="mailto:mytechlabs.tech@gmail.com"
                aria-label="Email"
                className="social-link email-link"
              >
                <Mail size={22} />
              </a>
            </div>

            <div className="profile-quote">
              <div className="quote-heading">
                <span aria-hidden="true"></span>
                <BrainCircuit size={25} />
              </div>
              <p>
                Turn your <strong>ideas into reality</strong> with the power of AI.
              </p>
              <div className="quote-progress">
                <span />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <span className="model-name">
              MohitX Assistant
              <span className="online-dot" />
            </span>
          </div>

          <div className="powered">
            <Sparkles size={15} />
            Powered by MohitX
          </div>
        </header>

        <section className="conversation">
          {messages.length === 0 && !loading ? (
            <div className="welcome">
              <div className="welcome-icon">
                <Sparkles size={28} />
              </div>

              <p className="eyebrow">MEET YOUR AI ASSISTANT</p>

              <h1>
                What can I help
                <br />
                <span>you with today?</span>
              </h1>

              <p className="welcome-description">
                Ask questions, explore ideas, learn new skills,
                or build something extraordinary with MohitX.
              </p>

              <div className="prompts">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    disabled={loading}
                  >
                    <Sparkles size={16} />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message) => (
                <article
                  className={`message ${message.role}`}
                  key={message.id}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? (
                      <UserRound size={18} />
                    ) : (
                      <Bot size={18} />
                    )}
                  </div>

                  <div className="message-body">
                    <div className="message-author">
                      {message.role === "user" ? "You" : "MohitX"}
                    </div>

                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    {message.role === "assistant" && (
                      <button
                        className="copy-button"
                        onClick={() => copyMessage(message.content)}
                        title="Copy response"
                      >
                        <Copy size={14} />
                        Copy
                      </button>
                    )}
                  </div>
                </article>
              ))}

              {loading && (
                <div className="message assistant">
                  <div className="message-avatar">
                    <Bot size={18} />
                  </div>
                  <div className="message-body">
                    <div className="message-author">MohitX</div>
                    <div className="typing">
                      <LoaderCircle size={17} className="spinner" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          )}
        </section>

        <footer className="composer-area">
          {error && (
            <div className="error-message" role="alert">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message MohitX..."
              aria-label="Message MohitX"
              rows={1}
              disabled={loading}
            />

            <div className="composer-bottom">
              <span>Enter to send · Shift + Enter for a new line</span>

              <button
                type="submit"
                className="send-button"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                {loading ? (
                  <LoaderCircle size={18} className="spinner" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </form>

          <p className="disclaimer">
            MohitX can make mistakes. Verify important information.
          </p>
        </footer>
      </main>
    </div>
  );
}
