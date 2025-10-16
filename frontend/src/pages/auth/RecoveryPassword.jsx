import React from "react";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import notify  from "../../components/Toast"
import "../../styles/pages/auth/recoveryPassword.css"

function RecoveryPassword (){
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get("token")
    let [email,setEmail] =useState("")
    let [loading,setLoading] =useState(true)
    let [password,setPassword] =useState({
        newPassword:"",
        confirmPassword:""
    })
    let navigate = useNavigate()
    
    function passwordHandler(field,e){
        setPassword({
            ...password,[field]:e.target.value
        })
    }

    function handlePasswordSubmit(){
        // console.log(token)
        if(password.newPassword !== password.confirmPassword) return
        axios.post(`${import.meta.env.VITE_APP_API}api/v1/reset-password/${token}`,{password:password.newPassword,email})
        .then(response=>{
            notify("success","successfully updated your password")
            navigate("/login")
        })
        .catch(error=>{
            notify("error","something went wrong, please try again")
            console.log(error)
        })
    }

    function handleEmail(){
        axios.post(`${import.meta.env.VITE_APP_API}api/v1/password-recovery`,{email})
        .then(response=>{
            console.log(response.data.token)
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

        if (token) return (
            <div className="auth-box">
                <h2>Set New Password</h2>
                <input type="password" onChange={(e)=>passwordHandler("newPassword",e)} placeholder="New password" />
                <input type="password" onChange={(e)=>passwordHandler("confirmPassword",e)} placeholder="Confirm password" />
                <button onClick={handlePasswordSubmit}>Update</button>
            </div>
        );
    }
    
    return renderPage()
}

export default RecoveryPassword