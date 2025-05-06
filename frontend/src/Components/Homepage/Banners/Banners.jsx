import React, { useState } from "react";
import styles from "./Banners.module.css";
import { TfiAngleLeft } from "react-icons/tfi";
import { TfiAngleRight } from "react-icons/tfi";

const Banners = () => {
  const images = [
    "/Banner_Images/Banner1.jpg",
    "/Banner_Images/Banner2.jpg",
    "/Banner_Images/Banner3.jpg",
    "/Banner_Images/Banner4.png",
    "/Banner_Images/Banner5.jpg",
    "/Banner_Images/Banner6.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const nextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex(
      currentImageIndex == 0 ? images.length - 1 : currentImageIndex - 1
    );
  };
  return (
    <>
      <div className={styles.banners}>
        <img src={images[currentImageIndex]} alt="Banner" />
      </div>

      <div className={styles.swipes}>
        <button onClick={prevImage}>
          <TfiAngleLeft />
        </button>
        <button onClick={nextImage}>
          <TfiAngleRight />
        </button>
      </div>
    </>
  );
};

export default Banners;
