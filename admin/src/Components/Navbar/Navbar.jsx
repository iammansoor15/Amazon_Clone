import React, { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${apiUrl}/isLoggedIn`, {
          method: "GET",
          credentials: "include", 
        });

        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    const res = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      toast.warn(data.message, {
        position: "top-right",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      setIsLoggedIn(false);
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.options}>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/allUsers">Users</Link>
        </li>
        <li>
          <Link to="/allOrders">Orders</Link>
        </li>
        <li>
          {isLoggedIn ? (     
              <Link to="/logout" onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
