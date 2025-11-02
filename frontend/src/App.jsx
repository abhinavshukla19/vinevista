import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Registrationpage } from "./Register/Registeruser";
import { Signinpage } from "./Sign-in/signin";
import { Profile } from "./Profile/Profile";
import { ToastRoot } from "./utils/toast.jsx";
import { AddProduct } from "./product/Add product/addproduct.jsx";
import {ChangePassword} from "./ChangePassword/ChangePassword.jsx"
import { Allproducts } from "./product/All products/allproducts.jsx";
import { Order } from "./product/product_order/order.jsx";
import { DeleteAccount } from "./Deleteaccount/deleteacc.jsx";
import { Cart } from "./product/product_cart/cart.jsx";


let App = () => {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Registrationpage />} />
        <Route path="/signin" element={<Signinpage />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/change_password" element={<ChangePassword></ChangePassword>} />
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/Dashboard" element={<Allproducts/>} /> 
        <Route path="/Cart" element={<Cart />} />
        <Route path="/orders" element={<Order/>} />
        <Route path="/delete-account" element={<DeleteAccount/>} />  
      </Routes>
      <ToastRoot />
    </BrowserRouter>
  );
};

export default App;

