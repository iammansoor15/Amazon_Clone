import React, { useContext, useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import amazon from "../../assets/amazon.svg";
import { GoSearch } from "react-icons/go";
import { FaCartShopping } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import Text from "./Text";
import flagImage from "../../assets/flagImage.jpg";
import { useNavigate, Link } from "react-router-dom";
import { LoginContext } from "../../ContextProvider";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoClick = () => {
    navigate("/");
  };

  const { account, setAccount } = useContext(LoginContext);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${apiUrl}/cart`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.cart) {
          setAccount((prev) => ({ ...prev, cart: data.cart }));
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    if (account) {
      fetchCart();
    } else {
      console.log("Logged out");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/products/search?query=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  const handleLogout = async () => {
    const res = await fetch(`${apiUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      toast.warn(data.message, {
        position: "top-right",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      localStorage.removeItem("account");
      setAccount(null);
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.items} flex`}>
        <img src={amazon} alt="amazon-logo" onClick={handleLogoClick} />
        <div className={`${styles.location} `}>
          <span className="text-white/70 text-xs ml-5 tracking-tighter">
            Deliver to Mansoor
          </span>
          <span className="flex text-white text-l  font-bold  -my-1">
            <FaLocationDot className="text-white pr-1" />
            <span className="mr-2">Nellore</span>
            <span>524346</span>
          </span>
        </div>
      </div>

      <div className={`${styles.searchbar}`}>
        <div className={styles.filter}>
          All <i>&#9660;</i>{" "}
        </div>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={`${styles.search}`}>
            <GoSearch className={`${styles.magnify}`} />
          </button>
        </form>
      </div>

      <div className={`${styles.items2}`}>
        <div className={styles.language}>
          <img src={flagImage} alt="indian flag image" />
          <div>EN</div>
          <i>&#9660;</i>
        </div>

        <div className={`${styles.text}`}>
          <div className={styles.text1}>
          {account ? (
            <Link to="/logout" onClick={handleLogout}>
              <Text
                CText={`Hello, ${account.firstname}`}
                HText={
                  <span className={styles.accountLink}>
                    Accounts & Lists <i>&#9660;</i>
                  </span>
                }
              />
            </Link>
          ) : (
            <Link to="/login">
              <Text CText="Hello, sign in" HText={<span className={styles.accountLink}>
                    Accounts & Lists <i>&#9660;</i>
                  </span>} />
            </Link>
          )}
          </div>

          <div className={styles.text2}>
          {account ? (
            <Link to="/orders">
              <Text CText="Returns" HText="&orders" />
            </Link>
          ) : (
            <Link to="/login">
              <Text CText="Returns" HText={<span>&  orders</span>} />
            </Link>
          )}
          </div>
        </div>
        <Link to={account ? "/cart" : "/login"} className={`${styles.cart}`}>
          <div>
            <FaCartShopping className={`${styles.cartIcon}`} />
            <h3>{account?.cart?.length}</h3>
          </div>
          <div>Cart</div>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
