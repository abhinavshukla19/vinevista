import "./allproducts.css";
import axios from "axios";
import { Sidebar } from "../../Sidebar/sidebar";
import { useEffect, useState ,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wine, AlertCircle } from "lucide-react";
import { host , showError , showSuccess } from "../../components/Alert-box/Alert";
import { Dashboardheader } from "../../components/Dashboard-header/dashboardheader";
import { Productcard } from "../../components/Product-cards/productcard";
import { usedebounce } from "../../components/Reuse-hooks/usedebounce";
import { useuserRole } from "../../components/Reuse-hooks/useUserRole";

export const Allproducts = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [usersearch,setusersearch]=useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const debouncesearch=usedebounce( usersearch , 1000 )
  const UserRole=useuserRole();


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


// search for product by name or category
const productfilter=useMemo(()=>{
  if(!debouncesearch){
    return products;
  }
  return products.filter((product)=>{
    return(
            product?.product_name.toLowerCase().includes(debouncesearch.toLowerCase()) ||
            product.category?.toLowerCase().includes(debouncesearch.toLowerCase())
    );
    }
  )
},[debouncesearch,products])


  const OnAddtocart = async (product_id) => {
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
            {UserRole === "admin" && (
              <button
                className="btn-add-product"
                onClick={() => navigate("/add_product")}
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            )}
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

    
  // Main Dashboard
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-container">
          <Dashboardheader usersearch={usersearch}
          setusersearch={setusersearch} userRole={UserRole}/>

        {/* Products Grid */}
          <Productcard productfilter={productfilter} OnAddtocart={OnAddtocart}/>
      </main>
    </div>
  );
};
