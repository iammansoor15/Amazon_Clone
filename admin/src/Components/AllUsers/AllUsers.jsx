import React, { useState, useEffect } from "react";
import styles from "./AllUsers.module.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const allUsers = async () => {
      const res = await fetch(`${apiUrl}/allUsers`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      setUsers(data);
    };
    allUsers();
  }, []);

  return (
    <div className={styles.container}>
      {users.length > 0 ? (
        <div className={styles.userContainer}>
          {users.map((user, ind) => (
            <div key={ind} className={styles.userCard}>
              <div>{user._id}</div>
              <div className={styles.userName}>
                <div>{user.firstname}</div>
                <div>{user.lastname}</div>
              </div>
              <div>{user.email}</div>
              <div>{user.phone}</div>
              <div>{user.role}</div>

            </div>
          ))}
        </div>
      ) : (
        <div>No users found</div>
      )}
    </div>
  );
};

export default AllUsers;
