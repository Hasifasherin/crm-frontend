import { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axiosInstance from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Customers.css";

Modal.setAppElement("#root");

export default function Customers() {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: "", contact_info: "", status: "active" });
  const [search, setSearch] = useState("");

  // Confirmation modal
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/customers", { headers });
      setCustomers(res.data);
    } catch (err) {
      setError("Failed to load customers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Open modal
  const openModal = (customer = null) => {
    setEditMode(!!customer);
    setSelectedCustomer(customer);
    setFormData(
      customer
        ? { name: customer.name, contact_info: customer.contact_info, status: customer.status }
        : { name: "", contact_info: "", status: "active" }
    );
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCustomer(null);
    setEditMode(false);
    setFormData({ name: "", contact_info: "", status: "active" });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode && selectedCustomer) {
        await axiosInstance.patch(`/customers/${selectedCustomer._id}`, formData, { headers });
      } else {
        await axiosInstance.post("/customers", formData, { headers });
      }
      fetchCustomers();
      closeModal();
    } catch (err) {
      setError("Operation failed");
      console.error(err);
    }
  };

  // Open confirmation modal
  const openConfirmModal = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setConfirmMessage("");
    setConfirmAction(null);
  };

  // Delete customer
  const handleDelete = (id) => {
    openConfirmModal("Are you sure you want to delete this customer?", async () => {
      try {
        await axiosInstance.delete(`/customers/${id}`, { headers });
        fetchCustomers();
      } catch (err) {
        setError("Failed to delete customer");
        console.error(err);
      }
    });
  };

  // Toggle customer status
  const toggleStatus = (customer) => {
    const newStatus = customer.status === "active" ? "inactive" : "active";
    openConfirmModal(`Are you sure you want to mark this customer as ${newStatus}?`, async () => {
      try {
        await axiosInstance.patch(`/customers/${customer._id}`, { status: newStatus }, { headers });
        fetchCustomers();
      } catch (err) {
        setError("Failed to update status");
        console.error(err);
      }
    });
  };

  // Filter customers
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customers">
      <h1>Customers</h1>
      {error && <p className="error-msg">{error}</p>}

      <div className="customers-header">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-btn" onClick={() => openModal()}>+ Add Customer</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No customers found</td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.contact_info}</td>
                  <td>
                    <span className={`status-badge ${c.status}`}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openModal(c)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(c._id)}>Delete</button>
                    <button className="status-toggle-btn" onClick={() => toggleStatus(c)}>
                      {c.status === "active" ? "Make Inactive" : "Make Active"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Customer Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Customer Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editMode ? "Edit Customer" : "Add Customer"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={formData.contact_info}
            required
            onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
          />
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="modal-buttons">
            <button type="submit" className="save-btn">{editMode ? "Update" : "Add"}</button>
            <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onRequestClose={closeConfirmModal}
        contentLabel="Confirm Action"
        className="confirm-modal"
        overlayClassName="modal-overlay"
      >
        <p>{confirmMessage}</p>
        <div className="modal-buttons">
          <button
            className="save-btn"
            onClick={() => {
              confirmAction && confirmAction();
              closeConfirmModal();
            }}
          >
            Yes
          </button>
          <button className="cancel-btn" onClick={closeConfirmModal}>No</button>
        </div>
      </Modal>
    </div>
  );
}
