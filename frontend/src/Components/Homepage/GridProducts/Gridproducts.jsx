import React, { useState, useEffect } from 'react';
import styles from "./Gridproducts.module.css";
import { NavLink } from 'react-router-dom';

const Gridproducts = ({products}) => {

  return (
    <>
      {products.map((grid, index) => (
        <div key={index} className={styles.card}>
          <h2>{grid.Title}</h2>  
          <div className={styles.products}>
            {grid.Products.map((product) => (  
              <div key={product.id}> 
                <NavLink to={`/productdetail/${product.id}`}>
                  <img src={product.pro_imgs[0]} alt="Product" className={styles.image} loading='lazy'/> 
                  <p>{product.ShortTitle}</p>
                </NavLink>
              </div>
            ))}
          </div>
          <div className={styles.all}>See all offers</div>
        </div>
      ))}
    </>
  );
};

export default Gridproducts;
