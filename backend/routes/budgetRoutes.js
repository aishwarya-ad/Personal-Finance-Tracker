import express from "express"
import Budget from "../models/budget.js"
import Transaction from "../models/transaction.js"
import validateToken from "../middleware/validateTokenHandler.js"
const router=express.Router()

router.use(validateToken)


router.get('/expenses/:userId', async (req, res) => {
    console.log("Expense budget route called")
    try {
        const budgets = await Budget.find({ userId: req.params.userId });
        console.log(budgets)
        const transactions = await Transaction.find({ userId: req.params.userId, type:"expense" });
        console.log(budgets,transactions)
        const budgetWithExpenses = budgets.map(budget => {
            const filteredTransactions = transactions.filter(transaction => transaction.category === budget.category);
            const totalExpense = filteredTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
            // console.log(totalExpense)
            
            return {
                ...budget._doc, // Spread the original budget data
                totalExpense,   // Add the totalExpense field
            };
        });
        
        res.status(200).json(budgetWithExpenses);
    } catch (error) {
        console.error('Error fetching budgets:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.get("/checkbudget/:userId",async(req,res)=>{
    // console.log("Check-budget route called")
    //console.log("User data from token:", req.user);
    const Id=req.params.userId
    const transactions=await Transaction.find({userId:Id,type:"expense"})
    //console.log("Transactions: ", transactions)
    const budgets=await Budget.find({userId:Id})
    //console.log("Budgets:" , budgets)
    const expenseTotals={}
    transactions.forEach(transaction => {
        if(!expenseTotals[transaction.category])
            expenseTotals[transaction.category]=transaction.amount
        else
            expenseTotals[transaction.category]+=transaction.amount
    })
    console.log("Expense Totals: ", expenseTotals)
    const exceededBudget=budgets.map((budget)=>{
        const totalExpenseForCategory=expenseTotals[budget.category]||0
        if(!totalExpenseForCategory) totalExpenseForCategory=0;
        let budgetLeft=budget.budgetLimit-totalExpenseForCategory
        if(budgetLeft<0) budgetLeft=0
        //console.log(`Category: ${budget.category}, Limit: ${budget.budgetLimit}, Expense: ${totalExpenseForCategory}`);
        const exceeds=totalExpenseForCategory>budget.budgetLimit
        return{
            category:budget.category,
            limit:budget.budgetLimit,
            expense:totalExpenseForCategory,
            budgetRemaining:budgetLeft,
            exceeds
        }
    })
    const budgeteExceedingCategories=exceededBudget.filter((budget)=>budget.exceeds)
    res.json({message:"These categories are exceeding the budget", data:budgeteExceedingCategories})
})


router.get("/budget-left/:userId",async(req,res)=>{
    const Id=req.params.userId
    const transactions=await Transaction.find({userId:Id,type:"expense"})
    const budgets=await Budget.find({userId:Id})
    const expenseTotals={}
    transactions.forEach(transaction => {
        if(!expenseTotals[transaction.category])
            expenseTotals[transaction.category]=transaction.amount
        else
            expenseTotals[transaction.category]+=transaction.amount
        
    })
    const budgetRemaining=budgets.map((budget)=>{
        let totalExpenseForCategory=expenseTotals[budget.category]
        if(!totalExpenseForCategory) totalExpenseForCategory=0;
        let budgetLeft=budget.budgetLimit-totalExpenseForCategory
        if(budgetLeft<0) budgetLeft=0
        return({
            budgetId:budget._id,
            category:budget.category,
            limit:budget.budgetLimit,
            expense:totalExpenseForCategory,
            budgetRemaining:budgetLeft
        })
    })
    res.json(budgetRemaining)
})

router.post("/add",async(req,res)=>{
    const budget = new Budget(req.body)
    await budget.save()
    res.status(200).json({message:"Budget added successfully",date:budget})
})

router.get("/:userId",async(req,res)=>{
    const budget=await Budget.find({userId:req.params.userId})
    res.status(200).json(budget)
})

router.get("/:category/:userId",async(req,res)=>{
    console.log(req.params.category)
    const budget=await Budget.find({category:req.params.category,userId:req.params.userId})
    res.status(200).json(budget)
})

router.delete("/:budegtId",async(req,res)=>{
    const deletedbudget=await Budget.findByIdAndDelete(req.params.budegtId)
    res.status(200).json({message:"Budget deleted successfully",data:deletedbudget})
    if(!deletedbudget) 
        res.status(404).json({message:"Budget not found"})
})

router.put("/:budgetId",async(req,res)=>{
    const updatedbudget=await Budget.findByIdAndUpdate(req.params.budgetId,req.body,{new:true})
    res.status(200).json({message:"Budget updated successfully",data:updatedbudget})
    if(!updatedbudget) 
        res.status(404).json({message:"Budget not found"})
})










export default router