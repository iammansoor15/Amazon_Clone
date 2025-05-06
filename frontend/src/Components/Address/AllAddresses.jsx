import React, { useState, useEffect } from "react";
import styles from "./alladdresses.module.css";
import { MdAdd } from "react-icons/md";
import amazon_add_logo from '../../assets/amazon_add_logo.png'
import {useLocation, useNavigate, Link, useSearchParams,} from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;


const AllAddresses = () => {
  const [address, setAddress] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const location = useLocation();
  const { loading = true, error, mewaadress } = location.state || {};

  const addresses = async () => {
    try {
      const res = await fetch(`${apiUrl}/allAddresses`, {
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


  const setAsDefault = async (_id) => {
    try {
      const res = await fetch(`${apiUrl}/setAsDefault`, {
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


  const deleteAddress = async(_id)=>{
    try{
      const res = await fetch(`${apiUrl}/deleteAddress`,{
        method:"DELETE",
        credentials:"include",
        headers:{
          "Content-Type":"application/json"
        },
        body: JSON.stringify({ id: _id }),
      })
      if(!res.ok){
        throw new Error("error while fetching")
      }
      const data = await res.json();
      setAddress((prevAddresses) => prevAddresses.filter((addr) => addr._id !== _id));
    }catch(error){
      console.log("error while deleteing")
    }
  }
  

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
          <Link to="/newAddress" state={{ from: "/allAddresses" }}>
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
                  <div>{addr.add_firstname}</div>
                  <div>{addr.addressLine1}</div>
                  <div>{addr.addressLine2}</div>
                  <div>{addr.pincode}</div>
                  <div>{addr.add_phone}</div>
                  <div>Add delivery instruction</div>
                  </div>
                  <div className={styles.options}>
                    <div className={styles.option}>Edit</div>
                    <div className={styles.dash}>|</div>
                    <div className={styles.option} onClick={()=>deleteAddress(addr._id)}>Remove</div>
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