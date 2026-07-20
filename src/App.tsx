import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Experience from './pages/Experience/Experience';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App() {
  const [, setUsername] = useState<string | null>(null); // Username is set in Login; Home no longer uses it.

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#f0b45c',
          colorLink: '#f0b45c',
          colorBgBase: '#0a1628',
          colorTextBase: '#d8e2f0',
          fontFamily:
            "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      }}
    >
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
    </ConfigProvider>
  );
}

export default App;
