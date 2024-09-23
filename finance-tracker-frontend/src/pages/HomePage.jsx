import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [notLoggedIn,setNotLoggedIn]=useState(true)
    useEffect(()=>{
        const token=localStorage.getItem('token')
        if(!token) setNotLoggedIn(true)
        else setNotLoggedIn(false)
    },[])

    return (
        <div>
            <h1>Welcome to the Financial Tracker</h1>
            {notLoggedIn &&(
                <>
                 <Link to="/register">Register</Link><br/>
                 <Link to="/login">Login</Link>
                </>
            ) }
        </div>
    );
};

export default HomePage;
