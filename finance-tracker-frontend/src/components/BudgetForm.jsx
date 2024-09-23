import { useState } from "react";
import axios from "axios";
import "../styles/BudgetForm.css"
import { getUserIdFromToken } from "../services/api";
import { ToastContainer, toast } from "react-toastify";

const BudgetForm = () => {
    const [category, setCategory] = useState("")
    const [budgetLimit, setBudgetLimit] = useState(" ")

    const handleAddBudget = async (e) => {
        e.preventDefault()
        const userId = getUserIdFromToken()
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(
                'http://localhost:8000/budget/add',
                { category, budgetLimit, userId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const { message } = response.data
            toast.success(message)
            console.log("Budget added", response.data)
        } catch (error) {
            console.log("Error adding budget ", error)
        }
    }

    return (<>
        <div className="budget-container">
            <div className="budget-box">
                <h2>Add Budget</h2>
                <form onSubmit={handleAddBudget}>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Enter the category" />
                    <input type="number" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} placeholder="Enter the budget limit" />
                    <button type="submit">Add budget</button>
                </form>

            </div>
            <ToastContainer />
        </div>
    </>)
}

export default BudgetForm