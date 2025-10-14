require("dotenv").config()
const express=require("express")
const product_page=express.Router()
const database=require("./database")
const Jwt=require("jsonwebtoken")
const secret_key=process.env.Jwt_secret

// to view all product
product_page.get("/Dashboard",async(req,res)=>{
   try {

      const [product]=await database.query("Select * from product_data")
      res.status(200).json({sucess:true , data:product })

   } catch (error) {
      res.status(500).json({ success: false, message: "Server error occurred while fetching products." });
      console.log(error)
   }
})


// to add products
product_page.post("/add_product",async(req,res)=>{
    const { product_name , product_bio , category , rating , product_url , product_price }=req.body;
    const auth_header = req.headers.token;
    if (!auth_header) {
        res.status(401).json({sucess:false , message:"No token provided"})
    }
    
    try {
        const decode = Jwt.verify(auth_header, secret_key);
        const userid = decode.id; 
        console.log(userid)

        if (!userid) {
            return res.status(401).json({ success: false, message: "Token is valid but does not contain a user ID." });
        }

        await database.query("insert into product_data ( product_name , product_bio , product_price , product_url , rating , category , created_by , added_by ) values (?,?,?,?,?,?,?,?)",[product_name , product_bio , product_price , product_url , rating , category, userid , userid])

        return res.status(200).json({sucess:true , message: "Product added sucessfully"});

     } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Your session is invalid or has expired. Please sign in again." });
        }
        console.error("Server Error in /add_product:", error);
        return res.status(500).json({ success: false, message: "An unexpected server error occurred." });
    }
});



module.exports= product_page