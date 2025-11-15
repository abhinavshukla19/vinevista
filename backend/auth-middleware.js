import dotenv from "dotenv"
import Jwt from "jsonwebtoken";
const secret_key = process.env.Jwt_secret;

export const authMiddleware = (req, res, next) => {
    const token = req.headers.token;
    
    if (!token) {
        return res.status(401).json({ message: "Token is not available" });
    }
    
    try {
        const decode = Jwt.verify(token, secret_key);
        
        if (!decode || !decode.id) {
            return res.status(401).json({ message: "Token is invalid or expired" });
        }
        
        req.decode = decode;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
}