import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { setInput } from './chatSlice';
import type { ChatMessage } from './chatSlice';
import { sendMessageThunk } from './chatSlice';

export default function MainScreen() {
  const apiKey = useSelector((state: RootState) => state.chat.apiKey);
  const input = useSelector((state: RootState) => state.chat.input) || "";
  const isRunning = useSelector((state: RootState) => state.chat.isRunning);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch<AppDispatch>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <div
        className="chatWindow margin-x-auto"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 150px)",
        }}
      >
        <div
          className="messagesArea padding-xl"
          style={{ flex: 1, overflowY: "auto" }}
        >
          {messages.length === 0 && (
            <div className="emptyMessagesText">
              {!apiKey
                ? "Please go to Settings to configure your API key before starting a conversation."
                : "No messages yet. Type below to start a conversation."}
            </div>
          )}
          {messages.map((msg: ChatMessage) => (
            <div
              key={msg.id}
              className="messageItem margin-md"
              style={{ textAlign: msg.role === "user" ? "right" : "left" }}
            >
              <b>{msg.role === "user" ? "You" : "Assistant"}:</b>{" "}
              {msg.content.map((c, i) => (
                <span key={i}>{c.text}</span>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="inputForm padding-md"
          style={{ display: "flex", gap: 8 }}
          onSubmit={e => {
            e.preventDefault();
            dispatch(sendMessageThunk());
          }}
        >
          <input
            type="text"
            value={input}
            onChange={e => dispatch(setInput(e.target.value))}
            placeholder={apiKey ? "Type your message..." : "Configure API key in Settings first"}
            disabled={isRunning || !apiKey}
            className="inputField padding-md"
            style={{ flex: 1 }}
            autoFocus
          />
          <button
            type="submit"
            disabled={isRunning || !input.trim() || !apiKey}
            className="defaultButton padding-x-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
