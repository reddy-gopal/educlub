
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/student/home";
import HomeAdmin from "./components/admin/home"; 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/home" element={<HomeAdmin />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
