const express=require("express");
const cors =require("cors");
const app=express();
const auth_route = require("./auth_route.js");
const app_profile = require("./Profile.js");
const product_page = require("./product_page.js");
const orders = require("./orders.js");
const Cart=require("./cart.js");

app.use(express.json())
app.use(cors())


app.use(auth_route)
app.use(app_profile)
app.use(product_page)
app.use(orders)
app.use(Cart)

app.listen(3000, "0.0.0.0", () => {
    console.log("Server is running on port 3000....!!")
})