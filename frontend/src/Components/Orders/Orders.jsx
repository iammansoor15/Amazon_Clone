import React, { useEffect, useState } from "react";
import styles from "./orders.module.css";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { NavLink, useNavigate  } from "react-router-dom";
import { Oval } from "react-loader-spinner"; 
import buyAgain from "../../assets/buyAgain.png";
import { ToastContainer, toast, Bounce} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;



const Orders = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [orders,setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${apiUrl}/usersOrders`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);



  const buyItem = async (id) => {
    try {
        const res = await fetch(`https://amazon-clone-8ajl.onrender.com/buyItem/${id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({products})
        });

        const data = await res.json();
        console.log(data);

        if (!res.ok) {
            throw new Error('Failed to buy item');
        }

        setOrders(data); 
        navigate("/payment", { state: { loading: true, productid: id } });

        toast.success("Item added to cart", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });

        console.log(data);
    } catch (error) {
        console.error("Error buying item:", error);
        toast.error("Failed to buy item. Please try again.");
    }
};




  return (
    <div className={styles.container}>
      <div className={styles.taskbar}>
        <div className={styles.title}>Your Orders</div>
        <div className={styles.search}>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search all orders"
              className={styles.searchInput}
            />
          </div>
          <button className={styles.searchBtn}>Search Orders</button>
        </div>
      </div>

      <div className="flex items-center mb-5">
        <div className="text-s font-bold">{products.length} Orders</div>
        <div className="text-s mx-1">placed in</div>
        <div className={styles.filter}>
          Last 3 months <FaChevronDown />
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Oval color="#32cd32" height={50} width={50} />
          <div>Fetching your orders...</div>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            products.map((item, ind) => (
              <div className={styles.orderItems} key={ind}>
                <div className={styles.deliveryBar}>
                  <div className={styles.deliveryDetails}>
                    <div className={styles.orderPlace}>
                      <div>Order Placed</div>
                      <div>
                        {new Date(item.time).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <div className={styles.amount}>
                      <div>Total</div>
                      <div>₹ {item.price ?? "N/A"}</div>
                    </div>
                    <div className={styles.address}>
                      <div>Ship To</div>
                      <div className={styles.userAddress}>
                        <div className={styles.userName}>{item.firstname}</div>
                        <div className={styles.dropdown}>
                          <div>Mansoor</div>
                          <div>
                            Chenchuramapuram Kalivelapalem, Nellore, ANDHRA
                            PRADESH 524346 India
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.orderDetails}>
                    <div>Order #{item.orderId}</div>
                    <div className={styles.orderDetailOptions}>
                      <div>View Order details</div>
                      <div>Invoice</div>
                    </div>
                  </div>
                </div>
                <div className={styles.productBar}>
                  <div className={styles.deliverydate}>
                    Delivered on{" "}
                    {new Date(item.time).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button>Get product support</button>
                </div>
                <div className={styles.productInfo}>
                  <div className={styles.productImg}>
                    <NavLink to={`/productdetail/${item.productId}`}>
                      <img src={item.productImg} alt="" />
                    </NavLink>
                  </div>
                  <div className={styles.productDes}>
                    <NavLink to={`/productdetail/${item.productId}`}>
                      <div className={styles.productTitle}>
                        {item.productTitle}
                      </div>
                    </NavLink>
                    <div>Return window closed on 26 February 2025</div>
                    <div className={styles.productInfoBtns}>
                    <button onClick={() => {console.log("Item data:", item); buyItem(item.productId);}}>

                        <img src={buyAgain} alt="" />
                        <div>Buy it again</div>
                      </button>
                      <button>View your item</button>
                    </div>
                  </div>
                  <div className={styles.productReview}>
                    <button>Track Package</button>
                    <button>Leave seller feedback</button>
                    <button>Leave delivery feedback</button>
                    <button>Write product review</button>
                  </div>
                </div>
                <div className={styles.bottomDiv}>Archive Order</div>
              </div>
            ))
          ) : (
            <div>No products found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
