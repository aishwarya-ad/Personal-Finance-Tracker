import express from "express"
import User from "../models/user.js"
import bcrypt from "bcrypt"
import JWT from "jsonwebtoken"
import validateToken from "../middleware/validateTokenHandler.js"

const router=express.Router()

router.post("/register",async(req,res)=>{
    const {username,email,password}=req.body
    const userAvailable = await User.findOne({email})
    if(userAvailable) 
        res.status(404).json({message:"User already reistered"})
    const hashedPassword = await bcrypt.hash(password,10)
    const user=await new User({username,email,password:hashedPassword})
    await user.save()
    res.status(200).json(user)
})

router.post("/login",async(req,res)=>{
    const {email,password} =req.body
    const user= await User.findOne({email})
    if(user && (await bcrypt.compare(password,user.password))){
        const payload={
            userId:user._id,
            username:user.username,
            email:user.email,
        }
        //console.log("Payload before signing:", payload)
        const accessToken=JWT.sign(payload,process.env.SECRET)
        res.status(200).json({accessToken})
    }
    else{
        res.status(400).json({message:"Email or password is incorrect"})
    }
})

router.get("/me",validateToken,async(req,res)=>{
    res.json(req.user)
})

export default router