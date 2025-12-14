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
    <div className="home">
      <div className="home-content">
        <h1>Welcome to CRM System</h1>
        <p>
          Manage customers, track cases, and improve customer relationships
          efficiently.
        </p>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
}
