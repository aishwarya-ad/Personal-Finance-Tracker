import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import transactionRouter from "./routes/transactionRoutes.js"
import userRouter from "./routes/userRoutes.js"
import budgetRouter from "./routes/budgetRoutes.js"
import validateToken from "./middleware/validateTokenHandler.js"
const app=express()
const port=process.env.PORT||3000

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods if necessary
    credentials: true // If you're using cookies, set this to true
  }));

mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("Mongo db connected"))
.catch((err)=>console.log("Mongo db error",err))

app.use(express.json())
// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// });
app.use("/transaction",transactionRouter)
app.use("/user",userRouter)
app.use("/budget",budgetRouter)

// app.get("/checkbudget/66e289e3f211c541ddacc6a2",validateToken,async (req,res)=>res.json())
app.listen(8000,()=>{
    console.log(`Server running at port: ${port}`)
})