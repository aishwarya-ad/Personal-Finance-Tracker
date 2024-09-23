import { useEffect, useState } from "react";
import { checkBudget } from "../services/api";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList"
import BudgetForm from "../components/BudgetForm";
import {jwtDecode} from "jwt-decode"
import { toast, ToastContainer } from "react-toastify";  
import ExportTransactions from "../components/ExportTransaction";
//import "../styles/AddTransactionPage.css"

const AddTransactionPage=()=>{
   const [userId, setUserId] = useState("");
    const [categoryExceedingBudget,setCategoriesExceedingBudget]=useState([])
    const [transactions,setTransactions]=useState([])

    useEffect(() => {
        const decodeToken=()=>{
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token)
                console.log(decoded)
                setUserId(decoded.userId)
                console.log(userId)
            } else {
                console.error('No token found');
            }
        }
        decodeToken()
    },[])

    useEffect(()=>{
        const budgetData= async()=>{
            console.log(userId)
            const {data}=await checkBudget(userId)
            setCategoriesExceedingBudget(data||[])
            console.log(categoryExceedingBudget)
            console.log(categoryExceedingBudget.length)
        }
        budgetData()
    },[userId])

    const handleAddTransaction=(newTransactionResponse)=>{
        console.log(newTransactionResponse)
        const { transaction, message } = newTransactionResponse;
        toast.success(message||"Transaction added successfully");
        setTransactions((prevTransactions)=>[...prevTransactions,transaction])
    }


return(<div className="page-container">
    <h2>Transactions</h2>
    {categoryExceedingBudget && categoryExceedingBudget.length>0?(
        <div className="warning"> 
            <h3>Warning:Budget exceeded</h3>
            {categoryExceedingBudget.map((budget,index)=>(
                <p key={index}>
                    Category "{budget.category}" has exceeded its budget limit of {budget.limit} with a total expense of {budget.expense}.
                </p>
            ))}
        </div>
    ):(
        <p></p>
    )}
        <AddTransactionForm onTransactionAdded={handleAddTransaction} />
        <div className="transaction-list">
        <TransactionList transactionAdded={transactions} />
        </div>
        {/* <BudgetForm /> */}
        <ToastContainer />
        <ExportTransactions/>
</div>
)
}

export default AddTransactionPage