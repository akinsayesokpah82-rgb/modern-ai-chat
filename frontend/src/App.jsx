import React, { useState, useEffect } from "react";

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Startup greeting mentioning creator
  useEffect(() => {
    setMessages([
      { role: "assistant", content: "Hello! I’m Modern AI, created by Akin S Sokpah. How can I assist you today?" }
    ]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages, apiKey }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content || "Sorry, I couldn’t get a response.";
    setMessages([...newMessages, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>🧠 Modern AI Chat</h1>
      <input
        type="password"
        placeholder="Enter your OpenAI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, height: 350, overflowY: "auto" }}>
        {messages.map((m, i) => (
          <p key={i}>
            <b>{m.role === "user" ? "You" : "AI"}:</b> {m.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />
      <button onClick={sendMessage} disabled={loading} style={{ width: "100%", padding: 10, marginTop: 10 }}>
        {loading ? "Thinking..." : "Send"}
      </button>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#555" }}>
        Created by <b>Akin S Sokpah</b> · Liberia
      </p>
    </div>
  );
}
