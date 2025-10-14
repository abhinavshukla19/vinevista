require("dotenv").config()
const express = require('express');
const router = express.Router(); 
const Jwt=require("jsonwebtoken");
const database = require("./database");
const secret_key=process.env.Jwt_secret


router.post("/user_profile", async(req, res) => {
    const auth_header = req.headers.token;
    if (!auth_header) {
        res.status(404).json({sucess:false , message:"No token provided"})
    }

    const decode=Jwt.verify(auth_header,secret_key)
    const data_check=await database.query("select * from users_login where id=?",[decode.id])
    const profile_data=data_check[0][0]
    res.status(200).json(profile_data)
});


module.exports = router;