const express = require('express');

const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const {UserModel}=require('../models/userModel');
const {Auth}= require("../middlewares/Auth.middleware");
const {BlacklistModel}= require("../models/blacklistModel")

const userRouter = express.Router();

userRouter.post("/register",async (req,res)=>{
const {email,password}=req.body;
try {
    // to check if the user is already registered
    const findUser= await UserModel.findOne({email})
    if(findUser){
        res.json({msg:"User Already registered"})
        return
    }else{
        bcrypt.hash(password,5,async(err,hash)=>{
            if(hash){
                const user= new UserModel({...req.body,password:hash})
                await user.save()
                if(user){
                    res.json({msg:"User registered successfully",user})
                }else{
                    res.json({msg:"Something went wrong !! please try again"})
                }
            }else{
                res.json({error:err.message})
            }
        })
    }
} catch (error) {
    res.status(400).json({error:error})
}

})










userRouter.post("/login",async (req,res)=>{
    const {email,password}= req.body;
    try {
        const findUser=await UserModel.findOne({email})
        if(findUser){
            bcrypt.compare(password,findUser.password,async(err,result)=>{
                if(result){
                    jwt.sign({
                        userID:findUser._id,
                        userName:findUser.name
                    },
                    process.env.secrete,
                    {expiresIn:"7d"},
                    (err,token)=>{
                        if(token){
                            res.json({msg:"User logged in successfully",token});
                        }else{
                            res.json({error:err.message});
                            return
                        }
                    }
                    )
                }else{
                   res.json({msg:"Invalid credentials"})
                   return
                }
            })
        }else{
            res.json({msg:"User does not exist, please register"});
            return
        }
    } catch (error) {
        res.status(400).json({error:error})
    }
})

userRouter.post("/logout",Auth,async (req,res)=>{
    const token =req.headers.authorization?.split(" ")[1]
    const {userID,userName}= req.body;

    try {
        const blacklist= await BlacklistModel.findOne({userID})

        if(blacklist){
            const updateBlacklist= await BlacklistModel.findOneAndUpdate({userID},{tokens:[...blacklist.tokens,token]})

            if(updateBlacklist){
                res.json({msg:"User Logged out successfully"})
            }else{
                res.json({msg:"something went wrong"})
            }
        }else{
            const newBlacklist = new BlacklistModel({
                userID,
                userName,
                tokens:[token]
            });
            await newBlacklist.save();
            res.json({msg:"User Logged out successfully",blacklist:newBlacklist});
        }

    } catch (error) {
        res.status(400).json({error:error})
    }
})


module.exports = {
    userRouter
}