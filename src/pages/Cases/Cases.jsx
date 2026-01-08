import { useState, useEffect, useContext } from "react";
import Modal from "react-modal";
import axiosInstance from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import "./Cases.css";

Modal.setAppElement("#root");

export default function Cases() {
  const { token } = useContext(AuthContext);
  const headers = { Authorization: `Bearer ${token}` };

  const [cases, setCases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: "",
    assigned_to: "",
    priority: "medium",
    status: "open",
  });

  const [search, setSearch] = useState("");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [caseRes, customerRes, userRes] = await Promise.all([
        axiosInstance.get("/cases", { headers }),
        axiosInstance.get("/customers", { headers }),
        axiosInstance.get("/users", { headers }),
      ]);

      setCases(caseRes.data);
      setCustomers(customerRes.data);
      setUsers(userRes.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || `Server error: ${err.response.status}`);
      } else if (err.request) {
        setError("Network error: Could not reach server");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modal controls
  const openModal = (c = null) => {
    setEditMode(!!c);
    setSelectedCase(c);
    setFormData(
      c
        ? {
            customer_id: c.customer_id?._id || "",
            assigned_to: c.assigned_to?._id || "",
            priority: c.priority,
            status: c.status,
          }
        : { customer_id: "", assigned_to: "", priority: "medium", status: "open" }
    );
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCase(null);
    setEditMode(false);
    setFormData({ customer_id: "", assigned_to: "", priority: "medium", status: "open" });
  };

  // Add/Edit case
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_id) return setError("Please select a customer");

    try {
      if (editMode && selectedCase) {
        await axiosInstance.patch(`/cases/${selectedCase._id}`, formData, { headers });
      } else {
        await axiosInstance.post("/cases", formData, { headers });
      }
      fetchData();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || `Operation failed: ${err.message}`);
    }
  };

  // Open professional confirmation modal
  const openConfirmModal = (message, onConfirm) => {
    setConfirmModal({ isOpen: true, message, onConfirm });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, message: "", onConfirm: null });
  };

  // Delete case
  const handleDelete = (id) => {
    openConfirmModal("Are you sure you want to delete this case?", async () => {
      try {
        await axiosInstance.delete(`/cases/${id}`, { headers });
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || `Failed to delete case: ${err.message}`);
      } finally {
        closeConfirmModal();
      }
    });
  };

  // Close case directly
  const handleCloseCase = (c) => {
    openConfirmModal(`Are you sure you want to close this case?`, async () => {
      try {
        await axiosInstance.patch(`/cases/${c._id}`, { status: "closed" }, { headers });
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || `Failed to close case: ${err.message}`);
      } finally {
        closeConfirmModal();
      }
    });
  };

  // Filter cases
  const filteredCases = cases.filter(
    (c) =>
      c.customer_id?.name.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "low":
        return "priority low";
      case "medium":
        return "priority medium";
      case "high":
        return "priority high";
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "status open";
      case "in-progress":
        return "status in-progress";
      case "closed":
        return "status closed";
      default:
        return "";
    }
  };

  return (
    <div className="cases">
      <h1>Cases</h1>
      {error && <p className="error-msg">{error}</p>}

      <div className="cases-header">
        <input
          type="text"
          placeholder="Search by customer or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="add-btn" onClick={() => openModal()}>
          + Add Case
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="cases-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No cases found
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr key={c._id}>
                  <td>{c.customer_id?.name || "N/A"}</td>
                  <td>{c.assigned_to?.username || "Unassigned"}</td>
                  <td>
                    <span className={getPriorityClass(c.priority)}>{c.priority}</span>
                  </td>
                  <td>
                    <span className={getStatusClass(c.status)}>{c.status}</span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openModal(c)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                    {c.status !== "closed" && (
                      <button className="close-btn" onClick={() => handleCloseCase(c)}>
                        Close Case
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Case Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Case Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>{editMode ? "Edit Case" : "Add Case"}</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <select
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
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
            value={formData.assigned_to}
            onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
          >
            <option value="">Assign to employee (optional)</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>

          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="save-btn">
              {editMode ? "Update" : "Add"}
            </button>
            <button type="button" className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Professional Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onRequestClose={closeConfirmModal}
        className="confirm-modal"
        overlayClassName="modal-overlay"
      >
        <p>{confirmModal.message}</p>
        <div className="modal-buttons" style={{ justifyContent: "flex-end" }}>
          <button className="save-btn" onClick={confirmModal.onConfirm}>
            Yes
          </button>
          <button className="cancel-btn" onClick={closeConfirmModal}>
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}
