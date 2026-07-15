import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Experience from './pages/Experience/Experience';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App() {
  const [, setUsername] = useState<string | null>(null); // Username is set in Login; Home no longer uses it.

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<Profile />} />
          <Route path="experience" element={<Experience />} />
        </Route>
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App; 