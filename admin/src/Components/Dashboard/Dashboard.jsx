import React, { useState, useEffect } from "react";
import styles from "./Dashboard.module.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Dashboard = () => {
  const [info, setInfo] = useState(null); 

  useEffect(() => {
    const allInfo = async () => {
      try {
        const res = await fetch(`${apiUrl}/dashboard`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log(data);
        setInfo(data);
      } catch (error) {
        console.error("Failed to load dashboard info:", error);
      }
    };
    allInfo();
  }, []);

  return (
    <div className={styles.container}>
      {info ? (
        <div className={styles.orderCard}>
          <div>Total Orders: {info.totalOrders}</div>
          <div>Total Users: {info.totalUsers}</div>
          <div>Total Products: {info.totalProducts}</div>
          <div>Total Revenue: ₹{info.totalRevenue}</div>
          <div>Orders Delivered: {info.totalOrdersDelivered}</div>
          <div>Orders Pending: {info.totalOrdersPending}</div>
        </div>
      ) : (
        <div>Loading dashboard...</div>
      )}
    </div>
  );
};

export default Dashboard;
