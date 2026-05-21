import "./Header.css";
import { useNavigate, NavLink, Link } from "react-router-dom";
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
      <Link to="/" className="header-logo">
        CRM <span className="logo-accent">Cloud</span>
      </Link>

      <nav className="header-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Customers</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/cases" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Cases</NavLink>
      </nav>

      <div className="header-profile">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
