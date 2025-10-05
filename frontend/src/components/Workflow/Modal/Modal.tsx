import { AINodeModal, GmailSendEmailModal, TelegramOnMessageModal, TelegramSendMessageModal, WebhookFormModal } from "./AllModals"

export default function Modal({doubleClickedNode,setShowModal,workflow,setWorkflow,allFetchedData}:{doubleClickedNode:any,setShowModal:any,workflow:any,setWorkflow:any,allFetchedData:any}){
    console.log('inside Modal doubleClickedNode: ',doubleClickedNode);
    
    const getModalContent=()=>{
        const type=doubleClickedNode.type
        if(type=='trigger:webhook'){
            return <WebhookFormModal doubleClickedNode={doubleClickedNode} workflow={workflow} setWorkflow={setWorkflow}/>
        }else if(type=='trigger:telegram_on_message'){
            return <TelegramOnMessageModal doubleClickedNode={doubleClickedNode} workflow={workflow} setWorkflow={setWorkflow} allFetchedData={allFetchedData}/>
        } else if(type=='telegram_send_message'){
            return <TelegramSendMessageModal doubleClickedNode={doubleClickedNode} workflow={workflow} setWorkflow={setWorkflow} allFetchedData={allFetchedData}/>
        } else if(type=='gmail_send_email'){
            return <GmailSendEmailModal doubleClickedNode={doubleClickedNode} workflow={workflow} setWorkflow={setWorkflow} allFetchedData={allFetchedData}/>
        } else if(type=='aiNode'){
            return <AINodeModal doubleClickedNode={doubleClickedNode} workflow={workflow} setWorkflow={setWorkflow} />
        }
        else return (<>Requested modal not yet formed</>)
    }
    return (<>
        <p>Modal component</p>
        <div>doubleClickedNode : {JSON.stringify(doubleClickedNode)}</div>
        {getModalContent()}
        <button onClick={()=>setShowModal(false)}>Close Modal</button>
    </>)
}