import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterPage.css"

const RegisterPage=()=>{
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [error,setError]=useState("")
    const navigate=useNavigate()

    const handleRegister=async(e)=>{
        e.preventDefault()
        try {
            await register(username,email,password)
            navigate("/login")
        } catch (error) {
            setError("Registration failed. Please try again."); 
            console.error('Registration error:', error);
        }
    }
    return(<>
        <div className="register-container">
            <div className="register-form">
            <h2>Register</h2>
            {error && <p style={{color:"red"}}>{error}</p>}
            <form onSubmit={handleRegister}>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter the email"/>
                <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Enter the username"/>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter the password"/>
                <button type="submit">Register</button>
            </form>
            </div>
        </div>
    </>)
}

export default RegisterPage
