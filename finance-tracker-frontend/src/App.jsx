import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './index.css'
import AddTransactionForm from './components/AddTransactionForm'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddTransactionPage from './pages/AddTransactionPage'
import BudgetForm from './components/BudgetForm'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import 'react-toastify/dist/ReactToastify.css';
import DashboardPage from './pages/DashboardPage'
import BudgetList from './components/BudgetList'
import Navbar from './components/Navbar'
import TransactionList from './components/TransactionList'
// import AddTransactionForm from './components/AddTransactionForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar/>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/addTransaction" element={<AddTransactionForm/>} />
                <Route path="/addBudget" element={<BudgetForm/>} />
                <Route path="/budget-list" element={<BudgetList/>} />
                <Route path="/transaction-list" element={<TransactionList/>} />
            </Routes>
      </Router>
    // <RegisterPage/>
  )
}

export default App
