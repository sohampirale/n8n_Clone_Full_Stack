import Workflow from "@/components/Workflow/page";

export default async function workflow({params}){
    const {username,slug}=await params;

    return (
        <>
            <p>Hello Workflow</p>
            <div>
                <p>Username : {username}</p>
                <p>Slug : {slug}</p>
                <Workflow username={username} slug={slug} />
            </div>
        </>
    )
}