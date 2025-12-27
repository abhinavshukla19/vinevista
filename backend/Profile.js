const express = require("express");
const router = express.Router();
const database = require("./database");
const { authMiddleware } = require("./auth-middleware");

router.post("/user_profile", authMiddleware, async (req, res) => {
  const userId = req.decode.id;

  try {
    const { rows } = await database.query(
      `SELECT 
         id,
         name,
         email,
         phonenumber,
         gender,
         role,
         created_at
       FROM users_login
       WHERE id = $1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error in /user_profile:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
});

module.exports = router;