import React from "react";
import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios"
import notify  from "../../components/Toast"

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
        if(!token) return (
            <div className="email-container">
                <input type="email" name="email" id="" onChange={(e)=>setEmail(e.target.value)}/>
                <button onClick={handleEmail}>Proceed</button>
            </div>
        )
        
        if(token && !email) return (
            <div className="password-container">
                <label htmlFor="">new password</label>
                <input type="password" />
                 <label htmlFor="">confirm password</label>
                <input type="password" />
                <button>update password</button>
            </div>
        )
    }
    
    return renderPage()
}

export default RecoveryPassword