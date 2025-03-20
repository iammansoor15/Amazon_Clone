import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import amazon from "../../assets/amazonblack.svg";
import styles from './address.module.css';
import { LoginContext } from "../../ContextProvider";

const Address = () => {
    const { account } = useContext(LoginContext);
    const navigate = useNavigate();

    const [udata, setUdata] = useState({
        add_firstname: account?.firstname || "", 
        add_lastname: account?.lastname || "",
        add_email: account?.email || "",
        add_phone: account?.phone || "",
        pincode: "",
        addressLine1: "",
        addressLine2: "",
        landmark: ""
    });

    const adddata = (e) => {
        const { name, value } = e.target;
        setUdata((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const submitData = async () => {
        console.log(udata);
    };
    
    return (
        <section>
            <div className={styles.address_container}>
                <div className={styles.address_form}>
                    <form method="POST">
                        <h1>Add a new address</h1>
                        <div className={styles.name}>
                            <div className={styles.form_data}>
                                <label htmlFor="add_firstname">First Name</label>
                                <input
                                    type="text"
                                    name="add_firstname"
                                    onChange={adddata}
                                    value={udata.add_firstname}
                                    id="add_firstname"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div className={styles.form_data}>
                                <label htmlFor="add_lastname">Last Name</label>
                                <input
                                    type="text"
                                    name="add_lastname"
                                    onChange={adddata}
                                    value={udata.add_lastname}
                                    id="add_lastname"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="add_email">Email</label>
                            <input
                                type="email"
                                name="add_email"
                                onChange={adddata}
                                value={udata.add_email}
                                id="add_email"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="add_phone">Mobile Number</label>
                            <input
                                type="text"
                                name="add_phone"
                                onChange={adddata}
                                value={udata.add_phone}
                                id="add_phone"
                                placeholder="Enter your mobile number"
                            />
                        </div>

                        <div className={styles.form_data}>
                            <label htmlFor="pincode">Pin Code</label>
                            <input
                                type="number"
                                name="pincode"
                                onChange={adddata}
                                value={udata.pincode}
                                id="pincode"
                                placeholder="6-digit PIN code"
                            />
                        </div>

                        <div className={styles.form_data}>
                            <label htmlFor="addressLine1">Flat, House No., Building, Apartment</label>
                            <input
                                type="text"
                                name="addressLine1"
                                onChange={adddata}
                                value={udata.addressLine1}
                                id="addressLine1"
                                placeholder="Enter your address"
                            />
                        </div>

                        <div className={styles.form_data}>
                            <label htmlFor="addressLine2">Area, Street, Sector, Village</label>
                            <input
                                type="text"
                                name="addressLine2"
                                onChange={adddata}
                                value={udata.addressLine2}
                                id="addressLine2"
                                placeholder="Enter street details"
                            />
                        </div>

                        <div className={styles.form_data}>
                            <label htmlFor="landmark">Landmark</label>
                            <input
                                type="text"
                                name="landmark"
                                onChange={adddata}
                                value={udata.landmark}
                                id="landmark"
                                placeholder="E.g. near Apollo Hospital"
                            />
                        </div>

                        <div className={styles.defaultAddress}>
                            <input type="checkbox" id="add_defaultAddress" />
                            <label htmlFor="add_defaultAddress">Make this my default address</label>
                        </div>
                        <button className={styles.addressBtn}
                         onClick={(e) => {e.preventDefault(); submitData();}}>
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Address;
