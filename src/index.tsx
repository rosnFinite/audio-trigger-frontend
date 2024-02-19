import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {MantineProvider} from "@mantine/core";
import {Provider} from "react-redux";
import {persistor, store} from "./redux/store";
import {PersistGate} from "redux-persist/integration/react";
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </PersistGate>
    </BrowserRouter>
  </Provider>
);
