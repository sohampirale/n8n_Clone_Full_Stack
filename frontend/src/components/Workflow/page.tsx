'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Position, Handle } from '@xyflow/react';
import { axiosInstance } from "@/helpers/axios";

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const initialNodes = [
  { id: '1', type: 'WebHookNode', position: { x: 250, y: 25 }, data: { label: 'Webhook Trigger' } },
  { id: '2', type: 'AINode', position: { x: 100, y: 125 }, data: { label: 'AI Agent', prompt: 'Generate a response' } },
];

function WebHookNode({ data }) {
  return (
    <div style={{
      padding: '10px',
      border: '2px solid #4CAF50',
      borderRadius: '5px',
      background: '#E8F5E9',
      textAlign: 'center',
      minWidth: '120px',
    }}>
      <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} />
      <strong>{data.label}</strong>
      <p style={{ fontSize: '12px', color: '#555' }}>Webhook Node</p>
      <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} />
    </div>
  )
}

function AINode({ data }) {
  return (
    <div style={{
      padding: '10px',
      border: '2px solid #2196F3',
      borderRadius: '5px',
      background: '#E3F2FD',
      textAlign: 'center',
      minWidth: '120px',
    }}>
      <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} />
      <strong>{data.label}</strong>
      <p style={{ fontSize: '12px', color: '#555' }}>AI Node</p>
      <p>Prompt: {data.prompt || 'Not set'}</p>
      <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} />
    </div>
  )
}


const nodeTypes = {
  AINode,
  WebHookNode
}

