
    
const User=require("../models/usermode");
const {v4:uuidv4}=require("uuid");
const jwt=require("jsonwebtoken");
const express=require("express");
const cookieParser=require("cookie-parser");
const app=express();
app.use(cookieParser());

const protect=async(req,res,next)=>{
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
  console.log(token);
        //decodes token id
        const decoded = jwt.verify(token,"anisha123");
  
        req.user = await User.findById(decoded.id);
  console.log(req.user._id.toString());
        next();
      } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
      }
    }
  
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }
module.exports={
    protect
}