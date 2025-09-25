"use client"

import { axiosInstance } from "@/helpers/axios";
import { useState } from "react";

export default function signinPage(){
    const [identifier,setIdentifier]=useState("")
    const [password,setPassword]=useState("")
    
    async function handleSignin(){
        try {
            const {data:response}=await axiosInstance.post('/api/v1/user/signin',{
                identifier,
                password
            })
            console.log('response : ',response);
            
        } catch (error) {
            console.log('failed to signin');
        }
    }

    return (
        <>
            <input type="text" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} />
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button onClick={handleSignin}>Sign in</button>
        </>
    )
}