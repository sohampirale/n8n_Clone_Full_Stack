"use client"

// import { axiosInstance } from "@/helpers/axios";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// export default function AuthGuard({children}:{children:React.ReactNode}){
//     console.log('inside AuthGuard');
    
//     const [loading, setLoading] = useState(true)
//     const router = useRouter()

//     async function helperIsLoggedIn() {
//         try {
//             const { data: response } = await axiosInstance.get('/api/v1/user/me')
//             console.log('user is logged in');
//             setLoading(false)
//         } catch (error) {
//             alert('user not logged in')
//             router.push('/signin')
//         }
//     }

//     useEffect(() => {
//         helperIsLoggedIn()
//     }, [])

//     if(loading){
//         return (
//             <>
//             <p>Page loading...AuthGuard in action!</p>
//             </>
//         )
//     } else return (<>
//         {children}
//     </>)
// }

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/helpers/axios";

type AuthContextType = {
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get("/api/v1/user/me")
      .then(res => {
        setUser(res.data?.data?.user);
        setLoading(false);
      })
      .catch(() => router.push("/signin"));
  }, []);

  if (loading) return <p>Loading...</p>;

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}
