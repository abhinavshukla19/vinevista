require("dotenv").config()
const express=require("express");
const Cart=express.Router();
const Jwt=require("jsonwebtoken");
const database = require("./database");
const secret_key=process.env.Jwt_secret;

Cart.post("/item_to_cart", async (req, res) => {
    const { product_id } = req.body;
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({ message: "Token is not available" });
    }

    try {
        const decode = Jwt.verify(token, secret_key);
        const user_id = decode.id;
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }

    if (!product_id) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const [existing] = await database.query(
            "SELECT * FROM cart WHERE user_id = ? AND product_id = ? LIMIT 1",
            [user_id, product_id]
        );

        if (existing.length > 0) {
            await database.query(
                "UPDATE cart SET quantity = quantity + 1 WHERE product_id = ? AND user_id = ?",
                [product_id, user_id]
            );
            return res.status(200).json({ 
                success: true, 
                message: "Item quantity increased",
                inCart: true 
            });
        }
        
        await database.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES(?, ?, ?)",
            [user_id, product_id, 1]
        );
        return res.status(200).json({ 
            success: true, 
            message: "Item added to cart",
            inCart: true 
        });
        
    } catch (error) {
        console.log("Database error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});



Cart.get("/get_cart", async (req, res) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({ message: "Token is not available" });
    }

    let user_id;
    try {
        const decode = Jwt.verify(token, secret_key);
        user_id = decode.id;
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }

    try {
         const [cartItems] = await database.query(      
  "SELECT c.cart_id, c.product_id, c.quantity, c.added_at, p.product_name, p.product_price, p.product_url FROM cart c JOIN product_data p ON c.product_id = p.product_id WHERE c.user_id = ?",[user_id]
    );
        
        // Calculate total
       const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
        
        return res.status(200).json({ 
            success: true, 
            items: cartItems,
            total: total
        });
        
    } catch (error) {
        console.log("Database error:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports=Cart 