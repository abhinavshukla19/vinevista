import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Wine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './cart.css';
import { Sidebar } from '../../Sidebar/sidebar';
import { host } from '../../utils/toast';

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
      const response = await axios.delete(
        `${host}/remove_item/${product_id}`,
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== product_id));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert(`Order placed successfully! Total: ₹${calculateTotal()}`);
  };

  return (
    <div className="app-layout">
      {/* Sidebar wrapper ensures fixed width regardless of Sidebar internals */}
      <div className="sidebar-wrapper">
        <Sidebar />
      </div>

      <div className="cart-wrapper">
        <div className="cart-container">
          <div className="cart-header">
            <h1 className="cart-title">
              <Wine className="wine-icon" size={32} />
              Your Cart
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 20px', color: '#daa520' }}>
              <h2>Loading your cart...</h2>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={80} className="empty-icon" />
              <h2>Your cart is empty</h2>
              <p>Add some fine spirits to get started!</p>
              <button
                className="continue-shopping-btn"
                onClick={() => navigate('/dashboard')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items-section">
                {cartItems.map((item, index) => (
                  <div key={item.cart_id} className="cart-item">
                    <div className="item-number">{index + 1}</div>
                    <div className="item-image-wrapper">
                      <img
                        src={item.product_url || 'https://via.placeholder.com/400'}
                        alt={item.product_name}
                        className="item-image"
                      />
                    </div>
                    <div className="item-details">
                      <h3 className="item-name">{item.product_name}</h3>
                      <p className="item-price">₹{item.product_price}</p>
                    </div>
                    <div className="item-actions">
                      <div className="quantity-controls">
                        <button className="qty-btn" aria-label="decrease">
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="qty-btn" aria-label="increase">
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveItem(item.product_id)}
                        aria-label="remove"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="item-subtotal">
                      ₹{(Number(item.product_price) * Number(item.quantity)).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="address-section">
                  <h3>Delivery Address</h3>
                  {isEditingAddress ? (
                    <div className="address-edit">
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="address-input"
                      />
                      <button
                        className="save-address-btn"
                        onClick={() => setIsEditingAddress(false)}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="address-display">
                      <p>{address}</p>
                      <button
                        className="edit-btn"
                        onClick={() => setIsEditingAddress(true)}
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>

                <div className="payment-section">
                  <h3>Payment Method</h3>
                  <button className="upi-btn">
                    <span className="upi-icon">📱</span>
                    UPI
                  </button>
                </div>

                <div className="total-section">
                  <div className="total-row">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="total-row">
                    <span>Delivery charge</span>
                    <span className="free">Free</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Total Payable</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>

                <button className="order-btn" onClick={handlePlaceOrder}>
                  <ShoppingBag size={20} />
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
