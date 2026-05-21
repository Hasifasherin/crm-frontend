import "./Footer.css";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrapper">
        {/* Logo & Info */}
        <div className="footer-section footer-logo-section">
          <h2 className="footer-logo">
            CRM <span className="logo-accent">Cloud</span>
          </h2>
          <p className="footer-desc">
            Manage customers, track cases, and boost productivity with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/customers">Customers</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/cases">Cases</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className="footer-section footer-socials">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 CRM System. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
