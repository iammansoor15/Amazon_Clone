import React, { useEffect, useState, useContext } from 'react';
import { useParams, NavLink, useLocation } from "react-router-dom";
import styles from './products.module.css';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarRateIcon from '@mui/icons-material/StarRate';
import { toast, Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginContext } from '../../ContextProvider';

const apiUrl = import.meta.env.VITE_APP_API_URL;


const Products = () => {
  const { Type } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { account, setAccount } = useContext(LoginContext);

  const fetchProducts = async (type, query) => {
    try {
      let url = `${apiUrl}/product_types/${type}`;
      if (query) {
        url = `${apiUrl}/search?query=${encodeURIComponent(query)}`;
      }
  
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Products");
  
      const data = await response.json();
      console.log(data);  
  
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]); 
      }
  
      setError(null);
    } catch (error) {
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query');
    fetchProducts(Type, query);
  }, [Type, location.search]);

  const addToCart = async (item) => {
    const response = await fetch(`${apiUrl}/addToCart/${item.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ product: item }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.warn(data.message, {
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
      localStorage.setItem("account", JSON.stringify(data));
      setAccount(data);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>Loading...</div>
    );
  }

  if (error) return <div>{error}</div>;

  return (
    <div className={styles.productPage}>
      <ul className={styles.productTopBanner}>
        <li className={styles.productTopBannerItems}>Electronics</li>
        <li className={styles.productTopBannerItemsSubMenu}>Mobiles & Accessories</li>
        <li className={styles.productTopBannerItemsSubMenu}>Laptops & Accessories</li>
        <li className={styles.productTopBannerItemsSubMenu}>TV & Home Entertainment</li>
        <li className={styles.productTopBannerItemsSubMenu}>Audio</li>
        <li className={styles.productTopBannerItemsSubMenu}>Cameras</li>
        <li className={styles.productTopBannerItemsSubMenu}>Computer Peripherals</li>
        <li className={styles.productTopBannerItemsSubMenu}>Smart Technology</li>
        <li className={styles.productTopBannerItemsSubMenu}>Musical Instruments</li>
        <li className={styles.productTopBannerItemsSubMenu}>Office & Stationary</li>
      </ul>

      <div className={styles.productsPageMain}>
        <div className={styles.productsPageMainLeftCategory}>
          <div className={styles.productsPageMainLeftCategoryTitle}>Category</div>
          <div className={styles.productsPageMainLeftCategoryContent}>
            <div className={styles.productsPageMainLeftCategoryTitleContent}>Computers & Accessories</div>
            <div className={styles.productsPageMainLeftCategoryContentSub}>Macbooks</div>
            <div className={styles.productsPageMainLeftCategoryContentSub}>Amazon Prime</div>
            <div className={styles.productsPageMainLeftCategoryContentSub}>Average Customer Review</div>
            <div className={styles.ratingLeftBox}>
              <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
              <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
              <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
              <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
              <StarOutlineIcon sx={{ fontSize: "20px", color: "#febd69" }} />
              <div className={styles.andUp}> & Up</div>
            </div>
          </div>
        </div>

        <div className={styles.productsPageMainRight}>
          <div className={styles.productsPageMainRightTopBanner}>
            <span className='text-xl font-bold'>Results for </span>
            <span className={styles.productsPageMainRightTopBannerSpan}>
              {Type || "Search Results"}
            </span>
          </div>

          <div className={styles.itemsImageProductPage}>
            {products.length > 0 ? (
              products.map((item, index) => (
                <NavLink to={`/productdetail/${item.id}`} className={styles.linkStyle} key={index}>
                  <div className={styles.itemsImageProductPageOne}>
                    <div className={styles.imgBloCkitemsImageProductPageOne}>
                      <img src={item.pro_imgs[0]} alt={item.ItemTitle} className={styles.productImageProduct} />
                    </div>
                    <div className={styles.productNameProduc}>
                      <div className={styles.productName}>{item.ItemTitle}</div>
                      <div className={styles.productNameProductRating}>
                        <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
                        <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
                        <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
                        <StarRateIcon sx={{ fontSize: "20px", color: "#febd69" }} />
                        <StarOutlineIcon sx={{ fontSize: "20px", color: "#febd69" }} />
                      </div>

                      <div>500+ bought this item in past month</div>
                      <div className='my-3'><span className='bg-red-600 text-white p-2 text-xs font-bold '>Limited time deal</span></div>

                      <div className={styles.priceProductDetailPage}>
                        <span className={styles.price}>
                          <span className={styles.currencyText}>₹</span>
                          <span className={styles.rateHomeDetail}>{item.Price?.[0]?.deal_price}</span>
                        </span>
                        <span className='flex text-s mx-5'>
                          <span>M.R.P  </span>
                          <span className={`line-through`}>{item.Price?.[0]?.org_price}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-blue-800 pr-2">Free delivery</span>
                        <span className="font-bold pr-2">Tuesday 4 February</span>
                        <span className="pr-2">order within 2hr 59 min</span>
                        <span className="text-blue-800 underline">Details</span>
                      </div>
                    </div>
                    <button
                      className={styles.addtobasketBtn}
                      onClick={(e) => { e.preventDefault(); addToCart(item); }}>
                      Add to Cart
                    </button>
                  </div>
                  <div style={{ position: "absolute" }}>
                    <ToastContainer />
                  </div>
                </NavLink>
              ))
            ) : (
              <div>No products found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
