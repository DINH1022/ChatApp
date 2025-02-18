import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const authenticator = async (req,res,next)=>{
    try{
        const token = req.cookie.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized"});
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({message: "Unauthorized"});
        
        const user = await User.findById(decoded.userId).select("-password"); // bỏ password khỏi kết quả trả về
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}