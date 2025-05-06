import React from 'react';
import styles from './NavbarBanner.module.css';
import { IoMdMenu } from "react-icons/io";
import { Link } from 'react-router-dom';

const NavbarBanner = () => {

  const options = [
    { "name": "Watches" },
    { "name": "Bags" },
    { "name": "Shirts" },
    { "name": "Tops" },
    { "name": "HeadPhones" },
    { "name": "RAM" },
    { "name": "GPU" },
    { "name": "TV" }
  ];

  return (
    <div className={styles.navbarBanner}>
      <div className={styles.navbarBannerOptionsLeft}>
        <div className={styles.optionsNavbarBanner}>
          <IoMdMenu />
          <div className={styles.allOptionsNavbarBanner}>All</div>
        </div>


        {options.map((item, index) => (
          <Link to={`/product_types/${item.name.toLowerCase()}`} className={styles.optionsNavbarBanner} key={index}>{item.name}</Link>
        ))}
      </div>
    </div>
  );
};

export default NavbarBanner;
