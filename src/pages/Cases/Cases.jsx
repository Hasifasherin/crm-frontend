import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Cases.css";

export default function Cases() {
  const { token } = useContext(AuthContext);
  const [cases, setCases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [error, setError] = useState("");

  const CASE_API = "http://localhost:5000/api/cases";
  const CUSTOMER_API = "http://localhost:5000/api/customers";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // Fetch cases and customers
  const fetchData = async () => {
    try {
      const [caseRes, customerRes] = await Promise.all([
        axios.get(CASE_API, { headers }),
        axios.get(CUSTOMER_API, { headers }),
      ]);
      setCases(caseRes.data);
      setCustomers(customerRes.data);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new case
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer");
      return;
    }

    try {
      await axios.post(
        CASE_API,
        { customer_id: customerId, priority },
        { headers }
      );
      setCustomerId("");
      setPriority("medium");
      fetchData();
    } catch (err) {
      setError("Failed to create case");
      console.error(err);
    }
  };

  // Update case status
  const updateStatus = async (id, status) => {
    setError("");
    try {
      await axios.patch(
        `${CASE_API}/${id}`,
        { status },
        { headers }
      );
      fetchData();
    } catch (err) {
      setError("Failed to update case");
      console.error(err);
    }
  };

  return (
    <div className="cases">
      <h1>Cases</h1>

      {error && <p className="error">{error}</p>}

      {/* CREATE CASE */}
      <form className="case-form" onSubmit={handleCreate}>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select Customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit">Create Case</button>
      </form>

      {/* CASE TABLE */}
      <table>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No cases found
              </td>
            </tr>
          )}
          {cases.map((c) => (
            <tr key={c._id}>
              <td>{c.customer_id?.name || "N/A"}</td>
              <td>{c.priority}</td>
              <td>{c.status}</td>
              <td>
                {c.status !== "closed" && (
                  <button
                    className="close"
                    onClick={() => updateStatus(c._id, "closed")}
                  >
                    Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
