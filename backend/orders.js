require("dotenv").config();
const express = require("express");
const orders = express.Router();
const database = require("./database");
const { authMiddleware } = require("./auth-middleware");


orders.use(authMiddleware);

// add product to orders (like "buy now" / place order)
orders.post("/checkout", async (req, res) => {
    const user_id=req.decode.id;

    try {
        
        await database.query('BEGIN');

        await database.query( `INSERT INTO orders_data (user_id, product_id, quantity, created_at) 
            SELECT user_id, product_id, quantity, NOW()
            FROM cart
            WHERE user_id = $1;`,
            [user_id])

        await database.query( `DELETE FROM cart WHERE user_id = $1;`,[user_id])

        await database.query("COMMIT");

        return res.json({ message: "Order placed successfully" });
  } catch (err) {
    await database.query("ROLLBACK");
    return res.status(500).json({ message: "Checkout failed" });
  }
});


//  get orders
orders.get("/get_orders",async (req,res)=>{
    const user_id=req.decode.id;
    
    try {
        const results=await database.query(`SELECT 
        o.order_id,
        o.quantity,
        o.created_at,
        p.product_name,
        p.product_price,
        p.product_url
        FROM orders_data o
        JOIN product_data p ON o.product_id = p.product_id
        WHERE o.user_id = $1
        ORDER BY o.created_at DESC;`,[user_id]
)

    if (results.rowCount > 0) {
        return res.status(200).json({"order":results.rows ,"totalorders":results.rowCount})
    }
    return res.status(200).json({"message":"No orders till now"})

} catch (error) {
    return res.status(500).json({ message: "Failed to fetch orders" });
    }
})



module.exports = orders;