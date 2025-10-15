import React from "react";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import notify  from "../../components/Toast"
import "../../styles/pages/auth/recoveryPassword.css"

function RecoveryPassword (){
    let [token,setToken] =useState("")
    let [email,setEmail] =useState("")
    let [loading,setLoading] =useState(true)
    let [password,setPassword] =useState({
        newPassword:"",
        confirmPassword:""
    })
    

    function handleEmail(){
        axios.post(`${import.meta.env.VITE_APP_API}api/v1/password-recovery`,{email})
        .then(response=>{
            setToken(response.data.token)
            console.log(response.data.token)
            setEmail("")
        })
        .catch(error=>console.log(error))
    }

    function renderPage(){
        if (!token) return (
            <div className="auth-box">
                <h2>Reset Password</h2>
                <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleEmail}>Continue</button>
            </div>
        );

        if (token && !email) return (
            <div className="auth-box">
                <h2>Set New Password</h2>
                <input type="password" placeholder="New password" />
                <input type="password" placeholder="Confirm password" />
                <button>Update</button>
            </div>
        );
    }
    
    return renderPage()
}

export default RecoveryPassword