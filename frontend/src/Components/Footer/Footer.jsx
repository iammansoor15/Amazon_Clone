import React from 'react'
import styles from "./Footer.module.css";
import amazonLogo from '../../assets/amazon.svg'
const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerContent}>
                <div className={styles.footerCont1}>
                    <div className={styles.contentFooterTitle}>Get To Know Us</div>
                    <div className={styles.contentFooterSubTitlediv}>
                        <div className={styles.contentFooterSubTitleCont}>About Amazon</div>
                        <div className={styles.contentFooterSubTitleCont}>Carreres</div>
                        <div className={styles.contentFooterSubTitleCont}>Press Releases</div>
                        <div className={styles.contentFooterSubTitleCont}>Amazon Science</div>
                    </div>

                </div>

                <div className={styles.footerCont1}>
                    <div className={styles.contentFooterTitle}>Connect With Us</div>
                    <div className={styles.contentFooterSubTitlediv}>
                        <div className={styles.contentFooterSubTitleCont}>Instagram</div>
                        <div className={styles.contentFooterSubTitleCont}>Twitter</div>
                        <div className={styles.contentFooterSubTitleCont}>Facebook</div>
                    </div>
                </div>

                <div className={styles.footerCont1}>
                    <div className={styles.contentFooterTitle}>Make Money With US</div>
                    <div className={styles.contentFooterSubTitlediv}>
                        <div className={styles.contentFooterSubTitleCont}>Sell on Amazon</div>
                        <div className={styles.contentFooterSubTitleCont}>Sell under Amazon Accelerator</div>
                        <div className={styles.contentFooterSubTitleCont}>Protect and Build Your Brand</div>
                        <div className={styles.contentFooterSubTitleCont}>Amazon Global Selling</div>
                        <div className={styles.contentFooterSubTitleCont}>Supply to Amazon</div>
                        <div className={styles.contentFooterSubTitleCont}>Become an Affiliate</div>
                        <div className={styles.contentFooterSubTitleCont}>Fulfilment by Amazon</div>
                        <div className={styles.contentFooterSubTitleCont}>Advertise Your Products</div>
                        <div className={styles.contentFooterSubTitleCont}>Amazon Pay on Merchants</div>
                    </div>

                </div>
                
                <div className={styles.footerCont1}>
                    <div className={styles.contentFooterTitle}>Lets Us Help You</div>
                    <div className={styles.contentFooterSubTitlediv}>
                        <div className={styles.contentFooterSubTitleCont}>Your Account</div>
                        <div className={styles.contentFooterSubTitleCont}>Returns Centre</div>
                        <div className={styles.contentFooterSubTitleCont}>Recalls and Product Safety Alerts</div>
                        <div className={styles.contentFooterSubTitleCont}>100% Purchase Protection</div>
                        <div className={styles.contentFooterSubTitleCont}>Amazon App Download</div>  
                        <div className={styles.contentFooterSubTitleCont}>Help</div>

                    </div>
                </div>
            </div>
            <hr />
            <div className={styles.amazonImg}>
                <img className={styles.amazonImgFooter} src={amazonLogo} />
            </div>
        </div>
    )
}

export default Footer
