import "./Header.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/")}>
        CRM <span>System</span>
      </div>

      <nav className="header-nav">
        <a href="/">Home</a>
        <a href="/customers">Customers</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/cases">Cases</a>
      </nav>

      <div className="header-profile">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
