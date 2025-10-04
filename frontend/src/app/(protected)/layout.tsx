import AuthGuard from "@/components/AuthGuard/AuthGuard";

export default function layout({children}:{children:any}){
    return (<>
        <AuthGuard children={children}/>
    </>)
}