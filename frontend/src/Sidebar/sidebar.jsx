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
import { Wine } from "lucide-react";

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
          <div className="sidebar-logo-wrapper">
            <Wine className="sidebar-logo" size={32} />
          </div>
          <div className="sidebar-brand">
            <h3 className="sidebar-brand-name">VINEVISTA</h3>
            <p className="sidebar-brand-tagline">Premium Spirits</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/Profile" className={getNavLinkClass}>
            <FiUser className="nav-icon" />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/Dashboard" className={getNavLinkClass}>
            <FiGrid className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/Cart" className={getNavLinkClass}>
            <FiShoppingCart className="nav-icon" />
            <span>Cart</span>
          </NavLink>
          <NavLink to="/orders" className={getNavLinkClass}>
            <FiTruck className="nav-icon" />
            <span>Orders</span>
          </NavLink>
          <NavLink to="/delete-account" className={({ isActive }) => getNavLinkClass({ isActive }) + " nav-item-delete"}>
            <FiTrash2 className="nav-icon" />
            <span>Delete Account</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleSignOut} className="signout-button">
            <FiLogOut className="signout-icon" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <label htmlFor="sidebar-toggle" className="sidebar-overlay" aria-hidden="true"></label>
    </>
  );
};
