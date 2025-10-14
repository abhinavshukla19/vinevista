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
        res.json({message: "Token is not available"})
        return
    }
    
    const decode=Jwt.verify(token,secret_key)
        if(!decode){
            res.json({message:"Token is expired"})
            return 
        }
        const user_id=decode.id

    try {
        
        const user=await database.query("select * from users_login where id=?",[user_id])
        const user_name=user[0][0].name

        const [order_data]=await database.query("select * from orders_data where user_id=?",[user_id])
        const productids=order_data.map(order => order.product_id)
        console.log(productids)

        const [product]=await database.query("select * from product_data where product_id in (?)",[productids])
        console.log(product)
        
        res.status(200).json
        ({user_name: user_name,
        orders: order_data,
        products: product})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({sucess:false , message:"server error"})
    }
})


module.exports=orders