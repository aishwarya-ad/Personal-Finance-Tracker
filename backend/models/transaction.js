import mongoose from "mongoose";

const transactionSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId ,
        ref:"User"
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true
    }

},{timestamps:true})

export default mongoose.model("Transaction",transactionSchema)