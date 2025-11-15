require("dotenv").config()
const express=require("express");
const Cart=express.Router();
const Jwt=require("jsonwebtoken");
const database = require("./database");
const { authMiddleware } = require("./auth-middleware");
const secret_key=process.env.Jwt_secret;

Cart.use(authMiddleware);

Cart.post("/item_to_cart", async (req, res) => {
    const { product_id }=req.body;
    console.log(req.decode);
    const user_id = req.decode.id;
    console.log(user_id)
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



// fetch data form database
Cart.get("/get_cart", async (req, res) => {
   const user_id = req.decode.id;

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



Cart.post("/remove_item/",async(req,res)=>{
    const { product_id }=req.body;
    const user_id = req.decode.id;

    if (!product_id) {
         return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const [result] = await database.query(
            "DELETE FROM cart WHERE product_id = ? AND user_id = ?;",
            [product_id, user_id]);

        res.status(200).json({message:"Sucessfully removed 😀"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Failed to remove 😡"})
    }

});



Cart.post("/increase_quantity",async (req,res)=>{
    const { product_id }=req.body;
    const user_id = req.decode.id;

    if (!product_id) {
         return res.status(400).json({ message: "Product ID is required" });
    }

    try {
        const quantity=await database.query("UPDATE cart SET quantity = quantity+1 WHERE user_id = ? AND product_id = ?",[user_id,product_id]);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({sucess:false ,message:"Failed to increase quantity 😡"})
    }
})

module.exports=Cart;