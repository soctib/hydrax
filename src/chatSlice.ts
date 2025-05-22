import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

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
  apiKey: localStorage.getItem('hydrax.api.key') || '',
  input: '',
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

export const { addMessage, setMessages, clearMessages, setIsRunning, setApiKey, setInput } =
  chatSlice.actions;

export const sendMessageThunk = createAsyncThunk<void, void, { state: { chat: ChatState } }>(
  'chat/sendMessage',
  async (_, { getState, dispatch }) => {
    const state = getState().chat;
    const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const { apiKey, input, isRunning, messages } = state;
    if (!input.trim() || isRunning) return;
    const userMsg = {
      id: `${Date.now()}-user`,
      role: 'user' as const,
      content: [{ type: 'text' as const, text: input.trim() }],
    };
    dispatch(addMessage(userMsg));
    dispatch(setInput(''));
    dispatch(setIsRunning(true));
    try {
      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
          .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
          .map((p: any) => p.text)
          .join(''),
      }));
      if (!apiKey) {
        const systemMsg = {
          id: `${Date.now()}-system`,
          role: 'assistant' as const,
          content: [
            {
              type: 'text' as const,
              text: 'No API key is configured. Please go to Settings to add your OpenAI API key.',
            },
          ],
        };
        dispatch(addMessage(systemMsg));
        dispatch(setIsRunning(false));
        return;
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: apiMessages,
          stream: false,
        }),
      });
      const data = await response.json();
      const assistantMsg = {
        id: `${Date.now()}-assistant`,
        role: 'assistant' as const,
        content: [{ type: 'text' as const, text: data.choices[0].message.content }],
      };
      dispatch(addMessage(assistantMsg));
    } catch (error) {
      const errorMsg = {
        id: `${Date.now()}-error`,
        role: 'assistant' as const,
        content: [
          {
            type: 'text' as const,
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
      };
      dispatch(addMessage(errorMsg));
    } finally {
      dispatch(setIsRunning(false));
    }
  }
);

export default chatSlice.reducer;
