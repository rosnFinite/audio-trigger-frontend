import React from 'react';
import './styles/App.css';
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Settings from "./views/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Settings />} />
      </Routes>
    </Router>
  );
}

