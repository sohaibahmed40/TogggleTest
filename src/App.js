import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from "./pages/signin";
import SignUp from "./pages/signup";
import Dashboard from "./pages/dashboard";
import PublicRoute from "./routes/public.routes";
import PrivateRoute from "./routes/private.routes";
import { getToken } from "./services/auth.service";

function App() {
  const [loggedIn, setLoggedIn] = useState(getToken() ? true : false);
  const handleLogin = () => setLoggedIn(true);
  const handleLogout = () => setLoggedIn(false);
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<PublicRoute token={loggedIn}><Login handleLogin={handleLogin} /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute token={loggedIn}> <Login handleLogin={handleLogin} /></PublicRoute>} />
          <Route path="/sign-up" element={<PublicRoute token={loggedIn}><SignUp /></PublicRoute>} />
          <Route path="/dashboard" element={<PrivateRoute token={loggedIn}><Dashboard handleLogout={handleLogout} /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}
export default App
