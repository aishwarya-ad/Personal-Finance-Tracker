import axios from "axios";

const API_URL="http://localhost:8000/user"

export const login=async(email,password)=>{
    const response=await axios.post(`${API_URL}/login`,{email,password})
    console.log('Response Data:', response.data);
    if(response.data.accessToken){
        localStorage.setItem('token',response.data.accessToken)
        localStorage.setItem('userId',response.data.userId)
        //console.log(localStorage.getItem('token'));
    }
    return response.data
}

export const register=async(username,email,password)=>{
    return axios.post(`${API_URL}/register`,{username,email,password})
}

