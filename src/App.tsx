import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Settings from "./views/Settings";
import VoiceField from "./views/VoiceField";
import {socket} from "./socket";
import Patient from './views/Patient';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { persistor } from './redux/store';

export default function App() {
  const settings = useAppSelector((state) => state.settings.values);
  const dispatch = useAppDispatch();

  // handles registering of web client to socketio backend and sets the audio client sid
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("registerClient", {type: "web"});
    });
    socket.on("clients", (clients: {sid: string, type: string}[]) => {
      console.log("clients event", clients);
      // find audio client in clients array
      const audioClient = clients.find(item => item.type === "audio");
      // if audio client is connected
      if (audioClient) {
        const { sid } = audioClient;
        if (sid !== settings.sid) {
          // clear persisted state if sid of connected audio client changes
          persistor.purge();
          dispatch({type: "settings/SET_CLIENT_SID", payload: {sid}});
        }
      } else {
        // clear persisted state if audio client is disconnected or not found
        dispatch({type: "settings/SET_CLIENT_SID", payload: {sid: ""}});
      }
    });
  }, []);

  return(
    <Routes>
      <Route path="/" element={<Settings socket={socket}/>} />
      <Route path="/stimmfeld">
        <Route index element={<VoiceField socket={socket} />} />
        <Route path="patientenansicht" element={<Patient socket={socket} />} />
      </Route>
    </Routes>
  );
}

