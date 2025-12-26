import "./dashboardheader.css";
import { Plus, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboardheader = ({ usersearch, setusersearch, userRole }) => {
  const navigate = useNavigate();

  return (
    <header className="dashboard-header">
      
      {/* LEFT: Title + subtitle (desktop only) */}
      <div className="header-content">
        <h1 className="dashboard-title">Welcome to new world</h1>
        <p className="dashboard-subtitle">
          Your private wine collection, curated for you
        </p>
        <div className="header-divider"></div>
      </div>

      {/* CENTER: Search (desktop + mobile) */}
      <div className="search-container">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Search for product"
          value={usersearch}
          onChange={(e) => setusersearch(e.target.value)}
          className="search-input"
        />
        {usersearch && (
          <button
            className="search-clear-btn"
            onClick={() => setusersearch("")}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* RIGHT: Add Product (admin only) */}
      {userRole === "admin" && (
        <button
          className="btn-add-product"
          onClick={() => navigate("/add_product")}
        >
          <Plus size={20} />
          <span>Add Product</span>
        </button>
      )}
    </header>
  );
};
