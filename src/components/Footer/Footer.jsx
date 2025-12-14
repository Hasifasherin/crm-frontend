import "./Footer.css";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <a href="/">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>

      <p>© 2025 CRM System. All rights reserved.</p>

      <div className="social">
        <FaFacebook />
        <FaTwitter />
        <FaLinkedin />
      </div>
    </footer>
  );
}
