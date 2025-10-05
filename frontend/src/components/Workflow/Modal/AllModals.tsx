"use client"
import { useEffect, useState } from 'react';
import { Copy, Check, Webhook, Zap } from 'lucide-react';
import { useParams } from 'next/navigation';

const methodOptions = ["GET", "POST", "PUT", "DELETE", "PATCH"];

// export function WebhookFormModal({ 
//   doubleClickedNode, 
//   workflow, 
//   setWorkflow 
// }: { 
//   doubleClickedNode: any, 
//   workflow: any, 
//   setWorkflow: any 
// }) {
//   console.log('inside WebhookForm');
//   const [method, setMethod] = useState("POST");
//   const [copied, setCopied] = useState(false);

//   // Mock params for demo - replace with actual useParams in your app
//   const params = { username: 'demo-user', slug: 'my-workflow' };
//   console.log('params : ', params);
//   console.log('params.slug : ', params.slug);

//   const webhookUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.example.com'}/api/v1/execution/${params.username}/${params?.slug}/webhook`;

//   function handleChangeMethod(event: any) {
//     setMethod(event.target.value);
//     const method = event.target.value;
//     const identityNo = doubleClickedNode.id;
//     const requestedTrigger = workflow.requestedTrigger;

//     if (!requestedTrigger) {
//       console.log('requested trigger not found');
//       return;
//     } else if (requestedTrigger.identityNo != identityNo) {
//       console.log('Identity no. does not match doubleClicked Webhook node and requestedTrigger in workflow obj');
//       return;
//     } else if (!requestedTrigger.data) {
//       const data = {
//         position: doubleClickedNode.position,
//         method
//       };
//       requestedTrigger.data = data;
//       setWorkflow({ ...workflow });
//       alert('data obj set to the requestedTrigger inside workflow');
//     } else {
//       requestedTrigger.data.method = method;
//       requestedTrigger.data.position = doubleClickedNode.position;
//       setWorkflow({ ...workflow });
//       alert("requestedTrigger.data is modified inside workflow object");
//     }
//   }

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(webhookUrl);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="w-full max-w-2xl mx-auto p-8">
//       {/* Header with gradient */}
//       <div className="mb-8 relative">
//         <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl blur-xl opacity-20"></div>
//         <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-6 shadow-2xl">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
//               <Webhook className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-white">Webhook Configuration</h2>
//           </div>
//           <p className="text-violet-100 text-sm">Configure your webhook endpoint and HTTP method</p>
//         </div>
//       </div>

//       {/* Webhook URL Section */}
//       <div className="mb-6 group">
//         <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//           <Zap className="w-4 h-4 text-violet-600" />
//           Webhook Endpoint URL
//         </label>
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//           <div className="relative flex items-center gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-violet-300">
//             <code className="flex-1 text-sm font-mono text-gray-700 break-all">
//               {webhookUrl}
//             </code>
//             <button
//               onClick={handleCopy}
//               className="flex-shrink-0 p-2 rounded-lg bg-white hover:bg-violet-50 border border-gray-200 hover:border-violet-300 transition-all duration-200 hover:shadow-md group/btn"
//               title="Copy to clipboard"
//             >
//               {copied ? (
//                 <Check className="w-4 h-4 text-green-600" />
//               ) : (
//                 <Copy className="w-4 h-4 text-gray-600 group-hover/btn:text-violet-600" />
//               )}
//             </button>
//           </div>
//         </div>
//         {copied && (
//           <p className="mt-2 text-sm text-green-600 font-medium animate-pulse">
//             ✓ Copied to clipboard!
//           </p>
//         )}
//       </div>

//       {/* HTTP Method Section */}
//       <div className="group">
//         <label className="block text-sm font-semibold text-gray-700 mb-3">
//           HTTP Method
//         </label>
//         <div className="relative">
//           <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
//           <select
//             value={method}
//             onChange={handleChangeMethod}
//             className="relative w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm appearance-none cursor-pointer transition-all duration-300 hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 focus:outline-none text-gray-700 font-medium"
//             style={{
//               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
//               backgroundRepeat: 'no-repeat',
//               backgroundPosition: 'right 0.75rem center',
//               backgroundSize: '1.5rem'
//             }}
//           >
//             {methodOptions.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Method badges */}
//         <div className="mt-4 flex flex-wrap gap-2">
//           {methodOptions.map((m) => (
//             <span
//               key={m}
//               onClick={() => setMethod(m)}
//               className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 ${
//                 method === m
//                   ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg scale-105'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
//               }`}
//             >
//               {m}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Info card */}
//       <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
//         <p className="text-sm text-blue-900">
//           <span className="font-semibold">💡 Tip:</span> This webhook URL will receive {method} requests. Make sure your integration is configured to use the correct HTTP method.
//         </p>
//       </div>
//     </div>
//   );
// }


