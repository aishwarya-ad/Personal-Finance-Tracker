import { useState, useEffect } from "react";
import axios from "axios";
import { addTransaction, getUserIdFromToken, getTransactionCategories } from "../services/api";
import { jwtDecode } from "jwt-decode";
import "../styles/AddTransactionForm.css"
import { toast, ToastContainer } from "react-toastify";

const AddTransactionForm = () => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');
    const [transactions, setTransactions] = useState([])
    const [existingCategories, setExistingCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getTransactionCategories();
                console.log(categories)
                setExistingCategories(categories || []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    console.log(existingCategories)
    const handleSubmit = async (event) => {
        event.preventDefault();

        const userId = getUserIdFromToken()
        try {
            const newTransactionResponse = await addTransaction({ amount, category, type, userId });
            const { message, transaction } = newTransactionResponse
            console.log(message)
            toast.success(message)
            setTransactions((prevTransactions) => [...prevTransactions, transaction]);
            setAmount('');
            setCategory('');
            setType('expense');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Error adding transaction';
            toast.error(errorMessage);
            console.error('Error adding transaction:', error);
        }
    };
    return (<>
        <div className="add-transaction-form-container">
            <div className="add-transaction-form">
                <h2>Add Transaction</h2>
                <form onSubmit={handleSubmit}>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
                    <input type="text" list="category-options" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                    <datalist id="category-options">
                        {existingCategories.map((cat, index) => (
                            <option key={index} value={cat} />
                        ))}
                    </datalist>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <button type="submit">Add transaction</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    </>)
}

export default AddTransactionForm