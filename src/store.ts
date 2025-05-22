import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './chatSlice.ts';
import designerReducer from './designerSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import logger from 'redux-logger';

const rootReducer = combineReducers({
  chat: chatReducer,
  designer: designerReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['chat', 'designer'], // persist chat and designer slices
  blacklist: ['isRunning'], // do not persist isRunning
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
