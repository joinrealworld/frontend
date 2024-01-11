/* Core */
import { configureStore } from '@reduxjs/toolkit';
import storage from '@/redux/storage';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

/* Instruments */
import { reducer } from './rootReducer';
import { middleware } from './middleware'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: true,
      serializableCheck: false
    }).concat(middleware)
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export const persister = persistStore(store);
