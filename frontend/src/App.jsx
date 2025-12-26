import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Registrationpage } from "./Register/Registeruser";
import { Signinpage } from "./Sign-in/signin";
import { Profile } from "./Profile/Profile";
import { AlertProvider } from "./components/Alert-box/Alert.jsx";
import { AddProduct } from "./product/Add product/addproduct.jsx";
import {ChangePassword} from "./ChangePassword/ChangePassword.jsx"
import { Allproducts } from "./product/All products/allproducts.jsx";
import { Order } from "./product/product_order/order.jsx";
import { DeleteAccount } from "./Deleteaccount/deleteacc.jsx";
import { Cart } from "./product/product_cart/cart.jsx";


let App = () => {
  return (
    <AlertProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route - redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Authentication routes */}
          <Route path="/register" element={<Registrationpage />} />
          <Route path="/signin" element={<Signinpage />} />
          
          {/* Dashboard - Home page */}
          <Route path="/dashboard" element={<Allproducts/>} />
          <Route path="/Dashboard" element={<Navigate to="/dashboard" replace />} />
          
          {/* Product routes */}
          <Route path="/add_product" element={<AddProduct />} />
          <Route path="/products" element={<Navigate to="/dashboard" replace />} />
          
          {/* User routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/Profile" element={<Navigate to="/profile" replace />} />
          <Route path="/change_password" element={<ChangePassword />} />
          <Route path="/edit_profile" element={<Navigate to="/profile" replace />} />
          
          {/* Shopping routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/Cart" element={<Navigate to="/cart" replace />} />
          <Route path="/orders" element={<Order/>} />
          
          {/* Account management */}
          <Route path="/delete-account" element={<DeleteAccount/>} />
          
          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AlertProvider>
  );
};

export default App;

