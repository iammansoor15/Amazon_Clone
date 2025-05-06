import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import amazon from "../../assets/amazonblack.svg";
import styles from "./signup.module.css";
import { ToastContainer, toast, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;


const Signup = () => {
    const navigate = useNavigate();
    const [udata, setUdata] = useState({
        firstname: "",
        lastname:"",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    });

    const adddata = (e) => {
        const { name, value } = e.target;
        setUdata((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const senddata = async (e) => {
        e.preventDefault();
        const {firstname,lastname, email,phone,password,cpassword} = udata;

        const res = await fetch(`${apiUrl}/register`, {
            method: "POST",
            credentials:"include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({firstname,lastname, email, phone, password, cpassword }),
        })
        const data = await res.json();
        
        if (res.ok) {
            toast.success("Registered Successfully", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              })
              localStorage.setItem("account", JSON.stringify(data));
              await navigate('/');
        } else {

            toast.warn(data.error ||'Registration failed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                })
            console.error('Registration failed:', data);
        }
    };

    return (
        <section>
            <div className={styles.sign_container}>
                <div className={styles.sign_header}>
                    <img src={amazon} alt="signupimg" />
                </div>
                <div className={styles.sign_form}>
                    <form method="POST">
                        <h1>Create account</h1>
                        <div className={styles.form_data}>
                            <label htmlFor="firstname">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                onChange={adddata}
                                value={udata.firstname}
                                id="firstname"
                                placeholder='First name'
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="lastname">Last name</label>
                            <input
                                type="text"
                                name="lastname"
                                onChange={adddata}
                                value={udata.lastname}
                                id="lastname"
                                placeholder='Last name'
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                onChange={adddata}
                                value={udata.email}
                                id="email"
                                placeholder='Enter email'
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="mobile">Mobile number</label>
                            <input
                                type="text"
                                name="phone"
                                onChange={adddata}
                                value={udata.phone}
                                id="phone"
                                placeholder='Enter your mobile number'
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                onChange={adddata}
                                value={udata.password}
                                id="password"
                                placeholder="At least 6 characters"
                            />
                        </div>
                        <div className={styles.form_data}>
                            <label htmlFor="passwordg">Password again</label>
                            <input
                                type="password"
                                name="cpassword"
                                onChange={adddata}
                                value={udata.cpassword}
                                id="passwordg"
                                placeholder='Re-type password'
                            />
                        </div>
                        <button
                            type="submit"
                            className={styles.signin_btn}
                            onClick={senddata}>
                            Continue
                        </button>

                        <div className={styles.signin_info}>
                            <p>Already have an account?</p>
                            <NavLink to="/login">Sign in</NavLink>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default Signup;
