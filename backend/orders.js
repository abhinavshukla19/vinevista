require("dotenv").config();
const express = require("express");
const orders = express.Router();
const database = require("./database");
const { authMiddleware } = require("./auth-middleware");


orders.use(authMiddleware);

// add product to orders (like "buy now" / place order)
orders.post("/product_to_cart", async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.decode.id;

  if (!product_id) {
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }

  try {
    // Postgres style: $1, $2
    await database.query(
      "INSERT INTO orders_data (user_id, product_id) VALUES ($1, $2)",
      [user_id, product_id]
    );

    return res
      .status(200)
      .json({ success: true, message: "Product added to orders" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

// to view orders
orders.get("/orders", async (req, res) => {
  const user_id = req.decode.id;

  try {
    // get user info (no password)
    const { rows: userRows } = await database.query(
      "SELECT name FROM users_login WHERE id = $1",
      [user_id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user_name = userRows[0].name;

    // get all orders for this user
    const { rows: order_data } = await database.query(
      "SELECT * FROM orders_data WHERE user_id = $1",
      [user_id]
    );

    // no orders yet
    if (order_data.length === 0) {
      return res.status(200).json({
        success: true,
        user_name,
        orders: [],
        products: [],
      });
    }

    const productIds = order_data.map(order => order.product_id);

    // fetch all products for these IDs in one query
    const { rows: products } = await database.query(
      "SELECT * FROM product_data WHERE product_id = ANY($1)",
      [productIds]
    );

    return res.status(200).json({
      success: true,
      user_name,
      orders: order_data,
      products,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

module.exports = orders;
