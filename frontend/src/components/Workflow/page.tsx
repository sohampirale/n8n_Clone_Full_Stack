"use client"

import axios from "axios"
import { useEffect, useState } from "react";
import { axiosInstance } from "@/helpers/axios";

export default function Workflow({username,slug}){

    const [workflowDB,setWorkflowDB]=useState(null)
    const [triggerActions,setTriggerActions]=useState(null)
    const [nodeActions,setNodeActions]=useState(null)
    const [toolForms,setToolForms]=useState(null)
    const [userCredentials,setUserCredentials]=useState(null)
    const [credentialForms,setCredentialForms]=useState(null)


    async function fetchWorkflow(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/workflow/${username}/${slug}`)
            console.log('fetchedWorkflow : ',response.data);
            setWorkflowDB(response.data)        
        } catch (error) {
            console.log('failed to fetch workflow from BE : ',error);
        }
    }

    async function fetchAllTriggerActions(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/trigger/list`)

            console.log('all trigger actions : ',response);
            setTriggerActions(response.data)        
        } catch (error) {
            console.log('failed to fetch trigger actions from BE : ',error);
        }
    }

    async function fetchAllNodeActions(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/action/list`)

            console.log('all node actions : ',response.data);
            setNodeActions(response.data)        
        } catch (error) {
            console.log('failed to fetch node actions from BE : ',error);
        }
    }

    async function fetchAllToolForms(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/tool/list`)

            console.log('all tool forms : ',response.data);
            setNodeActions(response.data)        
        } catch (error) {
            console.log('failed to fetch tool forms from BE : ',error);
        }
    }

    async function fetchAllUserCredentials(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/credential`)

            console.log('user credentials : ',response.data);
            setUserCredentials(response.data)        
        } catch (error) {
            console.log('failed to fetch node actions from BE : ',error);
        }
    }

    async function fetchAllCredentialForms(){
        try {
            const {data:response} = await axiosInstance.get(`/api/v1/credential/list`)

            console.log('all credential forms : ',response.data);
            setCredentialForms(response.data)        
        } catch (error) {
            console.log('failed to fetch credential forms from BE : ',error);
        }
    }

    useEffect(()=>{
        fetchWorkflow()
        fetchAllTriggerActions()
        fetchAllNodeActions()
        fetchAllToolForms()
        fetchAllUserCredentials()
        fetchAllCredentialForms()
    },[])

    return (
        <>
            <p>Hello World</p>
            <div>
            </div>
        </>
    )
}
