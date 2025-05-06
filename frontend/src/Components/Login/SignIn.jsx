import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import amazon from "../../assets/amazonblack.svg";
import styles from "./signup.module.css";
import { ToastContainer, toast, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;


const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await fetch(`${apiUrl}/login`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body:JSON.stringify({email})
      })

      const data = await res.json();

      if(res.ok){
        navigate('/loginPassword', { state: { email } });
      }
      else{
        toast.warn(data.message, {
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
      }

    }catch(error){
      console.log("Error"+error.message)
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
              <label htmlFor="email">Email</label>
              <input
                type="text"
                name="email"
                onChange={handleEmailChange}
                value={email}
                id="email"
              />
            </div>
            <button type="submit" className={styles.signin_btn}>
              Continue
            </button>

            <p className="text-sm">By continuing, you agree to Amazon's Conditions of Use and Privacy Notice.?</p>

            <div className='my-10'>
            <h5 className='font-bold'>Buying for work</h5>
            <p className='text-blue-900'>Shop on Amazon Business </p>
            </div>

          </form>
        </div>
        <div className={styles.create_accountinfo}>
          <p>New to Amazon?</p>
          <button>
            <NavLink to="/register">Create your Amazon Account</NavLink>
          </button>
        </div>
      </div>
         <ToastContainer />
    </section>
  );
};

export default SignIn;