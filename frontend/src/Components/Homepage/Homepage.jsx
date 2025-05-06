import React, { useState, useEffect } from "react";
import Gridproducts from './GridProducts/Gridproducts';
import Banners from "./Banners/Banners";
import styles from './Homepage.module.css';
import Deals from "./Deals/Deals";
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/loadingSlice';

const apiUrl = import.meta.env.VITE_APP_API_URL;

const Homepage = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [products, setProducts] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      dispatch(showLoading());
      setHasError(false);
      setLoadingPercentage(0); // Reset loading percentage

      try {
        // Simulate loading progress
        const simulateProgress = () => {
          setLoadingPercentage((prev) => {
            if (prev < 100) {
              return prev + 10;
            }
            return prev;
          });
        };

        const progressInterval = setInterval(simulateProgress, 300); // Simulated progress interval

        const response = await fetch(`${apiUrl}/getHomeProductsSchema`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data);

        setLoadingPercentage(100); // Set to 100% on completion
        clearInterval(progressInterval); // Clear interval when done
      } catch (error) {
        console.error("Error fetching data:", error);
        setHasError(true);
        setLoadingPercentage(100); // Set to 100% even if there's an error
      } finally {
        dispatch(hideLoading());
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className={styles.homepage}>
      {isLoading ? (
        <div className={styles.loading}>
          Loading... {loadingPercentage}%
        </div>
      ) : hasError ? (
        <div className={styles.loading}>⚠️ Failed to load products. Please try again later.</div>
      ) : (
        <>
          <div className={styles.banners}><Banners /></div>
          <div className={styles.grid}><Gridproducts products={products} /></div>
          <Deals />
          <Deals />
        </>
      )}
    </div>
  );
};

export default Homepage;