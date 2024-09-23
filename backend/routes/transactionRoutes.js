import express from "express"
import XLSX from "xlsx"
import Transaction from "../models/transaction.js"
import Budget from "../models/budget.js"
import validateToken from "../middleware/validateTokenHandler.js"
import transaction from "../models/transaction.js"
const router=express.Router()

router.use(validateToken)
router.post("/add",async(req,res)=>{
    const transaction= new Transaction(req.body)
    await transaction.save()
    if(transaction.type=="income"){
        const savingsSuggest=transaction.amount*0.2
    
    res.status(200).json({transaction , message:`Consider saving Rs.${savingsSuggest}`})}
    else
    res.status(200).json({transaction,message:"Transaction added successfully"})
})

router.get("/:userId",async(req,res)=>{
    const transactions= await Transaction.find({userId:req.params.userId})
    res.status(200).json(transactions)
})

router.delete("/:transactionId",async(req,res)=>{
    const deletedtransaction=await Transaction.findByIdAndDelete(req.params.transactionId)
    res.status(200).json({message:"Transaction deleted successfully",data:deletedtransaction})
    if(!deletedtransaction) 
        res.status(404).json({message:"Transaction not found"})
})

router.put("/:transactionId",async(req,res)=>{
    const updatedTransation=await Transaction.findByIdAndUpdate(req.params.transactionId,req.body,{new:true})
    res.status(200).json({message:"Transaction updated successfully",data:updatedTransation})
    if(!updatedTransation) 
        res.status(404).json({message:"Transaction not found"})
})

router.get("/categories/:userId",async(req,res)=>{
    const categories=await Transaction.distinct("category",{userId:req.params.userId})
    res.status(200).json(categories)
})
// router.get("/categories/income/:userId",async(req,res)=>{
//     const categories=await Transaction.distinct("category",{userId:req.params.userId,type:"income"})
//     res.status(200).json(categories)
// })

router.get("/savings/:userId",async(req,res)=>{
    const Id=req.params.userId
    const transactions = await Transaction.find({userId:Id})
    let totalIncome=0;
    let totalExpense=0;
    // console.log(transactions)
    transactions.forEach(transaction => {
        if(transaction.type=="income"){
            totalIncome+=transaction.amount
        }
        else totalExpense+=transaction.amount   
    });
    let balance=totalIncome-totalExpense
    // console.log(totalIncome)
    // console.log(totalExpense)
    if(balance<0) balance=0
    const savingtransactions=await Transaction.find({userId:Id,category: { $in: ["savings", "Savings"] }})
    let savings=0;
    savingtransactions.forEach(transaction=>{
        savings+=transaction.amount
    })
    const finalSavings=balance+savings
    res.status(200).json({
        "Total Income":totalIncome,
        "Total Expense":totalExpense,
        "Savings":finalSavings
    })
})

router.get("/totalIncome/:userId",async(req,res)=>{
    const Id=req.params.userId
    const transactions=await Transaction.find({userId:Id,type:"income"})
    let totalIncome=0
    transactions.forEach(transaction=>{
        totalIncome+=transaction.amount
    })
    res.json({
        "Total Income":totalIncome
    })
})

router.get("/totalExpense/:userId",async(req,res)=>{
    const Id=req.params.userId
    const transactions=await Transaction.find({userId:Id,type:"expense"})
    let totalExpense=0
    transactions.forEach(transaction=>{
        totalExpense+=transaction.amount
    })
    res.json({
        "Total Expense":totalExpense
    })
})

router.get("/export/excel/:userId",async(req,res)=>{
    const Id=req.params.userId
    const transactions=await Transaction.find({userId:Id})
    if(!transactions.length){
        return res.status(404).json({message:"No transactions found"})
    }
    const transactionsData=transactions.map((transaction)=>({
        Category:transaction.category,
        Type:transaction.type,
        Amount:transaction.amount,
        Date:transaction.createdAt
    }))

    const workbook=XLSX.utils.book_new()
    const worksheet=XLSX.utils.json_to_sheet(transactionsData)
    XLSX.utils.book_append_sheet(workbook,worksheet,"Transactions")

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.header('Content-Disposition', 'attachment; filename="transactions.xlsx"');
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);
})


export default router