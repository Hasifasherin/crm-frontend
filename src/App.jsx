import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Customers from "./pages/Customers/Customers";
import Cases from "./pages/Cases/Cases";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const location = useLocation();

  // Hide header & footer on login & signup pages
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideLayout && <Header />}

      <main className="main-content">
        <Routes>
          {/* Protected Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <Cases />
              </ProtectedRoute>
            }
          />

          {/* Fallback for 404 */}
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "4rem", fontSize: "1.5rem" }}>
                Page Not Found
              </div>
            }
          />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;
