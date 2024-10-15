import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { persistor } from "./redux/store";
import { useWebSocketCtx } from "./context";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Patient from "./pages/Patient";
import Dashboard from "./pages/Dashboard";
import { notifications } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

export default function App() {
  const { socket } = useWebSocketCtx();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hasConErrorNotificationOccurred = useRef(false);
  const updatableNotificationId = useRef<string | null>(null);

  // handles registering of web client to socketio backend and sets the audio client sid
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    const connectHandler = () => {
      console.log("connect    APP.tsx");
      // need to specifically handle patient view -> should not register as web client
      // also in following event handlers
      if (location.pathname === "/dashboard/patient") {
        socket.emit("register", { type: "web_patient" });
      } else {
        socket.emit("register", { type: "web" });
      }
      hasConErrorNotificationOccurred.current = false;
    };

    const connectErrorHandler = (error: any) => {
      console.log("connect error:", error);
      if (
        location.pathname !== "/dashboard/patient" &&
        !hasConErrorNotificationOccurred.current
      ) {
        // when connection error occurs, clear persisted state and show loading notification
        // after backend disconnect, recordings can't be continued
        persistor.purge();
        dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid: "" } });
        dispatch({ type: "voicemap/INITIALIZE" });
        updatableNotificationId.current = notifications.show({
          withCloseButton: false,
          loading: true,
          title: "Backend nicht verbunden!",
          message:
            "Es wird versucht, die Verbindung zum Backend wiederherzustellen.",
          color: "blue",
          autoClose: false,
        });
        hasConErrorNotificationOccurred.current = true;
      }
    };

    const disconnectHandler = (reason: any) => {
      console.log("disconnect reason:", reason);
    };

    const clientsHandler = (clients: { sid: string; type: string }[]) => {
      console.log("clients    APP.tsx");
      // find audio client in clients array
      const audioClient = clients.find((item) => item.type === "audio");
      // if audio client is connected
      if (audioClient) {
        const { sid } = audioClient;
        if (location.pathname !== "/dashboard/patient") {
          console.log("audio client sid:", sid);
          // only update loading notification if it exist (no page reload happened)
          dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid: sid } });
          if (updatableNotificationId.current !== null) {
            notifications.update({
              id: updatableNotificationId.current,
              title: "Verbindung hergestellt",
              loading: false,
              message: "Verbindung zum Backend mit ID " + sid + " hergestellt.",
              icon: <TbCheck />,
              color: "green",
              autoClose: 2000,
            });
          }
        }
      }
    };

    const clientErrorHandler = (error: {
      type: string;
      title: string;
      message: string;
    }) => {
      notifications.show({
        withCloseButton: true,
        title: error.title,
        message: error.message,
        color: error.type === "warning" ? "orange" : "red",
        autoClose: 5000,
      });
    };

    socket.on("connect", connectHandler);
    socket.on("disconnect", disconnectHandler);
    socket.on("clients", clientsHandler);
    socket.on("connect_error", connectErrorHandler);
    socket.on("client_error", clientErrorHandler);

    return () => {
      if (location.pathname === "/dashboard/patient") {
        socket.off("connect", connectHandler);
        socket.off("disconnect", disconnectHandler);
        socket.off("clients", clientsHandler);
        socket.off("connect_error", connectErrorHandler);
        socket.off("client_error", clientErrorHandler);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Careful  when using HashRouter: Different behaviour between NavLink in Layout and Link from react-router-dom. href in NavLink needs /#/pathname whereas Link works without prepending /# to /pathname
  return (
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="/dashboard">
        <Route index element={<Dashboard />} />
        <Route path="patient" element={<Patient />} />
      </Route>
      <Route path="/logs" element={<Logs />} />
    </Routes>
  );
}
