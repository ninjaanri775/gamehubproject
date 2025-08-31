import React, { useState } from "react";
import { FaTiktok, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import LoginRegisterModal from "./LoginRegisterModal";

const Footer = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <div>
            <h2 className="footer-title">
              ყველაზე დიდი გასართობი სივცე საქართველოში
            </h2>
            <p className="footer-subtitle">
              შეუერთდი და გამოიცადე სოციალური ქსელების ქულებში
            </p>
          </div>
          <button
            className="footer-btn"
            onClick={() => setIsAuthModalOpen(true)}
          >
            რეგისტრაცია
          </button>
        </div>

        <div className="footer-middle">
          <div className="footer-logo">funzio</div>
          <nav className="footer-nav">
            <a href="#">კატეგორიები</a>
            <a href="#">პარტნიორები</a>
            <a href="#">კონფ. პოლიტიკა</a>
            <a href="#">გამოყენების წესები</a>
            <a href="#">ჩვენ შესახებ</a>
          </nav>
          <div className="footer-socials">
            <a href="#"><FaTiktok /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>@2025 Funzio</p>
        </div>

        <h1 className="footer-bg">funzio</h1>
      </footer>

      {/* Login/Register Modal */}
      <LoginRegisterModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Footer;
