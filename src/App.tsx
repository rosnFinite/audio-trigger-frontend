import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { persistor } from "./redux/store";
import SocketContext from "./context/SocketContext";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import Patient from "./pages/Patient";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const socket = useContext(SocketContext);
  const settings = useAppSelector((state) => state.settings.values);
  const dispatch = useAppDispatch();

  // handles registering of web client to socketio backend and sets the audio client sid
  useEffect(() => {
    if (!socket) {
      console.error("Socket is not initialized");
      return;
    }
    socket.on("connect", () => {
      socket.emit("register", { type: "web" });
    });
    socket.on("connect_error", (error: Error) => {
      console.log("connect_error", error);
      persistor.purge();
      dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid: "" } });
      dispatch({ type: "voicemap/INITIALIZE" });
    });
    socket.on("clients", (clients: { sid: string; type: string }[]) => {
      console.log("clients event", clients);
      // find audio client in clients array
      const audioClient = clients.find((item) => item.type === "audio");
      // if audio client is connected
      if (audioClient) {
        const { sid } = audioClient;
        if (sid !== settings.sid) {
          // clear persisted state if sid of connected audio client changes
          persistor.purge();
          dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid } });
          dispatch({ type: "voicemap/INITIALIZE" });
        }
      } else {
        // clear persisted state if audio client is disconnected or not found
        dispatch({ type: "settings/SET_CLIENT_SID", payload: { sid: "" } });
        dispatch({ type: "voicemap/INITIALIZE" });
      }
    });
  }, [socket]);

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
