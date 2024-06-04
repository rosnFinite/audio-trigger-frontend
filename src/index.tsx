import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { HashRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
// import SocketContext, { socket } from "./context/SocketContext";
import WebSocketCtxProvider from "./context/provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <HashRouter>
      <WebSocketCtxProvider>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <MantineProvider>
            <Notifications limit={5} position="bottom-left" />
            <App />
          </MantineProvider>
        </PersistGate>
      </WebSocketCtxProvider>
    </HashRouter>
  </Provider>
);
