require("dotenv").config();
const express = require("express");
const product_page = express.Router();
const database = require("./database");
const Jwt = require("jsonwebtoken");
const secret_key = process.env.Jwt_secret;

// to view all product
product_page.get("/Dashboard", async (req, res) => {
  try {
    // Postgres: database.query returns { rows, rowCount, ... }
    const { rows: products } = await database.query("SELECT * FROM product_data");

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server error occurred while fetching products." });
  }
});



// to add products
product_page.post("/add_product", async (req, res) => {
    const { product_name, product_bio, category, rating, product_url, product_price } = req.body;
    const auth_header = req.headers.token;
  
    if (!auth_header) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
  
    try {
      const decode = Jwt.verify(auth_header, secret_key);
      const userid = decode.id;
  
      if (!userid) {
        return res.status(401).json({
          success: false,
          message: "Token is valid but does not contain a user ID.",
        });
      }
  
      // Postgres: use $1..$8 instead of ?..?
      await database.query(
        `INSERT INTO product_data 
          (product_name, product_bio, product_price, product_url, rating, category, created_by, added_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [product_name, product_bio, product_price, product_url, rating, category, userid, userid]
      );
  
      return res
        .status(200)
        .json({ success: true, message: "Product added successfully" });
    } catch (error) {
      if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Your session is invalid or has expired. Please sign in again.",
        });
      }
      console.error("Server Error in /add_product:", error);
      return res
        .status(500)
        .json({ success: false, message: "An unexpected server error occurred." });
    }
  });
  
  module.exports = product_page;
  


