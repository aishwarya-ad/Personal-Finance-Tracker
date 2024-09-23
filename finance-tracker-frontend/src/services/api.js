import axios from "axios";
import { jwtDecode } from "jwt-decode"
const API_URL = 'http://localhost:8000'


export const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            return decoded.userId; 
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }
    return null;
};

export const checkBudget = async (userId) => {

    try {
        console.log(userId)
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token not found');
        const response = await axios.get(`${API_URL}/budget/checkbudget/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        console.log(response.data)
        return response.data

    } catch (error) {
    }
}

export const addTransaction = async (transaction) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/transaction/add`, transaction, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error; 
    }
};


export const getTransactions = async () => {
    const userId = getUserIdFromToken()
    console.log(userId)
    const response = await axios.get(`${API_URL}/transaction/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const getSavings = async () => {
    const userId = getUserIdFromToken()
    const response = await axios.get(`${API_URL}/transaction/savings/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    // console.log(response.data)
    return response.data;
};


export const getTotalIncome = async () => {
    const userId = getUserIdFromToken()
    const response = await axios.get(`${API_URL}/transaction/totalIncome/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};


export const getTotalExpense = async () => {
    const userId = getUserIdFromToken()
    const response = await axios.get(`${API_URL}/transaction/totalExpense/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.data;
};

export const exportTransactions = async () => {
    const userId = getUserIdFromToken()
    try {
        const response = await axios.get(`${API_URL}/transaction/export/excel/${userId}`, {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error('Error exporting transactions:', error);
        throw error;
    }
};

export const getBudget = async () => {
    const userId = getUserIdFromToken()
    const response = await axios.get(`${API_URL}/budget/budget-left/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    console.log(response.data)
    return response.data;
}

export const getTransactionCategories = async () => {
    const userId = getUserIdFromToken()
    const response = await axios.get(`${API_URL}/transaction/categories/${userId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    console.log(response.data)
    return response.data
}

export const updateBudget = async (budegtId, updatedbudgetdata) => {
    console.log(updatedbudgetdata)
    const response = await axios.put(`${API_URL}/budget/${budegtId}`, updatedbudgetdata, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    console.log(response.data)
    return response.data
}