export default function Workflow({username,slug}){

    const [cnt,setCnt]=useState(4)
    const [workflowDB,setWorkflowDB]=useState(null)
    const [triggerActions,setTriggerActions]=useState(null)
    const [nodeActions,setNodeActions]=useState(null)
    const [toolForms,setToolForms]=useState(null)
    const [userCredentials,setUserCredentials]=useState(null)
    const [credentialForms,setCredentialForms]=useState(null)

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef(null); 
  const [reactFlowInstance, setReactFlowInstance] = useState(null); 
  
  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds))

      setTimeout(() => {
        console.log('nodes : ', nodes)
      }, 2000)
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds))

      setTimeout(() => {
        console.log('edges : ', edges)
      }, 2000)
    },
    []
  );

  const onConnect = useCallback(
    (params) => {
      const {source,target}=params
      console.log('inside onConnect params : ', params)
      const edge={
        id:Math.random().toString(),
        source,
        target,
        type: 'default'
      }
      setEdges((eds)=>[...eds,edge])
    },
    []
  );

  function addEdge() {
    const newEdges = [...edges, { id: 'some_id', source: '2', target: '1' }]
    setEdges(newEdges)
    console.log('newEdges : ', newEdges);
  }

  
  const onDragStart = useCallback((event) => {
    console.log('Dragging started! Node type: WebHookNode'); // Log to confirm dragging
    event.dataTransfer.setData('application/reactflow', 'AINode'); // Store node type
    event.dataTransfer.effectAllowed = 'move'; // Allow moving
  }, []);

  // Handle drag over (runs while dragging over canvas)
  const onDragOver = useCallback((event) => {
    console.log('Dragging over canvas'); // Log to see it fire repeatedly
    event.preventDefault(); // Allow dropping
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop (runs when you release)
  const onDrop = useCallback(
    (event) => {
      console.log('inside onDrop');

      event.preventDefault();
      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      // Get node type from drag
      const nodeType = event.dataTransfer.getData('application/reactflow');
      console.log('nodeType : ', nodeType);

      // if (nodeType !== 'WebHookNode') return; // Safety check
      console.log('Dropped! Creating node: WebHookNode');

      // Get canvas position
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      // Convert mouse to canvas coordinates
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create new node
      const newNode = {
        id: Math.random().toString(),
        type: nodeType,
        position,
        data: { label: 'Hey there', prompt: 'Some prompt' },
      };

      setCnt(cnt+1)

      // Add to nodes
      setNodes((nds) => {
        console.log('New nodes:', [...nds, newNode]);
        return [...nds, newNode];
      });
    }
    ,
    [reactFlowInstance]
  );

   const onInit = useCallback((instance) => {
    console.log('React Flow initialized!');
    setReactFlowInstance(instance); // Store the instance
  }, []);

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
            setToolForms(response.data)        
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
                <p>Trigger actions</p>
                {triggerActions && triggerActions.map((triggerAction:any)=>{
                    return (
                    <div draggable
                    style={{
                          padding: '10px',
                          border: '2px solid #2196F3',
                          borderRadius: '5px',
                          background: '#E3F2FD',
                          textAlign: 'center',
                          minWidth: '120px',
                        }} key={triggerAction._id}>
                        {/* <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} /> */}
                        <strong>{triggerAction.name}</strong>
                        <p style={{ fontSize: '12px', color: '#555' }}>Trigger action</p>
                        <div>
                            {JSON.stringify(triggerAction)}
                        </div>
                        {/* <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} /> */}
                    </div>
                    )
                })}
            </div>

                {/* Node actions */}
            <div>
                <p>Node actions</p>
                {nodeActions && nodeActions.map((nodeAction:any)=>{
                    return (
                    <div 
                    style={{
                          padding: '10px',
                          border: '2px solid #2196F3',
                          borderRadius: '5px',
                          background: '#E3F2FD',
                          textAlign: 'center',
                          minWidth: '120px',
                        }} key={nodeAction._id}>
                        {/* <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} /> */}
                        <strong>{nodeAction.name}</strong>
                        <p style={{ fontSize: '12px', color: '#555' }}>Node action</p>
                        <div>
                            {JSON.stringify(nodeAction)}
                        </div>
                        {/* <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} /> */}
                    </div>
                    )
                })}
            </div>

            <div>
                <p>Tool Forms</p>
                
                {toolForms && toolForms.map((toolForm:any)=>{
                    return (
                    <div draggable
                    style={{
                          padding: '10px',
                          border: '2px solid #2196F3',
                          borderRadius: '5px',
                          background: '#E3F2FD',
                          textAlign: 'center',
                          minWidth: '120px',
                        }} key={toolForm._id}>
                        {/* <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} /> */}
                        <strong>{toolForm.name}</strong>
                        <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
                        <div>
                            {JSON.stringify(toolForm)}
                        </div>
                        {/* <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} /> */}
                    </div>
                    )
                })}
            </div>

            <div>
                <p>All credentials</p>
                
                {credentialForms && credentialForms.map((credentialForm:any)=>{
                    return (
                    <div draggable
                    style={{
                          padding: '10px',
                          border: '2px solid #2196F3',
                          borderRadius: '5px',
                          background: '#E3F2FD',
                          textAlign: 'center',
                          minWidth: '120px',
                        }} key={credentialForm._id}>
                        {/* <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} /> */}
                        <strong>{credentialForm.name}</strong>
                        <p style={{ fontSize: '12px', color: '#555' }}>All Credentials</p>
                        <div>
                            {JSON.stringify(credentialForms)}
                        </div>
                        {/* <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} /> */}
                    </div>
                    )
                })}
            </div>

            <div>
                <p>User credentials</p>
                
                {userCredentials && userCredentials.map((credentialForm:any)=>{
                    return (
                    <div draggable
                    style={{
                          padding: '10px',
                          border: '2px solid #2196F3',
                          borderRadius: '5px',
                          background: '#E3F2FD',
                          textAlign: 'center',
                          minWidth: '120px',
                        }} key={credentialForm._id}>
                        {/* <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} /> */}
                        <strong>{credentialForm.name}</strong>
                        <p style={{ fontSize: '12px', color: '#555' }}>User credentials</p>
                        <div>
                            {JSON.stringify(credentialForm)}
                        </div>
                        {/* <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} /> */}
                    </div>
                    )
                })}
            </div>

            <div ref={reactFlowWrapper} style={{ width: '100%', height : '100%' }}>  
            <ReactFlow
            onInit={onInit}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onDragOver={onDragOver}
            onDrop={onDrop}
            fitView
            >
            <Background />
            <Controls />
            </ReactFlow>
        </div>
        </>
    )
}
