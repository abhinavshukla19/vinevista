import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Package,Clock,CheckCircle, XCircle, Wine, Calendar, ShoppingBag, IndianRupeeIcon} from "lucide-react";
import { Sidebar } from "../../Sidebar/sidebar";
import { host ,showError,showSuccess } from "../../components/Alert-box/Alert";
import "./order.css";

export const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      showError("Authentication token not found.");
      navigate("/signin");
      return;
    }

    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${host}/orders`, {
          headers: { token, Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        const { orders = [], products = [], user_name } = res.data || {};

        const enrichedOrders = orders.map((order) => {
          const product = products.find((p) => p.product_id === order.product_id);
          return {
            ...order,
            product_name: product ? product.product_name : "—",
            product_price: product?.product_price ?? 0,
            user_name: user_name || "—",
          };
        });

        setOrders(enrichedOrders);
      } catch (err) {
        if (!axios.isCancel(err)) {
          showError(err?.response?.data?.message || err.message || "Server fetch error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return <CheckCircle className="status-icon delivered" />;
      case "shipped":
        return <Package className="status-icon shipped" />;
      case "processing":
        return <Clock className="status-icon processing" />;
      case "cancelled":
        return <XCircle className="status-icon cancelled" />;
      default:
        return <Package className="status-icon" />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === "all") return true;
    return (order.order_status || "").toLowerCase() === selectedFilter;
  });

  const orderStats = {
    total: orders.length,
    delivered: orders.filter((o) => (o.order_status || "").toLowerCase() === "delivered").length,
    processing: orders.filter((o) => (o.order_status || "").toLowerCase() === "processing").length,
    shipped: orders.filter((o) => (o.order_status || "").toLowerCase() === "shipped").length,
  };

  if (isLoading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="vine-orders-container">
          <div className="orders-loading" role="status" aria-live="polite">
            <Wine className="loading-icon" />
            <h2>Loading your orders…</h2>
            <section className="orders-list" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <article key={i} className="order-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="order-card-header">
                    <div className="order-id">
                      <div className="skeleton" style={{ height: 14, width: 120, borderRadius: 8 }} />
                    </div>
                    <div className="skeleton" style={{ height: 12, width: 80, borderRadius: 8 }} />
                  </div>
                  <div className="order-card-body">
                    <div style={{ display: "flex", gap: 12 }}>
                      <div className="skeleton" style={{ width: 54, height: 54, borderRadius: 8 }} />
                      <div style={{ flex: 1 }}>
                        <div className="skeleton" style={{ height: 14, width: "70%", borderRadius: 8 }} />
                        <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 8, marginTop: 8 }} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </main>
      </div>
    );
  }

  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="vine-orders-container">
        <header className="vine-orders-header">
          <div className="header-content">
            <h1>My Orders</h1>
            <p>Track and manage your Vine Vista orders</p>
          </div>
        </header>

        {hasOrders && (
          <section className="order-stats">
            <div className="stat-card">
              <ShoppingBag className="stat-icon" />
              <div className="stat-info">
                <h3>{orderStats.total}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <CheckCircle className="stat-icon delivered" />
              <div className="stat-info">
                <h3>{orderStats.delivered}</h3>
                <p>Delivered</p>
              </div>
            </div>
            <div className="stat-card">
              <Package className="stat-icon shipped" />
              <div className="stat-info">
                <h3>{orderStats.shipped}</h3>
                <p>Shipped</p>
              </div>
            </div>
            <div className="stat-card">
              <Clock className="stat-icon processing" />
              <div className="stat-info">
                <h3>{orderStats.processing}</h3>
                <p>Processing</p>
              </div>
            </div>
          </section>
        )}

        {hasOrders && (
          <div className="order-filters" role="tablist" aria-label="Order filters">
            <button className={selectedFilter === "all" ? "active" : ""} onClick={() => setSelectedFilter("all")} aria-pressed={selectedFilter === "all"}>
              All Orders
            </button>
            <button className={selectedFilter === "processing" ? "active" : ""} onClick={() => setSelectedFilter("processing")} aria-pressed={selectedFilter === "processing"}>
              Processing
            </button>
            <button className={selectedFilter === "shipped" ? "active" : ""} onClick={() => setSelectedFilter("shipped")} aria-pressed={selectedFilter === "shipped"}>
              Shipped
            </button>
            <button className={selectedFilter === "delivered" ? "active" : ""} onClick={() => setSelectedFilter("delivered")} aria-pressed={selectedFilter === "delivered"}>
              Delivered
            </button>
          </div>
        )}

        <section className="orders-list">
          {hasOrders ? (
            filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => {
                const id = order?.order_id ?? order?.id ?? "—";
                const productName = order?.product_name ?? "—";
                const price = Number(order?.product_price ?? 0);
                const quantity = Number(order?.order_quantity ?? order?.quantity ?? 0);
                const status = order?.order_status ?? "—";
                const createdAt = order.created_at
                  ? new Date(order.created_at).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";

                return (
                  <article key={String(id)} className="order-card" style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="order-card-header">
                      <div className="order-id">
                        <span className="label">Order #</span>
                        <span className="value">{id}</span>
                      </div>
                      <div className={`order-status ${status?.toLowerCase()}`}>
                        {getStatusIcon(status)}
                        <span>{status}</span>
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="product-info">
                        <Wine className="product-icon" />
                        <div className="product-details">
                          <h3>{productName}</h3>
                          <div className="product-meta">
                            <span className="quantity">Qty: {quantity}</span>
                            <span className="separator">•</span>
                            <span className="price">₹ {price.toFixed(2)} each</span>
                          </div>
                        </div>
                      </div>

                      <div className="order-footer">
                        <div className="order-date">
                          <Calendar className="footer-icon" />
                          <span>{createdAt}</span>
                        </div>
                        <div className="order-total">
                          <IndianRupeeIcon className="footer-icon" />
                          <span className="total-amount">{(price * quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="no-orders-filtered">
                <Package className="empty-icon" />
                <h2>No {selectedFilter} orders found</h2>
                <p>Try selecting a different filter</p>
              </div>
            )
          ) : (
            <div className="no-orders">
              <Wine className="empty-icon" />
              <h2>No Orders Yet</h2>
              <p>Start exploring our premium wine collection</p>
              <button className="browse-btn" onClick={() => navigate("/products")}>
                Browse Products
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Order;
