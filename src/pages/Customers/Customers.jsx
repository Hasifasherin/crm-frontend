import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import "./Customers.css";

export default function Customers() {
  const { token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:5000/api/customers";

  // 🔹 Fetch customers
  const fetchCustomers = async () => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔹 Add or Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, contact_info: contact };

    if (editingId) {
      await axios.patch(`${API_URL}/${editingId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(API_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setName("");
    setContact("");
    setEditingId(null);
    fetchCustomers();
  };

  // 🔹 Edit
  const handleEdit = (customer) => {
    setName(customer.name);
    setContact(customer.contact_info);
    setEditingId(customer._id);
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;

    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchCustomers();
  };

  // 🔹 Toggle Active/Inactive
  const toggleStatus = async (customer) => {
    const newStatus = customer.status === "active" ? "inactive" : "active";
    await axios.patch(
      `${API_URL}/${customer._id}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchCustomers();
  };

  return (
    <div className="customers">
      <h1>Customers</h1>

      {/* FORM */}
      <form className="customer-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Update Customer" : "Add Customer"}
        </button>
      </form>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.contact_info}</td>
              <td>{c.status}</td>
              <td>
                <button className="edit" onClick={() => handleEdit(c)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(c._id)}>
                  Delete
                </button>
                <button
                  className={c.status === "active" ? "deactivate" : "activate"}
                  onClick={() => toggleStatus(c)}
                >
                  {c.status === "active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
