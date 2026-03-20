import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import config from "../config/config.js";
import bcrypt from "bcrypt";
import { uploadFile } from "../services/storage.service.js";




export async function register(req,res){
    try {
    const {username,email,password,fullname}=req.body
    const file=req.file
    let profilePic = ""
    if(!username || !email || !password){
        return res.status(400).json({error:"All fields are required"})
    }
    const userExists=await UserModel.findOne(
       { $or:[{username},{email}]}
    )
    if(userExists){
        return res.status(400).json({error:"User already exists"})
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    if(file){
        const result=await uploadFile(file.buffer,file.originalname, "/profile-pics")
        profilePic=result.url
    }
    const user=await UserModel.create({
        username,
        email,
        password: hashedPassword,
        fullname,
        profilePic,
    })

    const userResponse = {
        _id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profilePic: user.profilePic,
    }

    const token=jwt.sign({
        id:user._id,
        username:user.username,
        email:user.email,
    },config.JWT_SECRET,{
        expiresIn:"1h",
    })
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:3600000,
    })
     res.status(201).json({
            message:"user registered successfully",
            data:userResponse,
            token,   
        })

    } catch (error) {
            console.log(error)
            res.status(500).json({error:error.message})
    }
    }

export async function login (req,res){
    try {
        
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json({error:"All fields are required"})
        }
        const user=await UserModel.findOne({email}).select("+password")
        if(!user){
            return res.status(400).json({error:"Invalid credentials"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"})
        }
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
        }
        const token=jwt.sign({
            id:user._id,
            username:user.username,
            email:user.email,
        },config.JWT_SECRET,{
            expiresIn:"1h",
        })
        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3600000,
        })
        res.status(200).json({
            message:"user logged in successfully",
            data:userResponse,
            token,   
        })
    } catch (error) {
            console.log(error)
            res.status(500).json({error:error.message})
    }
}

export const googleCallback = async(req,res) => {
    try {
        const { id, displayName, emails, photos } = req.user;
        const email = emails?.[0]?.value;

        if (!email) {
            return res.status(400).json({ error: "Google account email not found" });
        }

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            const token = jwt.sign(
                {
                    id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                },
                config.JWT_SECRET,
                {
                    expiresIn: "7d",
                }
            );

            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: "User logged in successfully",
                success: true,
                user: {
                    id: existingUser._id,
                    username: existingUser.username,
                    email: existingUser.email,
                    fullname: existingUser.fullname,
                    bio: existingUser.bio,
                    profilePic: existingUser.profilePic,
                    private: existingUser.private,
                },
            });
        }

        const baseUsername = email.split("@")[0];
        let username = baseUsername;
        let suffix = 1;

        while (await UserModel.findOne({ username })) {
            username = `${baseUsername}${suffix}`;
            suffix++;
        }

        const generatedPassword = await bcrypt.hash(`google-${id}-${Date.now()}`, 10);

        const user = await UserModel.create({
            username,
            email,
            password: generatedPassword,
            fullname: displayName || "",
            profilePic: photos?.[0]?.value || "",
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            config.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                bio: user.bio,
                profilePic: user.profilePic,
                private: user.private,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
  
