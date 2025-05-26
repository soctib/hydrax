import { configureStore } from '@reduxjs/toolkit';
import { createProjectsSlice } from './projectStorage';
import chatReducer from './chatSlice';
import designerReducer from './designerSlice';
import projectsReducer from './projectsSlice';
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

function getInitialProjects() {
  const PREFIX = 'hydrax.project.';
  const projects = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX)) {
      try {
        const meta = JSON.parse(localStorage.getItem(key) || '{}');
        if (meta && meta.id && meta.name) {
          projects.push(meta);
        }
      } catch {
        // Ignore malformed project meta in localStorage
      }
    }
  }
  return projects;
}

const projectsSlice = createProjectsSlice(getInitialProjects());

const rootReducer = combineReducers({
  chat: chatReducer,
  designer: designerReducer,
  projects: projectsReducer,
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
export const { setProjects } = projectsSlice.actions;
