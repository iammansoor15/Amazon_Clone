import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { MdOutlineIosShare } from "react-icons/md";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from "../../ContextProvider";
import "@fortawesome/fontawesome-free/css/all.min.css";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { account, setAccount } = useContext(LoginContext);
  const [orders, setOrders] = useState(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${apiUrl}/productdetail/${id}`);
        if (!response.ok) throw new Error("Failed to fetch Products");

        const data = await response.json();
        setProduct(data.Products?.[0] || null);
      } catch (error) {
        console.log("Error: " + error.message);
      }
    };
    fetchProducts();
  }, [id]);

  if (!product) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }
  const images = product.pro_imgs || [];

  const addToCart = async (id) => {
    const response = await fetch(`${apiUrl}/addToCart/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product }),
    });

    const data = await response.json();

    if (!response.ok) {
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
      toast.success("Item added to cart", {
        position: "top-right",
        autoClose: 900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      localStorage.setItem("account", JSON.stringify(data));
      setAccount(data);
      console.log("This is data");
      console.log(data);
    }
  };

  const buyItem = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/buyItem/${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to buy item");
      }

      setOrders(data);
      toast.success("Item added to cart", {
        position: "top-right",
        autoClose: 1000,
        theme: "colored",
      });

      navigate("/payment", { state: { loading: true, productid: id } });
    } catch (error) {
      console.error("Error buying item:", error);
      toast.error("Failed to buy item. Please try again.");
    }
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.imageContainer}>
          <div className={styles.allImages}>
            {images.map((img, index) => (
              <div
                className={`${styles.exampleImages} ${
                  selectedImage === img ? styles.selected : ""
                }`}
                key={index}
                onClick={() => {
                  setMainImage(img);
                  setSelectedImage(img);
                }}
              >
                <img src={img} alt={`product-${index}`} />
              </div>
            ))}
          </div>

          <div className={styles.mainImageContainer}>
            <div className={styles.share}>
              <MdOutlineIosShare />
            </div>
            <div className={styles.productImage}>
              <img src={mainImage || images[0]} alt="main product" />
            </div>
          </div>
        </div>

        <div className={`${styles.textContainer} flex flex-col-reverse md:flex-row my-10`}>
          <div className={`${styles.descContainer} min-w-3/4 px-10`}>
            <h1 className="text-3xl font-medium">{product.ItemTitle}</h1>
            <div className="flex mb-5">
              <div className={styles.productNameProductRating}>
                <StarRateIcon sx={{ fontSize: "20px", color: "#de7921" }} />
                <StarRateIcon sx={{ fontSize: "20px", color: "#de7921" }} />
                <StarRateIcon sx={{ fontSize: "20px", color: "#de7921" }} />
                <StarRateIcon sx={{ fontSize: "20px", color: "#de7921" }} />
                <StarOutlineIcon sx={{ fontSize: "20px", color: "#de7921" }} />
              </div>
              <p className="text-blue-900 mx-5">2807 ratings</p>
            </div>
            <div>
              <span className="text-xs font-bold">300+ bought</span>
              <span className="text-xs px-2">in past month</span>
            </div>
            <span className="bg-red-600 px-2 py-1 text-white text-xs font-bold">
              Limited time deal
            </span>
            <div className="flex">
              <span className="text-2xl font-light">-69%</span>
              <span className="text-2xl font-medium px-3">
                ₹{product.Price[0].deal_price}
              </span>
            </div>

            <div className="flex">
              <span className="text-xs font-normal">M.R.P :</span>
              <span className="text-xs line-through font-">
                ₹{product.Price[0].org_price}
              </span>
            </div>

            <span className="text-s">Inclusive of all taxes</span>
            <div className="flex">
              <span className="text-s font-bold">EMI</span>
              <span className="text-s px-2">starts at ₹95 per month.</span>
              <span className="text-s text-blue-900">EMI options</span>
            </div>

            <div>
              <span className="text-s font-bold">Colour:</span>
              <span className="text-s">Black</span>
            </div>

            <div className="my-10">
              <h3 className="text-xl font-bold mb-3">Additional Information</h3>
              {product.add_info.map((item, ind) => (
                <div key={ind} className="flex mb-3">
                  <div className="min-w-[150px] max-w-[150px] font-bold">
                    {item.key}:
                  </div>
                  <div className="ml-2">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="my-5">
              <h3 className="text-xl font-bold mb-3">About this item</h3>
              <ul className="ml-5 list-disc">
                {product.desc.map((item, ind) => (
                  <li key={ind} className="mb-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`${styles.orderContainer} flex flex-col pr-10 justify-start`}>
            <h1 className="text-3xl">₹{product.Price[0].deal_price}</h1>
            <div className="py-10">
              <span className="text-blue-800 pr-2">Free delivery</span>
              <span className="font-bold pr-2">Tuesday 4 February</span>
              <span className="pr-2">order within 2hr 59 min</span>
              <span className="text-blue-800 underline">Details</span>
            </div>

            <div className={styles.dropdown}>
              <button className={styles.dropbtn} onClick={toggleDropdown}>
                Quantity <i className="fas fa-chevron-down mx-2 text-sm"></i>
              </button>
              <div
                className={`${styles.dropdownContent} ${
                  isDropdownOpen ? styles.show : ""
                }`}
              >
                {Array.from({ length: 9 }, (_, i) => (
                  <a
                    href="#"
                    key={i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      closeDropdown();
                      console.log(`Selected quantity: ${i + 1}`);
                    }}
                  >
                    {i + 1}
                  </a>
                ))}
              </div>
            </div>
            <div
              className={`${styles.orderButtons} flex flex-col justify-center items-center`}
            >
              <button
                onClick={() => {
                  addToCart(id);
                }}
                className="bg-yellow-400 h-10 w-full px-4 py-1 rounded-full my-2 md:mt-20"
              >
                Add to cart
              </button>
              <button
                onClick={() => buyItem(id)}
                className="bg-yellow-400 h-10 w-full px-4 py-1 rounded-full"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute" }}>
        <ToastContainer />
      </div>
    </>
  );
};

export default ProductDetail;
