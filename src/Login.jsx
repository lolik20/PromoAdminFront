import { useEffect, useState } from "react";
import "./Login.css"
import axios from "axios";
import urls from "./urls.json"

export default function Login(){
    const[login,setLogin]=useState();
    const [password,setPassword] =useState()
    async function Login(){
       await axios.post(`${urls.main}/api/admin/login`,{login:login,password:password})
        .then(response=>{
            window.location.href="/"
        })
    }
    useEffect(()=>{
        localStorage.setItem("login",login)
        localStorage.setItem("password",password)

    },[login,password])
    return(
        <div className="login-container">
            <div className="login-window">
                <input className="input" value={login} onChange={(e)=>setLogin(e.target.value)}></input>
                <input className="input" value={password}onChange={(e)=>setPassword(e.target.value)}></input>
                <button className="button" onClick={()=>Login()}>Войти</button>
            </div>
        </div>
    );
}