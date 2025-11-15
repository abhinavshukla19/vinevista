import "./sidebar.css";
import {
  FiUser,
  FiGrid,
  FiTrash2,
  FiLogOut,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const getNavLinkClass = ({ isActive }) => {
    return isActive ? "nav-item active" : "nav-item";
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" className="sidebar-toggle" aria-hidden="true" />
      <label htmlFor="sidebar-toggle" className="hamburger-btn" aria-label="Toggle menu">
        <FiMenu className="icon-menu" />
        <FiX className="icon-close" />
      </label>

      <aside className="sidebar">
        <div className="sidebar-header">
          <svg
            className="sidebar-logo"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff2d95" />
                <stop offset="50%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#3fa9f5" />
              </linearGradient>
            </defs>
            <path d="M6 2l1 5h10l1-5z" />
            <path d="M3 7h18l-2 14H5z" />
            <path d="M9 11a3 3 0 0 1 6 0" />
          </svg>

          <h3>Vinevista</h3>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/Profile" className={getNavLinkClass}>
            <FiUser /> <span>Profile</span>
          </NavLink>
          <NavLink to="/Dashboard" className={getNavLinkClass}>
            <FiGrid /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/Cart" className={getNavLinkClass}>
            <FiShoppingCart /> <span>Cart</span>
          </NavLink>
          <NavLink to="/orders" className={getNavLinkClass}>
            <FiTruck /> <span>Orders</span>
          </NavLink>
          <NavLink to="/delete-account" className={getNavLinkClass}>
            <FiTrash2 /> <span>Delete account</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleSignOut} className="signout-button">
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <label htmlFor="sidebar-toggle" className="sidebar-overlay" aria-hidden="true"></label>
    </>
  );
};
