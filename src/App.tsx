import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Settings from "./views/Settings";
import VoiceField from "./views/VoiceField";
import {socket} from "./socket";
import Patient from './views/Patient';

export default function App() {
  return(
    <Routes>
      <Route path="/" element={<Settings socket={socket}/>} />
      <Route path="/stimmfeld">
        <Route index element={<VoiceField socket={socket} />} />
        <Route path="patientenansicht" element={<Patient />} />
      </Route>
    </Routes>
  );
}

