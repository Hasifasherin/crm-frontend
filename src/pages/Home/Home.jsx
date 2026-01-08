import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const handleGetStarted = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="home-container">
      <div className="home-overlay">
        <div className="home-content">
          <h1>Welcome to <span>CRM System</span></h1>
          <p>
            Manage customers, track cases, and improve customer relationships
            efficiently and professionally.
          </p>
          <button className="home-button" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
