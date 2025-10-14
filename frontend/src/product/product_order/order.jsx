import axios from "axios";
import "./order.css"
import { showError , showSuccess } from "../../utils/toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../Sidebar/sidebar";
import { host } from "../../utils/toast";

export const Order=()=>{
    const [orders,setorders]=useState([]);
    const [isloading,setloading]=useState(true);
    const navigate=useNavigate()

    useEffect(()=>{
        const token=localStorage.getItem("token")
        if (!token) {
        setloading(false); 
        showError("Authentication token not found.");
        navigate("/signin")
        return;
      }

    const Fetchorders=async()=>{
    try {
        const res=await axios.get(`${host}/orders`, { headers: { token: token } })
        const { orders, products, user_name } = res.data;

        const enrichedOrders = orders.map(order => {
        const product = products.find(p => p.product_id === order.product_id);
        return {
            ...order,
            product_name: product ? product.product_name : "—",
            product_price: product?.product_price,
            user_name: user_name || "—",
      };
    });

    setorders(enrichedOrders);
        console.log(res.data)
    } catch (err) {
       showError(err?.response?.data?.message || err.message || "Server fetch error");
    } finally {
        setloading(false);
    }
    };

        Fetchorders();
    },[])


if (isloading) {
    return (
      <div className="orders-container">
        <h1>Loading Orders...</h1>
      </div>
    );
  }

const hasOrders = Array.isArray(orders) && orders.length > 0;

return (
    <div className="app-layout">
      <Sidebar />

      <main className="orders-wrapper" aria-live="polite">
        <header className="orders-header">
          <h1>Order Dashboard</h1>
        </header>

        <section className="orders-content">
          <table className="orders-table" role="table" aria-label="Orders table">
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">User Name</th>
                <th scope="col">Product Name</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
              </tr>
            </thead>

            <tbody>
              {hasOrders ? (
                orders.map((order) => {
                  const id = order?.order_id ?? order?.id ?? "—";
                  const userName = order?.user_name ?? order?.user ?? "—";
                  const productName = order?.product_name ?? "—";
                  const price = `$ ${order?.product_price ?? null}`;
                  const quantity = order?.order_quantity ?? order?.quantity ?? "—";
                  const status = order?.order_status ?? "—";
                  const createdAt = (new Date(order.created_at).toLocaleDateString("en-IN", {timeZone: "Asia/Kolkata",})) ?? null;

                  return (
                    <tr key={String(id)}>
                      <td data-label="Order ID">{id}</td>
                      <td data-label="User Name">{userName}</td>
                      <td data-label="Product Name">{productName}</td>
                      <td data-label="Price">{price}</td>
                      <td data-label="Quantity">{quantity}</td>
                      <td data-label="Status">{status}</td>
                      <td data-label="Date">{createdAt}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="no-orders">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}