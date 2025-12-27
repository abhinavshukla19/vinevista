import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Wine, MapPin, CreditCard, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import { Sidebar } from '../../Sidebar/sidebar';
import { host , showError,showSuccess } from '../../components/Alert-box/Alert';

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("Viman Nagar, Pune, Maharashtra - 411014");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${host}/get_cart`, {
        headers: { token }
      });

      if (response.data.success) {
        setCartItems(response.data.items);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      showError('Failed to load cart');
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.product_price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleRemoveItem = async (product_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${host}/remove_item/`,
        { product_id: product_id },
        { headers: { token: token } }
      );

      if (response.status === 200) {
        showSuccess('Item removed from cart');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showError('Failed to remove item');
    }
  };

  const handleincreasequantity=async(product_id)=>{
    try{
      const token=localStorage.getItem('token');
      const response = await axios.post(`${host}/increase_quantity`,{
        product_id:product_id
      }, {
        headers: { token }
      })
      if(response.status===200){
        showSuccess('Quantity increased');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error increasing quantity:', error);
      showError('Failed to increase quantity');
    }
  }

  const handledecreasequantity=async(product_id)=>{
    try{
      const token=localStorage.getItem('token');
      const response = await axios.post(`${host}/decrease_quantity`,{
        product_id:product_id
      }, {
        headers: { token }
      })
      if(response.status===200){
      showSuccess('Quantity decreased');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      showError('Failed to decrease quantity');
    }
  }


  const handlePlaceOrder = async () => {
    try{
      const token=localStorage.getItem('token');
      const response = await axios.post(`${host}/checkout`,{}, {
        headers: { token }
      })
      if(response.status===200){
        showSuccess('Order placed successfully');
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error placing order:', error);
      showError('Failed to place order');
    }
  }


  // Loading State
  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="cart-container">
          <div className="cart-loading">
            <Wine className="loading-icon" />
            <h2>Loading Your Cart...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="cart-container">
          <header className="cart-header">
            <div className="header-content">
              <h1>Shopping Cart</h1>
              <p>Review and manage your selected items</p>
            </div>
          </header>

          <div className="empty-cart">
            <ShoppingBag className="empty-icon" />
            <h2>Your Cart is Empty</h2>
            <p>Discover our premium collection of wines and spirits</p>
            <button
              className="btn-continue-shopping"
              onClick={() => navigate('/dashboard')}
            >
              <Wine size={20} />
              <span>Browse Products</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cart with Items
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="cart-container">
        <header className="cart-header">
          <div className="header-content">
            <h1>Shopping Cart</h1>
            <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <button 
            className="btn-continue" 
            onClick={() => navigate('/dashboard')}
          >
            Continue Shopping
          </button>
        </header>

        <div className="cart-layout">
          {/* Cart Items Section */}
          <div className="cart-items-section">
            <div className="items-header">
              <h2>Cart Items</h2>
              <span className="items-count">{cartItems.length} items</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div key={item.cart_id} className="cart-item-card">
                  <div className="item-badge">{index + 1}</div>
                  
                  <div className="item-image-container">
                    <img
                      src={item.product_url || 'https://via.placeholder.com/400'}
                      alt={item.product_name}
                      className="item-image"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400?text=No+Image';
                      }}
                    />
                  </div>

                  <div className="item-info">
                    <h3 className="item-name">{item.product_name}</h3>
                    <p className="item-price">₹{Number(item.product_price).toFixed(2)} per bottle</p>
                    
                    <div className="item-controls">
                      <div className="quantity-control">
                        <button 
                          className="qty-btn"
                          aria-label="Decrease quantity"
                          onClick={() => handledecreasequantity(item.product_id)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          aria-label="Increase quantity"
                          onClick={() => handleincreasequantity(item.product_id)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveItem(item.product_id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="item-total">
                    <span className="total-label">Subtotal</span>
                    <span className="total-value">
                      ₹{(Number(item.product_price) * Number(item.quantity)).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="cart-summary-section">
            {/* Delivery Address Card */}
            <div className="summary-card">
              <div className="card-header">
                <MapPin size={20} />
                <h3>Delivery Address</h3>
              </div>
              <div className="card-body">
                {isEditingAddress ? (
                  <div className="address-edit">
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="address-input"
                      rows="3"
                    />
                    <button
                      className="btn-save"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Save Address
                    </button>
                  </div>
                ) : (
                  <div className="address-display">
                    <p className="address-text">{address}</p>
                    <button
                      className="btn-edit"
                      onClick={() => setIsEditingAddress(true)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="summary-card">
              <div className="card-header">
                <CreditCard size={20} />
                <h3>Payment Method</h3>
              </div>
              <div className="card-body">
                <button className="payment-option selected">
                  <span className="payment-icon">💳</span>
                  <span>UPI Payment</span>
                </button>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="summary-card order-summary">
              <div className="card-header">
                <Package size={20} />
                <h3>Order Summary</h3>
              </div>
              <div className="card-body">
                <div className="summary-row">
                  <span className="summary-label">Subtotal ({cartItems.length} items)</span>
                  <span className="summary-value">₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Delivery Charges</span>
                  <span className="summary-value free">Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span className="summary-label">Total Amount</span>
                  <span className="summary-value">₹{calculateTotal().toFixed(2)}</span>
                </div>

                <button className="btn-place-order" onClick={handlePlaceOrder}>
                  <ShoppingBag size={20} />
                  <span>Place Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
export default Cart;