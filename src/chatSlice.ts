import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: { type: 'text'; text: string }[];
};

export type ChatState = {
  messages: ChatMessage[];
  isRunning: boolean;
  apiKey: string;
  input: string;
};

const initialState: ChatState = {
  messages: [],
  isRunning: false,
  apiKey: localStorage.getItem("hydrax.api.key") || "",
  input: "",
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setMessages(state, action: PayloadAction<ChatMessage[]>) {
      state.messages = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    setIsRunning(state, action: PayloadAction<boolean>) {
      state.isRunning = action.payload;
    },
    setApiKey(state, action: PayloadAction<string>) {
      state.apiKey = action.payload;
    },
    setInput(state, action: PayloadAction<string>) {
      state.input = action.payload;
    },
  },
});

export const { addMessage, setMessages, clearMessages, setIsRunning, setApiKey, setInput } = chatSlice.actions;
export default chatSlice.reducer;
