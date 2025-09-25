"use client"
import { axiosInstance } from "@/helpers/axios";
import { useState } from "react";

export default function signupPage(){
    const [username,setUsername]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    
    async function handleSignup(){
        try {
            const {data:response}=await axiosInstance.post('/api/v1/user/signup',{
                username,
                email,
                password
            })

            console.log('response : ',response);
            
        } catch (error) {
            console.log('failed to signup');
        }
    }

    return (
        <>
            <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} />
            <input type="text" value={email}    onChange={(e)=>setEmail(e.target.value)} />
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button onClick={handleSignup}>Sign up</button>
        </>
    )
}