import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import config from "../config/config.js";


export async function register(req,res){
    try {
    const {username,email,password}=req.body
    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"})
    }
    const userExists=await UserModel.findOne({email})
    if(userExists){
        return res.status(400).json({error:"User already exists"})
    }
    const user=await UserModel.create({
        username,
        email,
        password,
    })

    const token=jwt.sign({
        id:user._id,
        username:user.username,
        email:user.email,
    },config.JWT_SECRET,{
        expiresIn:"1h",
    })
     res.status(201).json({
            message:"user registered successfully",
            data:user,
            token,   
        })

    } catch (error) {
            console.log(error)
            res.status(500).json({error:error.message})
    }
    }
