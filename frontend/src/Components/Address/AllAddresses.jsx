import React, { useState, useEffect } from "react";
import styles from "./alladdresses.module.css";
import { MdAdd } from "react-icons/md";
import amazon_add_logo from '../../assets/amazon_add_logo.png'
import {useLocation, useNavigate, Link, useSearchParams,} from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllAddresses = () => {
  const [address, setAddress] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const location = useLocation();
  const { loading = true, error, mewaadress } = location.state || {};

  const addresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/allAddresses", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        console.log("error while fetching");
        toast.warn(data.message || "Failed to fetch addresses");
      } else {
        setAddress(data);
        setPageLoading(false);
      }
    } catch (error) {
      toast.warn(error.message || "Something went wrong!");
      setPageLoading(false);
    }
  };


  const removeAddrsses = async (_id) => {
    try {
        const res = await fetch("http://localhost:5000/deleteAddress", {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ id: _id }),
        });

        if (!res.ok) {
            throw new Error("Failed to delete address");
        }

        const data = await res.json();
        setAddress((prevAddresses) => prevAddresses.filter(addr => addr._id !== _id));
        toast.success("Address deleted successfully");
    } catch (error) {
        console.error("Error deleting address:", error);
        toast.error(error.message || "Something went wrong!");
    }
};


  const setAsDefault = async (_id) => {
    try {
      const res = await fetch("http://localhost:5000/setAsDefault", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: _id }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to set default address");
      }
  
      const data = await res.json();
      setAddress(data);
      setPageLoading(false);
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.warn(error.message || "Something went wrong!");
    }
  };
  

  useEffect(() => {
    if (mewaadress) {
      setAddress(mewaadress);
      addresses();
      localStorage.setItem("account", JSON.stringify(address));
      setPageLoading(false);
    } else {
      addresses();
    }
  }, [mewaadress]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div>Your Addresses</div>
        <div className={styles.addressContainer}>
          <Link to="/newAddress" state={{ from: "/allAddress" }}>
            <div className={styles.addNewAddress}>
              <div>
                <MdAdd />
              </div>
              <div>Add Address</div>
            </div>
          </Link>

          {address.length > 0 ? (
            address.map((addr, ind) => (
              <div key={ind} className={styles.addressBox}>
                {ind === 0 && (
                  <div className={styles.defaultAddress}>
                    <div>Default :</div>
                    <img src={amazon_add_logo} alt="amazon logo" />
                  </div>
                )}
                <div className={styles.existingAddress}>
                  <div>
                  <div>{addr.add_firstname}</div>
                  <div>{addr.addressLine1}</div>
                  <div>{addr.addressLine2}</div>
                  <div>{addr.pincode}</div>
                  <div>{addr.add_phone}</div>
                  <div>Add delivery instruction</div>
                  </div>
                  </div>
                  <div className={styles.options}>
                    <div className={styles.option}>Edit</div>
                    <div className={styles.dash}>|</div>
                    <div className={styles.option} onClick={()=>removeAddrsses(addr._id)}>Remove</div>
                    {ind !== 0 && (
                      <>
                        <div className={styles.dash}>|</div>
                        <div className={styles.option} onClick={()=>setAsDefault(addr._id)}>set as default</div>
                      </>
                    )}
                  </div>
              </div>
            ))
          ) : (
            <p>No addresses found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAddresses;
