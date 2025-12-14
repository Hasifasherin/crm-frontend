import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);

  const API_URL = "http://localhost:5000/api/customers";

  useEffect(() => {
    const fetchStats = async () => {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const customers = res.data;
      setTotal(customers.length);
      setActive(customers.filter(c => c.status === "active").length);
      setInactive(customers.filter(c => c.status === "inactive").length);
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Overview of CRM activities</p>

      <div className="stats">
        <div className="card">
          <h3>{total}</h3>
          <p>Total Customers</p>
        </div>

        <div className="card">
          <h3>{active}</h3>
          <p>Active Customers</p>
        </div>

        <div className="card">
          <h3>{inactive}</h3>
          <p>Inactive Customers</p>
        </div>
      </div>
    </div>
  );
}
