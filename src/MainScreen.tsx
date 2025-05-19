import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from './store';
import { addMessage, setIsRunning, setApiKey, setInput } from './chatSlice';
import type { ChatMessage, ChatState } from './chatSlice';

export default function MainScreen() {
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const apiKey = useSelector((state: RootState) => state.chat.apiKey);
  const input = useSelector((state: RootState) => state.chat.input) || "";
  const isRunning = useSelector((state: RootState) => state.chat.isRunning);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const dispatch = useDispatch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isRunning) return;
    const userMsg = { id: `${Date.now()}-user`, role: "user" as const, content: [{ type: "text" as const, text: input.trim() }] };
    dispatch(addMessage(userMsg));
    dispatch(setInput(""));
    dispatch(setIsRunning(true));
    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content.filter((p: any) => p.type === "text" && typeof p.text === "string").map((p: any) => p.text).join("")
      }));

      // Check if the API key is available
      if (!apiKey) {
        // Show a message that directs the user to settings
        const systemMsg = {
          id: `${Date.now()}-system`,
          role: "assistant" as const,
          content: [{
            type: "text" as const,
            text: "No API key is configured. Please go to Settings to add your OpenAI API key."
          }]
        };
        dispatch(addMessage(systemMsg));
        dispatch(setIsRunning(false));
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: apiMessages,
          stream: false,
        }),
      });
      const data = await response.json();
      const assistantMsg = { id: `${Date.now()}-assistant`, role: "assistant" as const, content: [{ type: "text" as const, text: data.choices[0].message.content }] };
      dispatch(addMessage(assistantMsg));
    } catch (error) {
      // Handle API errors
      const errorMsg = {
        id: `${Date.now()}-error`,
        role: "assistant" as const,
        content: [{
          type: "text" as const,
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
        }]
      };
      dispatch(addMessage(errorMsg));
    } finally {
      dispatch(setIsRunning(false));
    }
  };

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
            sendMessage();
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
            className="sendButton padding-x-xl"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
