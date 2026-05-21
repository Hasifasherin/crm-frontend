import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { Pie, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { token } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
    totalCases: 0,
    openCases: 0,
    closedCases: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [customerRes, caseRes] = await Promise.all([
          axiosInstance.get("/customers"),
          axiosInstance.get("/cases"),
        ]);

        const customers = customerRes.data;
        const cases = caseRes.data;

        const totalCustomers = customers.length;
        const activeCustomers = customers.filter(c => c.status === "active").length;
        const inactiveCustomers = totalCustomers - activeCustomers;

        const totalCases = cases.length;
        const openCases = cases.filter(c => c.status !== "closed").length;
        const closedCases = totalCases - openCases;

        setStats({ totalCustomers, activeCustomers, inactiveCustomers, totalCases, openCases, closedCases });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const casesData = {
    labels: ["Open Cases", "Closed Cases"],
    datasets: [
      {
        label: "Cases Status",
        data: [stats.openCases, stats.closedCases],
        backgroundColor: ["#f6c23e", "#1cc88a"],
        borderColor: ["#f6c23e", "#1cc88a"],
        borderWidth: 1,
      },
    ],
  };

  const customersData = {
    labels: ["Active Customers", "Inactive Customers"],
    datasets: [
      {
        label: "Customer Status",
        data: [stats.activeCustomers, stats.inactiveCustomers],
        backgroundColor: ["#1cc88a", "#e74a3b"],
        borderColor: ["#1cc88a", "#e74a3b"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="dashboard-subtitle">Overview of CRM activities</p>

      {error && <p className="error-msg">{error}</p>}
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="card blue">
              <h3>{stats.totalCustomers}</h3>
              <p>Total Customers</p>
            </div>
            <div className="card green">
              <h3>{stats.activeCustomers}</h3>
              <p>Active Customers</p>
            </div>
            <div className="card red">
              <h3>{stats.inactiveCustomers}</h3>
              <p>Inactive Customers</p>
            </div>
            <div className="card orange">
              <h3>{stats.totalCases}</h3>
              <p>Total Cases</p>
            </div>
            <div className="card yellow">
              <h3>{stats.openCases}</h3>
              <p>Open Cases</p>
            </div>
            <div className="card gray">
              <h3>{stats.closedCases}</h3>
              <p>Closed Cases</p>
            </div>
          </div>

          <div className="dashboard-charts">
            <div className="chart-card">
              <h3>Cases Status</h3>
              <Pie data={casesData} />
            </div>

            <div className="chart-card">
              <h3>Customer Status</h3>
              <Doughnut data={customersData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
