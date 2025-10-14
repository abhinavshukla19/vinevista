require("dotenv").config()
const mysql2=require("mysql2/promise");

const database=mysql2.createPool({
    host:process.env.DB_host,
    port:process.env.DB_port||3306,
    password:process.env.DB_password,
    user:process.env.DB_user,
    database:process.env.DB_name
}) 

module.exports= database 