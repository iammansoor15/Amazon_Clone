import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import logo from "./assets/amazonblack.svg";
import "./App.css";
import Signup from "./Components/Login/Signup";
import Signin from "./Components/Login/Signin";
import SigninPassword from "./Components/Login/SigninPassword";

import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import AllUsers from "./Components/AllUsers/AllUsers";
import AllOrders from "./Components/AllOrders/AllOrders";

function App() {
  const [count, setCount] = useState(0);
  const location = useLocation();
  const hideNavbarAndFooter = [
    "/register",
    "/login",
    "/loginPassword",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      {!hideNavbarAndFooter &&       <div className="logoContainer">
        <img src={logo} alt="amazon logo" className="logo" />
      </div>}
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/loginPassword" element={<SigninPassword />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/allUsers" element={<AllUsers />} />
        <Route path="/allOrders" element={<AllOrders />} />

      </Routes>
    </>
  );
}

export default App;
