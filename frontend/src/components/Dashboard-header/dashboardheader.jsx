import "./dashboardheader.css"
import { Plus , X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Dashboardheader=({usersearch , setusersearch ,userRole})=>{

    const navigate = useNavigate();
    return(
        <header className="dashboard-header">
            <div className="header-content">
              <h1 className="dashboard-title">Welcome to new world</h1>
              <p className="dashboard-subtitle">Your private wine collection, curated for you</p>
              <div className="header-divider"></div>
              <input type="text" placeholder="Search for product" value={usersearch} onChange={(e)=>{setusersearch(e.target.value)}} className="search-input" />
              {usersearch && (
              <button onClick={() => setusersearch("")}>
                <X size={16} />
              </button>
            )}

            </div> 
            {userRole === "admin" ? (
              <button
                className="btn-add-product"
                onClick={() => navigate("/add_product")}
              >
                <Plus size={20} />
                <span>Add Product</span>
              </button>
            ) : null}
          </header>
    )
} 