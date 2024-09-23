import mongoose from "mongoose";
const budgetSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    category:{
        type:String,
        required:true
    },
    budgetLimit:{
        type:Number,
        required:true
    },
    saveGoal:{
        type:Number
    }
})

export default mongoose.model("Budget",budgetSchema)