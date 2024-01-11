'use client'

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persister, store } from '@/redux';

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
