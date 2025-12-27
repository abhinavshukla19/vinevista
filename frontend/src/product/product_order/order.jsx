import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Wine, Calendar, IndianRupeeIcon, ShoppingBag } from "lucide-react";
import { Sidebar } from "../../Sidebar/sidebar";
import { host, showError } from "../../components/Alert-box/Alert";
import "./order.css";


export const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      showError("Please login first");
      navigate("/signin");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${host}/get_orders`, {
          headers: { token },
        });

        // BACKEND RETURNS: { order: [...], rowscount: number }
        setOrders(res.data.order || []);
      } catch (err) {
        console.error(err);
        showError(
          err?.response?.data?.message ||
          err.message ||
          "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  /* -------------------- LOADING -------------------- */
  if (isLoading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="vine-orders-container">
          <div className="vine-orders-loading">
            <Wine className="vine-orders-loading-icon" />
            <h2>Loading your orders...</h2>
          </div>
        </main>
      </div>
    );
  }

  /* -------------------- EMPTY STATE -------------------- */
  if (!orders.length) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="vine-orders-container">
          <div className="vine-orders-empty">
            <Wine className="vine-orders-empty-icon" />
            <h2>No Orders Yet</h2>
            <p>Start exploring our premium collection</p>
            <button
              className="vine-orders-browse-btn"
              onClick={() => navigate("/dashboard")}
            >
              Browse Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* -------------------- MAIN UI -------------------- */
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="vine-orders-container">
        {/* HEADER */}
        <header className="vine-orders-header">
          <div className="header-content">
            <h1>My Orders</h1>
            <p>All your placed orders</p>
          </div>
        </header>

        {/* STATS */}
        <section className="vine-order-stats">
          <div className="vine-order-stat-card">
            <ShoppingBag className="vine-order-stat-icon" />
            <div className="vine-order-stat-info">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
        </section>

        {/* ORDER LIST */}
        <section className="vine-orders-list">
          {orders.map((order, idx) => {
            const orderId = order.order_id;
            const name = order.product_name;
            const price = Number(order.product_price);
            const quantity = Number(order.quantity);
            const total = price * quantity;
            const date = new Date(order.created_at).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short", year: "numeric" }
            );

            return (
              <article
                key={orderId}
                className="vine-order-card"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="vine-order-card-header">
                  <div className="vine-order-id">
                    <span className="vine-order-id-label">Order #</span>
                    <span className="vine-order-id-value">{orderId}</span>
                  </div>
                </div>

                <div className="vine-order-card-body">
                  <div className="vine-order-product-info">
                    <img
                      src={order.product_url}
                      alt={name}
                      className="vine-order-product-image"
                    />

                    <div className="vine-order-product-details">
                      <h3 className="vine-order-product-name">{name}</h3>

                      <div className="vine-order-product-meta">
                        <span>Qty: {quantity}</span>
                        <span className="vine-order-meta-separator">•</span>
                        <span>₹ {price.toFixed(2)} each</span>
                      </div>
                    </div>
                  </div>

                  <div className="vine-order-card-footer">
                    <div className="vine-order-date">
                      <Calendar size={16} />
                      <span>{date}</span>
                    </div>

                    <div className="vine-order-total">
                      <IndianRupeeIcon size={16} />
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default Order;
