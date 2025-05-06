import React, { useState, useEffect } from "react";
import styles from "./AllOrders.module.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const AllOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}/allOrders`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data);
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);
  

  return (
    <div className={styles.container}>
      {orders.length > 0 ? (
        <div className={styles.orderContainer}>
          {orders.map((order, ind) => (
            <div key={ind} className={styles.orderCard}>
              <div>Order ID: {order.orderId}</div>
              <div>User ID: {order.userId}</div>
              <div>Product ID: {order.productId}</div>
              <div>Status: {order.orderStatus}</div>
              <div>Delivery: {order.deliveryStatus}</div>
              <div>
                Ordered On: {new Date(order.orderDate).toLocaleDateString()}
              </div>
              <div>
                Delivery By: {new Date(order.deliverDate).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No Orders found</div>
      )}
    </div>
  );
};

export default AllOrders;
