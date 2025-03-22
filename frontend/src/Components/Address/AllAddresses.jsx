import React from "react";
import styles from "./alladdresses.module.css";
import { MdAdd } from "react-icons/md";
import { useLocation, useNavigate, Link } from "react-router-dom";

const AllAddresses = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div>Your Addresses</div>
        <div className={styles.addressContainer}>
            <Link to="/newAddress">
            <div className={styles.addNewAddress}>
            <div><MdAdd /></div>
            <div>Add Address</div>
          </div></Link>

          <div className={styles.existingAddress}> 
            <div>Mansoor</div>
            <div>Chenchurampuram</div>
            <div>Kalivelapalem, Nellore rural</div>
            <div>Nellore,524346</div>
            <div>Add delivery instruction</div>
            <div className={styles.options}>
                <div>Edit</div>
                <div className={styles.dash}>|</div>
                <div>Remove</div>
            </div>
          </div>
          <div className={styles.existingAddress}>Address 2</div>
          <div className={styles.existingAddress}>Address 3</div>
          <div className={styles.existingAddress}>Address 4</div>
          <div className={styles.existingAddress}>Address 5</div>
        </div>
      </div>
    </div>
  );
};

export default AllAddresses;
