import React, { useContext, useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import amazon from "../../assets/amazonblack.svg";
import styles from "./signup.module.css";
import { ToastContainer, toast, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;


const SigninPassword = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [password, setPassword] = useState('');
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();


    try{
      const res = await fetch(`${apiUrl}/loginPassword`,{
        method:'POST',
        credentials:"include",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
      })
      const data = await res.json();


      if(res.ok){
          localStorage.setItem("account", JSON.stringify(data.user));
          await navigate('/');
      }else{
        toast.warn(data.message, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      }

    }catch(error){
      console.log("Error"+ error.message)
    }

  };

  return (
    <section>
      <div className={styles.sign_container}>
        <div className={styles.sign_header}>
          <img src={amazon} alt="signupimg" />
        </div>
        <div className={styles.sign_form}>
          <form method="POST" onSubmit={handleSubmit}>
            <h1>Sign-In</h1>
            <div className={styles.form_data}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onChange={handlePasswordChange}
                value={password}
                id="password"
              />
            </div>
            <button type="submit" className={styles.signin_btn}>
              Continue
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default SigninPassword;