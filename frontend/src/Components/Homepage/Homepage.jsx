import React from "react";
import Gridproducts from './GridProducts/Gridproducts';
import Banners from "./Banners/Banners";
import styles from './Homepage.module.css';
import Deals from "./Deals/Deals";



const Homepage = ({products}) => {
  return (
    <div className={styles.homepage}>
      <div  className={styles.banners}><Banners/></div>
      <div className={styles.grid} ><Gridproducts products={products}/></div>
      <Deals/>
      <Deals/>
  
    </div>
  );
};

export default Homepage;
