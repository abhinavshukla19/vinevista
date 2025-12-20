import "./allproducts.css";
import { Sidebar } from "../../Sidebar/sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, ShoppingCart, Wine, Star, AlertCircle, Package } from "lucide-react";
import { host, showError, showSuccess } from "../../components/Alert";

export const Allproducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${host}/Dashboard`);
        setProducts(res.data.data);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const Cart = async (product_id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showError("You're not signed in");
      navigate("/signin");
      return;
    }

    if (!product_id) {
      showError("Invalid product selected");
      return;
    }

    try {
      const response = await axios.post(
        `${host}/item_to_cart`,
        { product_id },
        { headers: { token: token } }
      );
      showSuccess(response?.data?.message || "Item added to cart");
    } catch (err) {
      console.error("Cart error", err);
      const serverMessage =
        err?.response?.data?.message || err?.message || "Failed to add to cart";
      showError(serverMessage);
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-container">
          <div className="dashboard-loading">
            <Wine className="loading-icon" />
            <h2>Loading Products...</h2>
          </div>
        </main>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-container">
          <header className="dashboard-header">
            <div className="header-content">
              <h1>Dashboard</h1>
              <p>Your wine collection at a glance</p>
            </div>
            <button
              className="btn-add-product"
              onClick={() => navigate("/add_product")}
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </header>

          <div className="error-state">
            <AlertCircle className="error-icon" />
            <h2>Something went wrong</h2>
            <p>{error}</p>
            <button className="btn-retry" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Empty State
  if (!products || products.length === 0) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-container">
          <header className="dashboard-header">
            <div className="header-content">
              <h1>Dashboard</h1>
              <p>Your wine collection at a glance</p>
            </div>
            <button
              className="btn-add-product"
              onClick={() => navigate("/add_product")}
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </header>

          <div className="empty-state">
            <Package className="empty-icon" />
            <h2>No Products Yet</h2>
            <p>Start building your wine collection by adding your first product</p>
            <button
              className="btn-add-product"
              onClick={() => navigate("/add_product")}
            >
              <Plus size={20} />
              <span>Add Your First Product</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-container">
          <header className="dashboard-header">
            <div className="header-content">
              <h1 className="dashboard-title">Welcome to new world</h1>
              <p className="dashboard-subtitle">Your private wine collection, curated for you</p>
              <div className="header-divider"></div>
            </div>
            <button
              className="btn-add-product"
              onClick={() => navigate("/add_product")}
            >
              <Plus size={20} />
              <span>Add Product</span>
            </button>
          </header>

        {/* Products Grid */}
        <section className="products-section">

          <div className="products-grid">
            {products.map((product, idx) => (
              <article
                className="product-card"
                key={product.product_id}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="product-image-wrapper">
                  <img
                    src={product.product_url}
                    alt={product.product_name}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x500?text=No+Image";
                    }}
                  />
                  <div className="product-overlay">
                    <button
                      className="btn-cart"
                      onClick={() => Cart(product.product_id)}
                      title="Add to cart"
                    >
                      <ShoppingCart size={20} />
                    </button>
                  </div>
                  {product.rating && (
                    <div className="rating-badge">
                      <Star size={14} fill="currentColor" />
                      <span>{parseFloat(product.rating).toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="product-details">
                  {product.category && (
                    <span className="product-category">{product.category}</span>
                  )}
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-description" title={product.product_bio}>
                    {product.product_bio}
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ₹{parseFloat(product.product_price).toFixed(2)}
                    </span>
                    <button
                      className="btn-add-cart"
                      onClick={() => Cart(product.product_id)}
                    >
                      <ShoppingCart size={16} />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};