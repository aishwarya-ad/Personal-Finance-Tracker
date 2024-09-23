import { useState } from "react";
import { login } from "../services/authService";
import {useNavigate} from "react-router-dom"
import "../styles/LoginPage.css"

const LoginPage=()=>{
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const navigate=useNavigate()

    const handleLogin=async(e)=>{
        e.preventDefault()
        try{
            await login(email,password)
            navigate("/dashboard")
        } catch(error){
            console.log("Login failed:" , error)
        }
    }

    return(<>
        <div className="login-container">
            <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email"/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password"/>
                <button type="submit">Login</button>
            </form>
            </div>
        </div>
    </>)
}

export default LoginPage