import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import AdminDashboard from './pages/AdminDashboard';
import Prediction from './pages/prediction/Prediction';
import Fertilizer from './pages/fertilizers/fertilizer';
import Contact from './pages/contact/Contact';
import Solution from './pages/contact/Solution';
import User from './pages/user/User';
import { useIsAdmin } from './auth';

function App() {
  const [tokenChecked, setTokenChecked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/");
    }
    setTokenChecked(true); // Mark that we've checked/stored the token
  }, []);

  const isAdmin = useIsAdmin();

  if (!tokenChecked) {
    // Wait until token is processed
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="unauthorized">
        <h2>You cannot access this page directly</h2>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Header />
      <div className='main'>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/fertilizers" element={<Fertilizer />} />
          <Route path="/contact/Contact" element={<Contact />} />
          <Route path="/contact/Solution" element={<Solution />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;