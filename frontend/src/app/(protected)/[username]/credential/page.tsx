
import { NextRequest } from "next/server";
import Credential from "@/components/Credential/Credential";

export default async function credentialPage(req:NextRequest){
    return (
        <>
            <Credential />
        </>
    )
 
}