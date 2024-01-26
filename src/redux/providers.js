'use client'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persister, store } from '@/redux';
import { NextUIProvider } from '@nextui-org/react';

export const StoreProvider = (props) => {
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  );
}

export const PersistGateProvider = ({ children }) => {
  return (
    <PersistGate loading={null} persistor={persister}>
      {children}
    </PersistGate>
  );
}

export const NextUIProviderWrap = ({ children }) => {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
