import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./cart.module.css";
import { RiDeleteBin7Line } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../../ContextProvider";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Cart = () => {
  const [cartData, setcartData] = useState([]);
  const { account, setAccount } = useContext(LoginContext);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchitems = async () => {
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (!res.ok) {
        toast.warn("Internal problem", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        setcartData(data.cart);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error("Unable to fetch cart items.");
    }
  };

  useEffect(() => {
    fetchitems();
  }, []);

  const deleteItem = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/removeItem/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Item removed from cart", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setcartData((prevcart) => prevcart.filter((item) => item.id !== id));
        setAccount((prev) => ({
          ...prev,
          cart: prev.cart.filter((item) => item.id !== id),
        }));
      } else {
        toast.warn(data.message || "Item not removed");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  useEffect(() => {
    const fetchTotalPrice = async () => {
      const res = await fetch(`${apiUrl}/cart/totalprice`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ selectedItems }),
      });
      const data = await res.json();
      if (res.ok) {
        setTotalPrice(data.totalPrice);
      }
    };

    fetchTotalPrice();
  }, [selectedItems]);

  const buyItemsFromCart = async () => {
    if (selectedItems.length === 0) return console.log("No items selected in cart");

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/buyItemsFromCart`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ selectedItems }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Purchase failed");
      }

      setSelectedItems([]);
      fetchitems(); // Refresh cart items
      navigate("/payment", { state: { loading: true, selectedItems } });
    } catch (error) {
      console.log("Internal problem: " + error.message);
      navigate("/payment", { state: { loading: false, error: error.message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.items}>
        <h2 className="text-3xl font-medium">Shopping Cart</h2>
        <div className="mt-2">
          <span className="text-s ">No items selected.</span>
          <span className="text-s mx-1 text-blue-900">Select all items</span>
          <div className="flex justify-end">Price</div>
        </div>

        {cartData.length > 0 ? (
          cartData.map((item, ind) => (
            <div className={styles.itemDesc} key={ind}>
              <div className={styles.productImg}>
                <input
                  type="checkbox"
                  className="mx-3 scale-[1.5] "
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <NavLink to={`/productdetail/${item.id}`}>
                  <img src={item.pro_imgs[0]} alt={item.shortTitle} />
                </NavLink>
              </div>
              <div className={styles.desc}>
              <div className={styles.descText}>
                <NavLink to={`/productdetail/${item.id}`}>
                <h3 className={`${styles.ItemTitle} text-xl`}>{item.ItemTitle}</h3>
                <p className="text-xs text-red-600 font-medium my-1.5">
                    In stock
                  </p>
                  <p className="text-s">Eligible for FREE Shipping</p>
                  <img
                    src="https://m.media-amazon.com/images/G/31/marketing/fba/fba-badge_18px._CB485936079_.png"
                    alt=""
                  />
                </NavLink>
                <div>
                  <input type="checkbox" className="h-4 w-4" />
                  <span> This will be a gift.</span>
                  <span className="text-blue-900">Learn more</span>
                </div>

                <div className={styles.selectOpt}>
                  <div>
                    <span className={styles.quantity}>
                      <button>
                        <RiDeleteBin7Line />
                      </button>
                      <span>1</span>
                      <button className="text-xl">
                        <IoIosAdd />
                      </button>
                    </span>
                  </div>
                  <div className={styles.options}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteItem(item.id);
                    }}
                  >
                    Delete
                  </a>
                  <span>|</span>
                  <a href="">Save for later</a>
                  <span>|</span>
                  <a href="">See more like this</a>
                  <span>|</span>
                  <a href="">Share</a>
                  </div>
                </div>
              </div>
              <div className={styles.descAmnt}>
                <h3 className="text-xl font-bold">
                  ₹{item.Price[0].deal_price}
                </h3>
              </div>

              </div>

            </div>
          ))
        ) : (
          <div>No Items in cart</div>
        )}

        <div className="flex justify-end">
          <h3 className="text-xl">
            {selectedItems.length > 0
              ? `Total: ₹${totalPrice}`
              : "No items selected"}
          </h3>
        </div>
      </div>

      <div className={styles.amount}>
        <h3 className="text-xl">
          {selectedItems.length > 0
            ? `Total: ₹${totalPrice}`
            : "No items selected"}
        </h3>
        <button
          onClick={selectedItems.length > 0 ? buyItemsFromCart : undefined}
          disabled={selectedItems.length === 0}
        >
          {selectedItems.length > 0 ? "Proceed to Buy" : "No items selected"}
        </button>

        <div className={styles.emi}>EMI Available</div>
      </div>
      <div style={{ position: "absolute", height: 0 }}>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Cart;