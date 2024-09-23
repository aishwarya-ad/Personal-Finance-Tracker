import React, { useState, useEffect } from 'react';
import { getTransactions, getSavings, getTotalIncome, getTotalExpense } from '../services/api';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ExportTransactions from '../components/ExportTransaction';
import "../styles/DashBoard.css"

const DashboardPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [savings, setSavings] = useState({});
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsData = await getTransactions();
                const savingsData = await getSavings();
                const totalIncomeData = await getTotalIncome();
                const totalExpenseData = await getTotalExpense();

                setTransactions(transactionsData);
                setSavings(savingsData);
                setTotalIncome(totalIncomeData['Total Income']);
                setTotalExpense(totalExpenseData['Total Expense']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const incomeData = {
        labels: transactions.filter(t => t.type === 'income').map(t => t.category),
        datasets: [
            {
                label: 'Income',
                data: transactions.filter(t => t.type === 'income').map(t => t.amount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    };

    const expenseData = {
        labels: transactions.filter(t => t.type === 'expense').map(t => t.category),
        datasets: [
            {
                label: 'Expenses',
                data: transactions.filter(t => t.type === 'expense').map(t => t.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            }
        ]
    };

    const savingsData = {
        labels: ['Total Income', 'Total Expense', 'Savings'],
        datasets: [
            {
                label: 'Savings Overview',
                data: [totalIncome, totalExpense, savings['Savings']],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className='dashboard-container'>
            <h1>Dashboard</h1>
            <div className='charts-container'>
                <div className='chart'>
                <h2>Income and Expenses</h2>
                <Bar data={incomeData} />
                <Bar data={expenseData} />
            </div>
            <div className='chart'>
                <h2>Savings Overview</h2>
                <Pie data={savingsData} />
            </div>
            </div>
            <ExportTransactions/>
        </div>
    );
};

export default DashboardPage;
