require("dotenv").config();
const express = require("express");
const Cart = express.Router();
const Jwt = require("jsonwebtoken");
const database = require("./database");
const { authMiddleware } = require("./auth-middleware");
const secret_key = process.env.Jwt_secret;

Cart.use(authMiddleware);

// add item to cart
Cart.post("/item_to_cart", async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.decode.id;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // check existing
    const { rows: existing } = await database.query(
      "SELECT * FROM cart WHERE user_id = $1 AND product_id = $2 LIMIT 1",
      [user_id, product_id]
    );

    if (existing.length > 0) {
      await database.query(
        "UPDATE cart SET quantity = quantity + 1 WHERE product_id = $1 AND user_id = $2",
        [product_id, user_id]
      );
      return res.status(200).json({
        success: true,
        message: "Item quantity increased",
        inCart: true,
      });
    }


    // insert new row
    await database.query(
      "INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)",
      [user_id, product_id, 1]
    );

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      inCart: true,
    });
  } catch (error) {
    console.log("Database error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});


// fetch cart data
Cart.get("/get_cart", async (req, res) => {
  const user_id = req.decode.id;

  try {
    const { rows: cartItems } = await database.query(
      `SELECT 
         c.cart_id, 
         c.product_id, 
         c.quantity, 
         c.added_at, 
         p.product_name, 
         p.product_price, 
         p.product_url 
       FROM cart c 
       JOIN product_data p ON c.product_id = p.product_id 
       WHERE c.user_id = $1`,
      [user_id]
    );

    const total = cartItems.reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );

    return res.status(200).json({
      success: true,
      items: cartItems,
      total: total,
    });
  } catch (error) {
    console.log("Database error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});


// remove item
Cart.post("/remove_item", async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.decode.id;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    await database.query(
      "DELETE FROM cart WHERE product_id = $1 AND user_id = $2",
      [product_id, user_id]
    );

    res.status(200).json({ message: "Successfully removed 😀" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to remove 😡" });
  }
});



// increase quantity
Cart.post("/increase_quantity", async (req, res) => {
  const { product_id } = req.body;
  const user_id = req.decode.id;

  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    await database.query(
      "UPDATE cart SET quantity = quantity + 1 WHERE user_id = $1 AND product_id = $2",
      [user_id, product_id]
    );

    res.status(200).json({ success: true, message: "Quantity increased ✅" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to increase quantity 😡" });
  }
});



// decrease quantity
Cart.post("/decrease_quantity", async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.decode.id;
  
    if (!product_id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
  
    try {
      // Fetch current quantity
      const { rows } = await database.query(
        "SELECT quantity FROM cart WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "Item not found in cart" });
      }
  
      const currentQty = rows[0].quantity;
  
      if (currentQty <= 1) {
        // Quantity would become 0 → remove item
        await database.query(
          "DELETE FROM cart WHERE user_id = $1 AND product_id = $2",
          [user_id, product_id]
        );
        return res.status(200).json({
          success: true,
          removed: true,
          message: "Item removed from cart",
        });
      }
  
      // Otherwise, decrease by 1
      await database.query(
        "UPDATE cart SET quantity = quantity - 1 WHERE user_id = $1 AND product_id = $2",
        [user_id, product_id]
      );
  
      return res.status(200).json({
        success: true,
        removed: false,
        message: "Quantity decreased",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to decrease quantity 😡",
      });
    }
  });
  
module.exports = Cart;
