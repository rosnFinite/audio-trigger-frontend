import { configureStore } from '@reduxjs/toolkit';
import voicemapDataReducer from "../components/map/voicemapDataSlice";
import settingsDataReducer from "../components/settings/settingsDataSlice";
import storage from 'redux-persist/lib/storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';

const persistConfig = {
  key: "root",
  storage
}

const persistedVoicemapReducer = persistReducer(persistConfig, voicemapDataReducer)
const persistedSettingsReducer = persistReducer(persistConfig, settingsDataReducer)

export const store = configureStore({
  reducer: {
    voicemap: persistedVoicemapReducer,
    settings: persistedSettingsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store