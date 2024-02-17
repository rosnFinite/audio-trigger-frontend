import React from 'react';
import './styles/App.css';
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Settings from "./views/Settings";
import VoiceField from "./views/VoiceField";
import {socket} from "./socket";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Settings />} />
        <Route path="/field" element={<VoiceField socket={socket} />} />
      </Routes>
    </Router>
  );
}

