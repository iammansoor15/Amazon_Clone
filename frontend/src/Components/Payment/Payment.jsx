import styles from "./payment.module.css";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Oval } from "react-loader-spinner";
import successIcon from "../../assets/success.svg";

const apiUrl = import.meta.env.VITE_APP_API_URL;


const Payment = () => {
  const location = useLocation();
  const { loading, selectedItems, productid, error, mewadress } = location.state || { loading: true };

  const [orderStatus, setOrderStatus] = useState(null);
  const [pageLoading, setPageLoading] = useState(loading);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectAddress, setSelectAddress] = useState(mewadress || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (mewadress) {
      setSelectAddress(mewadress);
      console.log("Mr mansoor is printing here", mewadress);
      setPageLoading(false);
    }
  }, [mewadress]);
  

  useEffect(() => {
    if (selectedItems?.length > 0 || productid) {
      setPageLoading(false);
    }
  }, [selectedItems, productid]);

  useEffect(() => {
    let timer;
    if (orderStatus == "Success") {
      timer = setTimeout(() => {
        navigate("/");
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [orderStatus, navigate]);

  const setOrder = async () => {
    if (orderPlaced) return;
    setOrderPlaced(true);

    setPageLoading(true);

    try {
      const res = await fetch(`${apiUrl}/paymentSuceed`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          productIds: productid ? [productid] : selectedItems,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const data = await res.json();
      console.log("Order placed successfully:", data);
      setOrderStatus("Success");
    } catch (error) {
      console.error("Error placing order:", error.message);
      setOrderStatus("Failed");
      setOrderPlaced(false);
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      {pageLoading ? (
        <div className={styles.loaderWrapper}>
          <div>
            <Oval color="#32cd32" height={100} width={100} />
            <div>Order is processing.....</div>
          </div>
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>Error: {error}</div>
      ) : orderStatus === "Success" ? (
        <div className={styles.successMessage}>
          <img src={successIcon} alt="Success" className={styles.successIcon} />
          <div>Order Placed Successfully</div>
          <h3>Thank You</h3>
          <div>Redirecting to homepage</div>
        </div>
      ) : orderStatus === "Failed" ? (
        <div className={styles.errorMessage}>Failed to place order</div>
      ) : (
        <div className={styles.paymentDetails}>
          <div className={styles.container}>
            <div className={styles.addressContainer}>
              <div className={styles.heading}>Address</div>
              {selectAddress ? (
                <>
                  <div className={styles.firstname}>
                    {selectAddress.add_firstname} {selectAddress.add_lastname}
                  </div>
                  <div className={styles.address}>
                    <div>
                      {selectAddress.addressLine1}, {selectAddress.addressLine2}
                    </div>
                    <div>{selectAddress.pincode}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.firstname}>Mansoor</div>
                  <div className={styles.address}>
                    <div>Kalivelapalem, Near Rainbow CBSE School</div>
                    <div>Nellore, 534346</div>
                  </div>
                </>
              )}
            </div>
            <div className={styles.btnContainer}>
              <Link to="/newaddress" state={{ from: "/payment" }}>
                <button className={styles.addAddressBtn}>Add new addres</button>
              </Link>

              <Link to="/alladdresses" state={{ from: "/payment" }}>
                <button className={styles.selectAddressBtn}>
                  Select address
                </button>
              </Link>
            </div>
          </div>
          <button onClick={setOrder}>Pay</button>
        </div>
      )}
    </div>
  );
};

export default Payment;
