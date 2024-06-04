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

export default function App() {
  const { socket } = useWebSocketCtx();
  const settingsSID = useRef("");
  // const settingsSID = useAppSelector((state) => state.settings.values.sid);
  const dispatch = useAppDispatch();
  const location = useLocation();

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
    };
    const disconnectHandler = (reason: any) => {
      console.log("disconnect    APP.tsx");
      console.log("reason", reason);
      if (location.pathname !== "/dashboard/patient") {
        persistor.purge();
        dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid: "" } });
        settingsSID.current = "";
        dispatch({ type: "voicemap/INITIALIZE" });
        console.log(location.pathname);
        notifications.show({
          title: "Verbindung zum Backend fehlgeschlagen",
          message:
            "Das Backend ist aktuell nicht erreichbar. Entweder wurde das Backend beendet oder eine andere Webanwendung reserviert aktuell die Verbindung. Sollte eine BackendID angezeigt werden, kann diese Nachricht ignoriert werden.",
          color: "red",
          autoClose: false,
        });
      }
    };
    const clientsHandler = (clients: { sid: string; type: string }[]) => {
      console.log("clients    APP.tsx");
      // find audio client in clients array
      const audioClient = clients.find((item) => item.type === "audio");
      // if audio client is connected
      if (audioClient) {
        const { sid } = audioClient;
        if (location.pathname !== "/dashboard/patient") {
          console.log("location", location.pathname);
          console.log("settingsSID", settingsSID, "sid", sid);
          if (sid !== settingsSID.current) {
            // clear persisted state if sid of connected audio client changes
            persistor.purge();
            console.log("persistor.purge()");
            settingsSID.current = sid;
            dispatch({
              type: "settings/SET_CLIENT_SID",
              payload: { sid: sid },
            });
            dispatch({ type: "voicemap/INITIALIZE" });
            notifications.show({
              title: "Verbindung hergestellt",
              message: "Verbindung zum Backend mit ID " + sid + " hergestellt.",
              color: "green",
              autoClose: 2000,
            });
          }
        }
      }
    };

    socket.on("connect", connectHandler);
    socket.on("disconnect", disconnectHandler);
    socket.on("clients", clientsHandler);

    return () => {
      if (location.pathname === "/dashboard/patient") {
        socket.off("connect", connectHandler);
        socket.off("disconnect", disconnectHandler);
        socket.off("clients", clientsHandler);
      }
    };
  }, []);

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
