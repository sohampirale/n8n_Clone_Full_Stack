"use client"

import { axiosInstance } from "@/helpers/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../AuthGuard/AuthGuard";

export default function Credential(props: any) {
   
    const { user } = useAuth();
    console.log('user from AuthProvider : ',user);
    
    return (
        <>
            <p>Welcome to credential page (use client)</p>
        </>
    )

}