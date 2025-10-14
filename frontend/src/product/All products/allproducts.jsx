import "./allproducts.css";
import { Sidebar } from "../../Sidebar/sidebar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { host, showError, showSuccess } from "../../utils/toast";


export const Allproducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setproducts] = useState([]);
  const [error, seterror] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const res = await axios.get(`${host}/Dashboard`);
        setproducts(res.data.data);
      } catch (err) {
        seterror("Failed to load products. Please try again later.");
        console.error("Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchproducts();
  }, []);



  const order=async(product_id)=>{
    
    const token=localStorage.getItem("token")
    if (!token) {
      showError("you're not signed in")
      navigate("/signin")
      return
    }
    
    if (!product_id) {
      showError("Invalid product selected");
      return;
    }
    
    try {
      const response=await axios.post(`${host}/product_to_cart`, { product_id }, { headers: { token: token } });
      showSuccess(response?.data?.message || "Order created");
      navigate("/orders");

    } catch (err) {
    console.error("Order error", err);
    const serverMessage = err?.response?.data?.message || err?.message || "Failed to create order";
    showError(serverMessage);
  }
  }


  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <header className="dashboard-header sticky">
            <div>
              <h1 className="header-title">Dashboard</h1>
              <p className="header-subtitle">Your product catalog at a glance</p>
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigate("/add_product")}
            >
              <FiPlus aria-hidden="true" /> Add Product
            </button>
          </header>

          {/* Shimmer skeleton grid */}
          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="product-card skeleton" key={i}>
                <div className="product-image-container skeleton-block" />
                <div className="product-info">
                  <div className="skeleton-line w-40" />
                  <div className="skeleton-line w-80" />
                  <div className="skeleton-line w-60" />
                  <div className="skeleton-footer">
                    <div className="skeleton-pill" />
                    <div className="skeleton-pill" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="main-content">
          <header className="dashboard-header sticky">
            <div>
              <h1 className="header-title">Dashboard</h1>
              <p className="header-subtitle">Your product catalog at a glance</p>
            </div>
            <button
              className="add-product-btn"
              onClick={() => navigate("/add_product")}
            >
              <FiPlus aria-hidden="true" /> Add Product
            </button>
          </header>

          <div className="state-wrap error">
            <div className="state-card">
              <div className="state-badge">⚠️</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <header className="dashboard-header sticky">
          <div>
            <h1 className="header-title">Dashboard</h1>
            <p className="header-subtitle">Your product catalog at a glance</p>
          </div>
          <button
            className="add-product-btn"
            onClick={() => navigate("/add_product")}
            aria-label="Add a new product"
          >
            <FiPlus aria-hidden="true" /> Add Product
          </button>
        </header>

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product, idx) => (
              <article
                className="product-card fade-in"
                style={{ animationDelay: `${idx * 60}ms` }}
                key={product.product_id}
              >
                <div className="product-image-container">
                  <img
                    src={product.product_url}
                    alt={product.product_name}
                    className="product-image"
                    loading="lazy"
                  />
                  <span className="rating-badge">★ {product.rating}</span>
                </div>

                <div className="product-info">
                  <span className="product-category pill">
                    {product.category}
                  </span>
                  <h3 className="product-name">{product.product_name}</h3>
                  <p className="product-bio" title={product.product_bio}>
                    {product.product_bio}
                  </p>

                  <div className="product-footer">
                    <span className="product-price">
                      ${parseFloat(product.product_price).toFixed(2)}
                    </span>
                    <button
                      className="view-btn"
                      onClick={()=>{order(product.product_id)}}
                      aria-label={`View ${product.product_name}`}>
                      Order
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="state-wrap">
              <div className="state-card">
                <div className="state-badge">🛍️</div>
                <h3>No products yet</h3>
                <p>Click “Add Product” to get started.</p>
                <button
                  className="add-product-btn ghost"
                  onClick={() => navigate("/add_product")}
                >
                  <FiPlus aria-hidden="true" /> Add your first product
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
