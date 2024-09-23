import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserIdFromToken } from '../services/api';
import "../styles/TransactionList.css"
import { toast, ToastContainer } from "react-toastify"; 
import ExportTransactions from './ExportTransaction';

const TransactionList = () => {
    const userId=getUserIdFromToken()
    const [transactions, setTransactions] = useState([]);

   
    useEffect(()=>{
        console.log(userId)
        const fetchTransactions = async () => {
            try {
                if (!userId) {
                    console.error('User ID is missing');
                    return;
                }
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8000/transaction/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('API Response:', response.data);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        if (userId) {
            fetchTransactions(); 
        }
    }, [userId]);

  
    const handleDelete=async (transactionId)=>{
        const token=localStorage.getItem('token')
        const response=await axios.delete(`http://localhost:8000/transaction/${transactionId}`,{
            headers:{Authorization:`Bearer ${token}`}
        })
        setTransactions(transactions.filter(trx => trx._id !== transactionId))
        const{message}=response.data
        toast.success(message)
    }

    return (
        <div className="transaction-list-container">
            <h2>Your Transactions</h2>
            <ul className="transaction-list">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <li className="transaction-item" key={transaction._id}>
                            <span className="transaction-category">{transaction.category}</span>
                            <span className="transaction-amount">Rs. {transaction.amount}</span>
                            <span className="transaction-type">({transaction.type})</span>
                            <span className="transaction-date">({new Date(transaction.createdAt).toLocaleDateString()})</span>
                            <button className="transaction-button" onClick={() => handleDelete(transaction._id)}>Delete</button>
                            {/* <button className="transaction-button" onClick={() => handleUpdate(transaction._id)}>Update</button> */}
                        </li>
                    ))
                ) : (
                    <p className="no-transactions">No transactions available.</p>
                )}
            </ul>
            <ToastContainer/>
            <ExportTransactions/>
        </div>
    );
};

export default TransactionList;
