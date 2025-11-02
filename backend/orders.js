require("dotenv").config()
const express=require("express")
const orders=express.Router();
const Jwt=require("jsonwebtoken");
const database = require("./database");
const secret_key=process.env.Jwt_secret

// too add in cart
orders.post("/product_to_cart",async(req,res)=>{
    const { product_id }=req.body;
    const token=req.headers.token;
    if (!token) {
        res.json({message: "Token is not available"})
        return
    }
    try {
        const decode=Jwt.verify(token,secret_key)
        const user_id=decode.id;
        await database.query("insert into orders_data ( user_id , product_id )  values ( ?, ? )",[user_id , product_id])
        res.status(200).json({sucess:true , message:"Product added to cart"})

    } catch (error) {
        console.log(error)
        res.status(500).json({sucess:false , message:"server error"})
    }
}) 

// to view orders
orders.get("/orders",async(req,res)=>{
    const token=req.headers.token;
    if (!token) {
        return res.status(401).json({message: "Token is not available"})
    }
    
    try {
        const decode=Jwt.verify(token,secret_key)
        if(!decode){
            return res.json({message:"Token is expired"})
        }
        const user_id=decode.id

        const user=await database.query("SELECT * FROM users_login WHERE id=?",[user_id])
        const user_name=user[0][0].name

        const [order_data]=await database.query("SELECT * FROM orders_data WHERE user_id=?",[user_id])
        
        // Check if there are any orders
        if (order_data.length === 0) {
            return res.status(200).json({
                user_name: user_name,
                orders: [],
                products: []
            })
        }

        const productids=order_data.map(order => order.product_id)
        console.log(productids)
        const placeholders = productids.map(() => '?').join(',')
        const query = `SELECT * FROM product_data WHERE product_id IN (${placeholders})`
        
        const [product]=await database.query(query, productids)
        console.log(product)
        
        return res.status(200).json({
            user_name: user_name,
            orders: order_data,
            products: product
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false, message:"server error"})
    }
})


module.exports=orders