export function WebhookFormModal({ doubleClickedNode, workflow, setWorkflow }: { doubleClickedNode: any, workflow: any, setWorkflow: any }) {
    console.log('inside WebhookForm');
    const [method, setMethod] = useState("POST")
    const params = useParams()
    console.log('params : ', params);
    console.log('params.slug : ', params.slug);

    function handleChangeMethod(event: any) {
        setMethod(event.target.value)
        const method = event.target.value
        const identityNo = doubleClickedNode.id
        const requestedTrigger = workflow.requestedTrigger
        if (!requestedTrigger) {
            console.log('requested trigger not foud');
            return;
        } else if (requestedTrigger.identityNo != identityNo) {
            console.log('Identity no. does not match doubleClicked Webhook node and requestedTrigger in workflow obj');
            return
        } else if (!requestedTrigger.data) {
            const data = {
                position: doubleClickedNode.position,
                method
            }
            requestedTrigger.data = data
            setWorkflow({ ...workflow })
            alert('data obj set to the requestedTrigger inside workflow')
        } else {
            requestedTrigger.data.method = method
            requestedTrigger.data.position = doubleClickedNode.position
            setWorkflow({ ...workflow })
            alert("requestedTrigger.data is modified inside workflow object")
        }
    }

    return (
        <>
            <label >Webhook Form</label>
            <p>Webhook Url</p>
            <p>{process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/execution/{params.username}/{params?.slug}/webhook</p>
            <select value={method} onChange={handleChangeMethod}>
                {methodOptions.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
        </>
    )
}

export function TelegramOnMessageModal({ doubleClickedNode, workflow, setWorkflow, allFetchedData }: { doubleClickedNode: any, workflow: any, setWorkflow: any, allFetchedData: any }) {
    console.log('inside TelegramOnMessageModal');
    const userCredentials = allFetchedData?.userCredentials
    console.log('userCredentials : ', userCredentials);
    const [selectedTelegramCredential, setSelectedTelegramCredential] = useState("")

    function handleSetTelegramCredential(event: any) {
        console.log('event.target.value  : ', event.target.value);
        setSelectedTelegramCredential(event.target.value)
        const selectedTelegramCredential = event.target.value
        const requestedTrigger = workflow?.requestedTrigger
        if (requestedTrigger) {
            requestedTrigger.credentialId = selectedTelegramCredential
            if (requestedTrigger.data) {
                requestedTrigger.data.position = doubleClickedNode.position
            } else {
                requestedTrigger.data = {
                    position: doubleClickedNode.position
                }
            }
            setWorkflow({
                ...workflow
            })
        }

    }

    return (
        <>
            <label >Telegram On Message Modal</label>
            <label >Select Telegram Credential for this trigger</label>

            <select value={selectedTelegramCredential} onChange={handleSetTelegramCredential}>
                {userCredentials && userCredentials.map((credential: any) => {
                    if (credential.credentialForm.name == 'telegram') {
                        return (
                            < option key={credential._id} value={credential._id}>
                                {JSON.stringify(credential)}
                            </option>
                        )
                    }
                })}
            </select >
            <p>--------</p>
            <p>Selected telegram credential : {selectedTelegramCredential}</p>
        </>
    )
}

export function TelegramSendMessageModal({ doubleClickedNode, workflow, setWorkflow, allFetchedData }: { doubleClickedNode: any, workflow: any, setWorkflow: any, allFetchedData: any }) {
    const [chat_id, setChatId] = useState("")
    const [text, setText] = useState("")
    const [selectedTelegramCredential, setSelectedTelegramCredential] = useState("")
    const userCredentials = allFetchedData?.userCredentials

    useEffect(() => {
        console.log('inside useEffect');

        try {
            const requestedNodes = workflow?.requestedNodes
            if (requestedNodes) {
                let requestedNode = requestedNodes.filter((node) => {
                    return node.identityNo == doubleClickedNode.id
                })

                if (requestedNode && requestedNode.length != 0) {
                    requestedNode = requestedNode[0]
                    let data = requestedNode.data
                    const selectedTelegramCredential = requestedNode.credentialId
                    if(selectedTelegramCredential){
                        setSelectedTelegramCredential(selectedTelegramCredential)
                    } else {
                        let resendCredential = userCredentials.filter((credential)=>credential.credentialForm.name=='telegram')
                        if(resendCredential){
                            const selectedTelegramCredential=resendCredential[0]._id
                            setSelectedTelegramCredential(selectedTelegramCredential)
                            requestedNode.credentialId=selectedTelegramCredential
                        }
                    }

                    if (data) {
                        const text = data.text
                        const chat_id = data.chat_id
                        if (text) {
                            setText(text)
                        } else setText('')

                        if (chat_id) {
                            setChatId(chat_id)
                        } else setChatId("")

                    } else {
                        const text = ""
                        const chat_id = ""
                        setText(text)
                        setChatId(chat_id)
                        data = {
                            text: text,
                            chat_id
                        }
                        requestedNode.data = data
                    }

                    setWorkflow({
                        ...workflow
                    })
                }
            }
        } catch (error) {

        }
    }, [doubleClickedNode.id])

    function handleChatIdChange(e: any) {
        const chat_id = e.target.value
        setChatId(chat_id)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })
        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.text = text
                data.chat_id = chat_id
            } else {
                data = {
                    position: doubleClickedNode.position,
                    text,
                    chat_id
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleTextChange(e: any) {
        const text = e.target.value
        setText(text)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })

        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.text = text
                data.chat_id = chat_id
            } else {
                data = {
                    position: doubleClickedNode.position,
                    text,
                    chat_id
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleSetTelegramCredential(event: any) {
        console.log('event.target.value  : ', event.target.value);
        setSelectedTelegramCredential(event.target.value)
        const selectedTelegramCredential = event.target.value
        const requestedTrigger = workflow?.requestedTrigger
        if (requestedTrigger) {
            requestedTrigger.credentialId = selectedTelegramCredential
            if (requestedTrigger.data) {
                requestedTrigger.data.position = doubleClickedNode.position
            } else {
                requestedTrigger.data = {
                    position: doubleClickedNode.position
                }
            }
            setWorkflow({
                ...workflow
            })
        }

    }


    return (
        <>
            <input type="text" value={chat_id ?? ""} onChange={handleChatIdChange} />
            <input type="text" value={text ?? ""} onChange={handleTextChange} />

            <label >Select Telegram Credential for this node action</label>
            <select value={selectedTelegramCredential} onChange={handleSetTelegramCredential}>
                {userCredentials && userCredentials.map((credential: any) => {
                    if (credential.credentialForm.name == 'telegram') {
                        return (
                            < option key={credential._id} value={credential._id}>
                                {JSON.stringify(credential)}
                            </option>
                        )
                    }
                })}
            </select >
        </>
    )
}

export function GmailSendEmailModal({ doubleClickedNode, workflow, setWorkflow, allFetchedData }: { doubleClickedNode: any, workflow: any, setWorkflow: any, allFetchedData: any }) {
    const [subject, setSubject] = useState("")
    const [html, setHtml] = useState("")
    const [to, setTo] = useState("")
    const [from, setFrom] = useState("")
    const userCredentials = allFetchedData?.userCredentials
    const [selectedResendCredential, setSelectedResendCredential] = useState("")


    useEffect(() => {
        console.log('inside useEffect');

        try {
            const requestedNodes = workflow?.requestedNodes
            if (requestedNodes) {
                let requestedNode = requestedNodes.filter((node: any) => {
                    return node.identityNo == doubleClickedNode.id
                })

                if (requestedNode && requestedNode.length != 0) {
                    requestedNode = requestedNode[0]
                    let data = requestedNode.data
                    if (data) {
                        const subject = data.subject
                        const to = data.to
                        const html = data.html
                        const from = data.from
                        const selectedResendCredential = requestedNode.credentialId

                        if (subject) {
                            setSubject(subject)
                        } else setSubject('')

                        if (to) {
                            setTo(to)
                        } else setTo("")

                        if (html) {
                            setHtml(html)
                        } else {
                            setHtml("")
                        }

                        if (from) {
                            setFrom(from)
                        } else {
                            setFrom("")
                        }

                        if(selectedResendCredential){
                            setSelectedResendCredential(selectedResendCredential)
                        } else {
                            if(userCredentials){
                                let gmailCredential =userCredentials.filter((credential)=>credential.credentialForm.name=='gmail')
                                if(gmailCredential && gmailCredential.length!=0){
                                    setSelectedResendCredential(gmailCredential[0]._id)
                                }
                            }
                        }


                    } else {
                        const subject = ""
                        const to = ""
                        const html = ""
                        const from = ""

                        let gmailCredential =userCredentials.filter((credential)=>credential.credentialForm.name=='gmail')

                        if(gmailCredential && gmailCredential.length!=0){
                            const selectedResendCredential=gmailCredential[0]._id
                            setSelectedResendCredential(selectedResendCredential)
                            requestedNode.credentialId=selectedResendCredential
                        }

                        setSubject(subject)
                        setTo(to)
                        setHtml(html)
                        setFrom(from)

                        data = {
                            subject,
                            to,
                            html,
                            from,
                            position: doubleClickedNode.position
                        }
                        requestedNode.data = data
                    }

                    setWorkflow({
                        ...workflow
                    })
                }
            }
        } catch (error) {

        }
    }, [doubleClickedNode.id])

    function handleChangeTo(e: any) {
        const to = e.target.value
        setTo(to)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })
        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.to = to
                data.subject = subject
                data.from = from
                data.html = html
            } else {
                data = {
                    position: doubleClickedNode.position,
                    html,
                    to,
                    from,
                    subject
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleChangeFrom(e: any) {
        const from = e.target.value
        setFrom(from)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })
        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.to = to
                data.subject = subject
                data.from = from
                data.html = html
            } else {
                data = {
                    position: doubleClickedNode.position,
                    html,
                    to,
                    from,
                    subject
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleChangeSubject(e: any) {
        const subject = e.target.value
        setSubject(subject)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })
        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.to = to
                data.subject = subject
                data.from = from
                data.html = html
            } else {
                data = {
                    position: doubleClickedNode.position,
                    html,
                    to,
                    from,
                    subject
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleChangeHTML(e: any) {
        const html = e.target.value
        setHtml(html)
        const requestedNodes = workflow?.requestedNodes
        let requestedNode = requestedNodes.filter((node: any) => {
            return node.identityNo == doubleClickedNode.id
        })
        if (requestedNode && requestedNode.length != 0) {
            requestedNode = requestedNode[0]
            console.log('Requested node found from workflow.requestedNodes : ', requestedNode);
            let data = requestedNode.data
            if (data) {
                data.position = doubleClickedNode.position
                data.to = to
                data.subject = subject
                data.from = from
                data.html = html
            } else {
                data = {
                    position: doubleClickedNode.position,
                    html,
                    to,
                    from,
                    subject
                }
                requestedNode.data = data
            }
            console.log('updated requestedNode : ', requestedNode);

            setWorkflow({
                ...workflow
            })
            console.log('workflow updated');
        } else {
            console.log('requestedNode not found in the workflow');
        }
    }

    function handleSetResendCredential(event: any) {
        console.log('event.target.value  : ', event.target.value);
        setSelectedResendCredential(event.target.value)
        const selectedResendCredential = event.target.value
        const requestedTrigger = workflow?.requestedTrigger
        if (requestedTrigger) {
            requestedTrigger.credentialId = selectedResendCredential
            if (requestedTrigger.data) {
                requestedTrigger.data.position = doubleClickedNode.position
            } else {
                requestedTrigger.data = {
                    position: doubleClickedNode.position
                }
            }
            setWorkflow({
                ...workflow
            })
        }

    }



    return (
        <>
            <input type="text" value={to} onChange={handleChangeTo} />
            <input type="text" value={from} onChange={handleChangeFrom} />
            <input type="text" value={subject} onChange={handleChangeSubject} />
            <input type="text" value={html} onChange={handleChangeHTML} />

            <label >Select Telegram Credential for this node action</label>
            <select value={selectedResendCredential} onChange={handleSetResendCredential}>
                {userCredentials && userCredentials.map((credential: any) => {
                    if (credential.credentialForm.name == 'gmail') {
                        return (
                            < option key={credential._id} value={credential._id}>
                                {JSON.stringify(credential)}
                            </option>
                        )
                    }
                })}
            </select >
        </>
    )
}