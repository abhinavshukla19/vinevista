require("dotenv").config()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const database=require("./database.js")
const express=require("express")
const auth_router=express.Router()

// register
auth_router.post("/register", async (req, res) => {
    try {
    const { name, email, phonenumber, gender, password } = req.body;

    if (!name || !email || !phonenumber || !gender || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    const saltrounds = 10;
    const hashedpassword = await bcrypt.hash(password, saltrounds);
     const [existing] = await database.query("SELECT * FROM users_login WHERE email = ? OR phonenumber = ? LIMIT 1",
            [email, phonenumber]);

    if (existing.length > 0) {
        return res.status(409).json({ message: "User already exists" });
    }

    await database.query("INSERT INTO users_login (name, password, email, phonenumber, gender) VALUES (?, ?, ?, ?, ?)",
        [name, hashedpassword, email, phonenumber, gender ?? null]
        );

    return res.status(201).json({ message: "User registration successful" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});



// user login
auth_router.post("/signin",async(req,res)=>{
    try {
        const { email , password }=req.body;

        if (!email || !password) {
    return res.status(400).json({ message: "Fill all fields" });
}  

        const [rows] = await database.query("SELECT * FROM users_login WHERE email = ? LIMIT 1",[email]);
            if (!rows || rows.length === 0) {
                return res.status(401).json({ message: "Username or Password is incorrect" });
            }
        const user = rows[0];
        const encrypt = user.password;
        const id = user.id;
        const match=await bcrypt.compare(password,encrypt)
        const secret_key=process.env.Jwt_secret
        if(!secret_key){
            return res.json({message:"Secret key not found"})
        }

        if (!match) {
            return res.status(401).json({ message: "Username or Password is incorrect" });
        }

        const token = jwt.sign({id , email }, secret_key, { expiresIn: "24h" });
            return res.status(200).json({
            message: "Login successful",
            token:token
        });  

    } catch (error) {
        console.log(error)
        res.status(500).json({message:error})
    }
})



// change password 
auth_router.post("/change_password",async(req,res)=>{
   const { password } = req.body;
    const token=req.headers.token;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const secret_key=process.env.Jwt_secret;
    const verify=jwt.verify(token,secret_key) 

    try {
        if(verify){
        const data=await database.query("UPDATE users_login SET password = ? WHERE id = ?",[hashedPassword,verify.id])
        res.status(200).json({ message: "Password change successful" });
    }  
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "password change failed",error:error });
    }
});



// delete account 
auth_router.post("/delete-account", async (req, res) => {
  const token = req.headers.token;
  const secret_key = process.env.Jwt_secret;
  const { password } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token not available" });
  }

  try {
    const decode = jwt.verify(token, secret_key);
    const userid = decode.id;
    const [rows] = await database.query("SELECT * FROM users_login WHERE id=?", [userid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    await database.query("DELETE FROM users_login WHERE id=?", [userid]);
    return res.json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports=auth_router