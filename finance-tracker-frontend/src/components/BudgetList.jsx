import { useState, useEffect } from "react";
import { getBudget, getUserIdFromToken, updateBudget } from "../services/api";
import axios from "axios";
import "../styles/BudgetList.css"
import { toast, ToastContainer } from "react-toastify";

const BudgetList = () => {
    const [budgets, setBudgets] = useState([])
    const [editingBudget, setEditingBudget] = useState(null)
    useEffect(() => {
        const fetchBudgets = async () => {
            const userId = await getUserIdFromToken()
            try {
                const fetchedBudgets = await getBudget()
                console.log(fetchedBudgets)
                setBudgets(fetchedBudgets)
            } catch (error) {
                console.log("Error fetching budgets: ", error)
            }
        }
        fetchBudgets()
    }, [])

    const calculateUsedPercentage = (budget) => {
        const totalExpenseForCategory = budget.expense || 0;
        //console.log(totalExpenseForCategory)
        const budgetLimit = budget.limit
        const percentage = (totalExpenseForCategory / budgetLimit) * 100
        return Math.min(percentage, 100)
    }

    const handleDelete = async (budgetId) => {
        const token = localStorage.getItem('token')
        const response = await axios.delete(`http://localhost:8000/budget/${budgetId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        // setBudgets(budgets.filter(trx => trx._id !== budgetId))
        setBudgets((prevBudgets) => prevBudgets.filter(budget => budget._id !== budgetId));
        const { message } = response.data
        toast.success(message)
    }

    const handleEditClick = (budget) => {
        console.log("Handle edit click called")
        setEditingBudget(budget)
        console.log(budget.budgetId)
    }

    const handleUpdate = async (e) => {
        console.log("Handle update called")
        // e.preventDefault()
        const updatedBudget = {
            budgetLimit: editingBudget.limit,  
            category: editingBudget.category,
            expense: editingBudget.expense,
            budgetRemaining: editingBudget.budgetRemaining,
        };
        try {
            console.log(editingBudget)
            const response = await updateBudget(editingBudget.budgetId, updatedBudget)
            console.log(response.message)
            setEditingBudget(null)
            // const{message}=response
            toast.success(response.message)
        } catch (error) {
            console.log("Error updating the budget", error)
        }
    }

    const handleInputChange = (e) => {
        setEditingBudget({ ...editingBudget, [e.target.name]: e.target.value })
    }

    return (
        <div className="budget-list">
            <h2>Budget List</h2>
            {budgets.length > 0 ? (<ul>
                {budgets.map((budget, index) => (
                    <li key={budget.budgetId || index}>
                        {editingBudget && editingBudget.budgetId === budget.budgetId ? (
                            <form onSubmit={handleUpdate}>
                                <input type="text" name="category" value={editingBudget.category} onChange={handleInputChange} />
                                <input type="number" name="limit" value={editingBudget.limit} onChange={handleInputChange} />
                                <button type="submit">Save</button>
                                <button onClick={(e) => { e.preventDefault(); setEditingBudget(null) }}>Cancel</button>
                            </form>
                        ) : (
                            <div className="budget-info">
                                <h3>{budget.category}</h3>
                                <p>Limit: Rs. {budget.limit}</p>
                                <p>Used: Rs. {budget.expense}</p>
                                <p>Remaining: Rs. {budget.budgetRemaining}</p>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${calculateUsedPercentage(budget)}%` }}
                                    ></div>
                                </div>
                                <p>{Math.min(calculateUsedPercentage(budget), 100).toFixed(2)}% used</p>
                                <button onClick={() => handleDelete(budget.budgetId)}>Delete</button>
                                <button onClick={() => handleEditClick(budget)}>Update</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>) : (<p>No budgets found</p>)}
            <ToastContainer />
        </div>
    )
}
export default BudgetList