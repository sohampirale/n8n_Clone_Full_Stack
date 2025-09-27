'use client';
import '@xyflow/react/dist/style.css';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Position, Handle, ReactFlowProvider, NodeTypes } from '@xyflow/react';
import { axiosInstance } from "@/helpers/axios";
import { ReactFlowNode, ReactFlowAINode, ReactFlowTriggerNode } from './ReactFlow/Nodes';

// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
// const initialNodes = [
//   { id: '1', type: 'WebHookNode', position: { x: 250, y: 25 }, data: { label: 'Webhook Trigger' } },
//   { id: '2', type: 'AINode', position: { x: 100, y: 125 }, data: { label: 'AI Agent', prompt: 'Generate a response' } },
// ];


// function WebHookNode({ data }) {
//   return (
//     <div style={{
//       padding: '10px',
//       border: '2px solid #4CAF50',
//       borderRadius: '5px',
//       background: '#E8F5E9',
//       textAlign: 'center',
//       minWidth: '120px',
//     }}>
//       <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} />
//       <strong>{data.label}</strong>
//       <p style={{ fontSize: '12px', color: '#555' }}>Webhook Node</p>
//       <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} />
//     </div>
//   )
// }

export default function Workflow({ username, slug }: { username: string, slug: string }) {

  const [cnt, setCnt] = useState(4)
  const [workflowDB, setWorkflowDB] = useState(null)
  const [triggerActions, setTriggerActions] = useState([])
  const [nodeActions, setNodeActions] = useState([])
  const [toolForms, setToolForms] = useState(null)
  const [userCredentials, setUserCredentials] = useState(null)
  const [credentialForms, setCredentialForms] = useState(null)

  const [workflow, setWorkflow] = useState({
    name: slug,
    requestedTrigger: null,
    requestedNodes: [],
    requestedTools: [],
    requestedLLMS: []
  })

  const [trigger, setTrigger] = useState(null)
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [createdObjects, setCreatedObjects] = useState({
    node: [],
    aiNode: [],
    tool: [],
    llm: [],
    trigger: []
  })

  // const nodeTypes = useMemo(() => {
  //   const types: NodeTypes = {};
  //   nodeActions.forEach(nodeAction => {
  //     types[nodeAction.name] = React.memo((props) => (<ReactFlowNode {...props} data={nodeAction} />));
  //   });

  //   console.log('new nodeTypes : ',types);

  //   return types;
  // }, [nodeActions]);


  // const nodeTypes = useMemo(() => {
  //   const types: NodeTypes = {};

  //   nodeActions.forEach(nodeAction => {
  //     // Create a stable component function outside of render if possible
  //     types[nodeAction.name] = React.memo(function NodeComponent(props) {
  //       return <ReactFlowNode {...props} data={nodeAction} />;
  //     });
  //   });

  //   return types;
  // }, [nodeActions]);

  // const [nodeTypes, setNodeTypes] = useState({})

  const nodeTypes = useMemo(() => {
    if (!nodeActions || nodeActions.length === 0) {
      return {};
    }

    const types: NodeTypes = {};
    nodeActions.forEach(nodeAction => {
      types[nodeAction.name] = function NodeComponent(props) {
        return <ReactFlowNode data={nodeAction} />;
      }
    });


    triggerActions.forEach(triggerAction => {
      types[triggerAction.name] = function NodeComponent(props) {
        return <ReactFlowTriggerNode data={triggerAction} />;
      }
    });

    console.log('Generated nodeTypes:', types);
    return types;
  }, [nodeActions, triggerActions]); // Dependency on nodeActions and triggerActions


  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))

    setTimeout(() => {
      console.log('edges : ', edges)
    }, 2000)
  }

  function updateWorkflow(source: string, sourceRole: string, target: string, targetRole: string) {
    console.log('inside updateWorkflow, sourceRole : ', sourceRole, ' targetRole : ', targetRole);
    if (sourceRole == 'trigger') {
      if (targetRole == 'node') {
        //update the triggerIdentityNo for that node in the requestedNodes in workflow
        let nodeObj = nodes.filter((node) => node.identityNo == target)
        let triggerObj = nodes.filter((node) => node.identityNo == source)

        if (nodeObj && nodeObj.length != 0) {
          nodeObj = nodeObj[0]
        } else {
          console.log('nodeObj not found from nodes, returning');
          return false;
        }

        if (triggerObj && triggerObj.length != 0) {
          triggerObj = triggerObj[0]
        } else {
          console.log('triggerObj not found from nodes, returning');
          return false;
        }

        console.log('nodeObj : ', nodeObj);
        console.log('triggerObj : ', triggerObj);


        const existingNodeInWorkflow = workflow.requestedNodes.filter((node) => node.identityNo == nodeObj.identityNo)
        if (!existingNodeInWorkflow) {
          console.log('nodeObj(target) does not exists in the workflow obj');
          return false;
        }

        existingNodeInWorkflow.prerequisiteNodesIdentityNos.push(triggerObj.identityNo)


      }
    }
  }

  const onConnect = (params) => {
    const { source, target, sourceHandle, targetHandle } = params
    console.log('inside onConnect params : ', params)

    const { node, aiNode, llm, tool, trigger } = createdObjects
    let sourceRole, targetRole;

    if (node.includes(source)) {
      console.log('source is a node');
      sourceRole = 'node'
    } else if (aiNode.includes(source)) {
      console.log('source is an aiNode');
      sourceRole = 'node'
    } else if (trigger[0] == source) {
      console.log('Source is trigger');
      sourceRole = 'trigger'
    } else {
      console.log('invalid source identityType, not forming this edge');
      return;
    }


    if (node.includes(target)) {
      console.log('target is a node');
      targetRole = 'node'
    } else if (aiNode.includes(target)) {
      console.log('target is an aiNode');
      targetRole = 'aiNode'
    } else if (llm.includes(target)) {
      console.log('target is an llm');
      targetRole = 'llm'
    } else if (tool.includes(target)) {
      console.log('target is a tool');
      targetRole = 'tool'
    } else {
      console.log('invalid target indentityType, not forming this edge');
      return;
    }

    //rules
    if (sourceRole == 'trigger') {
      if (!(targetRole == 'node' || targetRole == 'aiNode')) {
        console.log('Invalid edge,trigger cannot directly connect with : ', targetRole);
        return;
      }
    } else if (sourceRole == 'node') {
      if (!(targetRole == 'node' || targetRole == 'aiNode')) {
        console.log('Invalid edge,node cannot directly connect with : ', targetRole);
        return;
      }
    } else if (sourceRole == 'aiNode') {
      if (sourceHandle == 'right') {
        if (!(targetRole == 'node' || targetRole == 'aiNode')) {
          console.log('Invalid edge,aiNode cannot forward request to  : ', targetRole);
          return;
        }
      } else if (sourceHandle == 'top') {
        if (!targetRole == 'llm') {
          console.log('Invalid edge,aiNode cannot use  : ', targetRole, ' as LLM');
          return;
        }
      } else if (sourceHandle == 'bottom') {
        if (!targetRole == 'tool') {
          console.log('Invalid edge,aiNode cannot use  : ', targetRole, ' as tool');
          return;
        }
      }
    }

    updateWorkflow(source, sourceRole, target, targetRole);

    const edge = {
      id: Math.random().toString(),
      source,
      target,
      type: 'default'
    }

    setEdges((eds) => [...eds, edge])
  }

  function addEdge() {
    const newEdges = [...edges, { id: 'some_id', source: '2', target: '1' }]
    setEdges(newEdges)
    console.log('newEdges : ', newEdges);
  }

  // const onDragStart = useCallback((event) => {
  //   console.log('Dragging started! Node type: WebHookNode'); // Log to confirm dragging
  //   event.dataTransfer.setData('application/reactflow', 'AINode'); // Store node type
  //   event.dataTransfer.effectAllowed = 'move'; // Allow moving
  // }, []);

  const onDragStart = (data, instanceType: string) => (event: React.DragEvent) => {
    console.log('Dragging started! instance :', data.name, 'Type:', data.type);
    console.log('instanceType ; ', instanceType);

    console.log('data : ', data);

    const dragData = {
      type: data.name,
      data: data,
      instanceType
    };

    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
    event.dataTransfer.effectAllowed = 'move';
  }

  // Handle drag over (runs while dragging over canvas)
  const onDragOver = (event) => {
    console.log('Dragging over canvas'); // Log to see it fire repeatedly
    event.preventDefault(); // Allow dropping
    event.dataTransfer.dropEffect = 'move';
  }

  // Handle drop (runs when you release)
  const onDrop = (event) => {
    console.log('inside onDrop');

    event.preventDefault();
    if (!reactFlowInstance || !reactFlowWrapper.current) return;

    const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    const { type, data, instanceType } = nodeData;
    console.log('type : ', type);
    console.log('data : ', data);

    console.log('instanceType : ', instanceType);


    console.log('Dropped! Creating node: ', type);

    // Get canvas position
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    //   { id: '1', type: 'WebHookNode', position: { x: 250, y: 25 }, data: { label: 'Webhook Trigger' } },

    const id = Date.now().toString();
    const newNode = {
      id,
      type,
      position,
      data: {
        label: type
      },
    };

    if (instanceType == 'node') {
      const newNodeWorkflow = {
        identityNo: id,
        nodeActionId: data._id,
        prerequisiteNodesIdentityNos: [],
        nodeAction: data
      }
      workflow.requestedNodes.push(newNodeWorkflow)
    } else if (instanceType == 'trigger') {

      if (trigger) {
        console.log('Only single trigger can exist in a workflow');

        const triggerId = trigger.id;
        const newNodes = nodes.filter((node) => node.id != triggerId)
        const newEdges = edges.filter((edge) => edge.source != triggerId)
        setEdges(newEdges)
        setNodes(newNodes)
      }

      const newTriggerWorkflow = {
        identityNo: id,
        triggerActionId: data._id,
        triggerAction: data
      }
      workflow.requestedTrigger = newTriggerWorkflow
      setTrigger(newNode)
    }

    console.log('newNode thats pushed onto nodes : ', newNode);

    setNodes((nds) => {
      console.log('New nodes:', [...nds, newNode]);
      return [...nds, newNode];
    });

    createdObjects[instanceType].push(newNode.id)
    console.log('createdObjects : ', createdObjects);

    setCreatedObjects({ ...createdObjects })
  }

  const onInit = (instance) => {
    console.log('React Flow initialized!');
    setReactFlowInstance(instance); // Store the instance
  };

  function createNodeComponent(data) {
    return function (props) {
      return <ReactFlowNode data={data} />
    }
  }

  async function fetchWorkflow() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/workflow/${username}/${slug}`)
      console.log('fetchedWorkflow : ', response.data);
      setWorkflowDB(response.data)
    } catch (error) {
      console.log('failed to fetch workflow from BE : ', error);
    }
  }

  async function fetchAllTriggerActions() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/trigger/list`)

      console.log('all trigger actions : ', response);
      setTriggerActions(response.data)
    } catch (error) {
      console.log('failed to fetch trigger actions from BE : ', error);
    }
  }

  async function fetchAllNodeActions() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/action/list`)
      const allNodeActions = response.data
      setNodeActions(response.data)

    } catch (error) {
      console.log('failed to fetch node actions from BE : ', error);
    }
  }

  async function fetchAllToolForms() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/tool/list`)

      console.log('all tool forms : ', response.data);
      setToolForms(response.data)
    } catch (error) {
      console.log('failed to fetch tool forms from BE : ', error);
    }
  }

  async function fetchAllUserCredentials() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/credential`)

      console.log('user credentials : ', response.data);
      setUserCredentials(response.data)
    } catch (error) {
      console.log('failed to fetch node actions from BE : ', error);
    }
  }

  async function fetchAllCredentialForms() {
    try {
      const { data: response } = await axiosInstance.get(`/api/v1/credential/list`)

      console.log('all credential forms : ', response.data);
      setCredentialForms(response.data)
    } catch (error) {
      console.log('failed to fetch credential forms from BE : ', error);
    }
  }

  useEffect(() => {
    // fetchWorkflow()
    fetchAllTriggerActions()
    fetchAllNodeActions()
    // fetchAllToolForms()
    // fetchAllUserCredentials()
    // fetchAllCredentialForms()

  }, [])

  useEffect(() => {
    console.log('new nodeTypes ; ', nodeTypes);
  }, [nodeTypes])

  function logNodeTypes() {
    console.log('nodeTypes : ', nodeTypes);
  }

  return (
    <>
      <ReactFlowProvider>
        <button onClick={logNodeTypes}>log nodeTypes </button>
        <div>
          <p>nodeTypes</p>
          {JSON.stringify(nodeTypes)}

          <p>Node Actions List</p>
          <div>
            <p>Node actions</p>
            {nodeActions && nodeActions.map((nodeAction: any) => {

              return (
                <div draggable
                  style={{
                    padding: '10px',
                    border: '2px solid #2196F3',
                    borderRadius: '5px',
                    background: '#E3F2FD',
                    textAlign: 'center',
                    minWidth: '120px',
                  }}
                  key={nodeAction._id}
                  onDragStart={onDragStart(nodeAction, 'node')}
                >
                  <strong>{nodeAction.name}</strong>
                  <p style={{ fontSize: '12px', color: '#555' }}>Node action</p>
                  <div>
                    {JSON.stringify(nodeAction)}
                  </div>
                </div>
              )
            })}
          </div>

        </div>

        <div>
          <p>Trigger actions</p>
          {triggerActions?.map((triggerAction) => (
            <div
              key={triggerAction._id}
              draggable
              style={{
                padding: '10px',
                border: '2px solid #2196F3',
                borderRadius: '5px',
                background: '#E3F2FD',
                textAlign: 'center',
                minWidth: '120px',
                cursor: 'grab',
              }}
              onDragStart={onDragStart(triggerAction, 'trigger')}
            >

              <strong>{triggerAction.name}</strong>
              <p style={{ fontSize: '12px', color: '#555', margin: '4px 0' }}>
                Trigger action
              </p>
              <div style={{ fontSize: '10px', marginTop: '8px' }}>
                {JSON.stringify(triggerAction)}
              </div>
            </div>
          ))}
        </div>
        Reactflow canvas
        <div ref={reactFlowWrapper} style={{ width: '100%', height: '80vh' }}>
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
      </ReactFlowProvider>
    </>
  )
}

{/* <p>Hello World</p>
        <div>
          <p>Trigger actions</p>
          {triggerActions && triggerActions.map((triggerAction: any) => {
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
                <Handle type="target" id="target" position={Position.Right} style={{ background: '#4CAF50' }} />
                <strong>{triggerAction.name}</strong>
                <p style={{ fontSize: '12px', color: '#555' }}>Trigger action</p>
                <div>
                  {JSON.stringify(triggerAction)}
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <p>Node actions</p>
          {nodeActions && nodeActions.map((nodeAction: any) => {
            nodeTypes[nodeAction.name]=function temp(){
              return (
                <ReactFlowNode data={nodeAction}/>
              )
            }()

            return (
              <div draggable
                style={{
                  padding: '10px',
                  border: '2px solid #2196F3',
                  borderRadius: '5px',
                  background: '#E3F2FD',
                  textAlign: 'center',
                  minWidth: '120px',
                }} 
                key={nodeAction._id}
                onDragStart={onDragStart(nodeAction)}
                >  
                <strong>{nodeAction.name}</strong>
                <p style={{ fontSize: '12px', color: '#555' }}>Node action</p>
                <div>
                  {JSON.stringify(nodeAction)}
                </div>
                <Handle type="source" id="right" position={Position.Right} style={{ background: '#4CAF50' }} />
              </div>
            )
          })}
        </div>

        <div>
          <p>Tool Forms</p>

          {toolForms && toolForms.map((toolForm: any) => {

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
                <strong>{toolForm.name}</strong>
                <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
                <div>
                  {JSON.stringify(toolForm)}
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <p>All credentials</p>

          {credentialForms && credentialForms.map((credentialForm: any) => {
            return (
              <div
                style={{
                  padding: '10px',
                  border: '2px solid #2196F3',
                  borderRadius: '5px',
                  background: '#E3F2FD',
                  textAlign: 'center',
                  minWidth: '120px',
                }} key={credentialForm._id}>
                <strong>{credentialForm.name}</strong>
                <p style={{ fontSize: '12px', color: '#555' }}>All Credentials</p>
                <div>
                  {JSON.stringify(credentialForms)}
                </div>
              </div>
            )
          })}
        </div>



        <div>
          <p>User credentials</p>

          {userCredentials && userCredentials.map((credentialForm: any) => {
            return (
              <div
                style={{
                  padding: '10px',
                  border: '2px solid #2196F3',
                  borderRadius: '5px',
                  background: '#E3F2FD',
                  textAlign: 'center',
                  minWidth: '120px',
                }} key={credentialForm._id}>
                <strong>{credentialForm.name}</strong>
                <p style={{ fontSize: '12px', color: '#555' }}>User credentials</p>
                <div>
                  {JSON.stringify(credentialForm)}
                </div>
              </div>
            )
          })}
        </div> */}


// function WebHookNode({ data }) {
//   return (
//     <div style={{
//       padding: '10px',
//       border: '2px solid #4CAF50',
//       borderRadius: '5px',
//       background: '#E8F5E9',
//       textAlign: 'center',
//       minWidth: '120px',
//     }}>
//       <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} />
//       <strong>{data.label}</strong>
//       <p style={{ fontSize: '12px', color: '#555' }}>Webhook Node</p>
//       <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} />
//     </div>
//   )
// }

// function AINode({ data }) {
//   return (
//     <div style={{
//       padding: '10px',
//       border: '2px solid #2196F3',
//       borderRadius: '5px',
//       background: '#E3F2FD',
//       textAlign: 'center',
//       minWidth: '120px',
//     }}>
//       <Handle type="target" id="target" position={Position.Left} style={{ background: '#4CAF50' }} />
//       <strong>{data.label}</strong>
//       <p style={{ fontSize: '12px', color: '#555' }}>AI Node</p>
//       <p>Prompt: {data.prompt || 'Not set'}</p>
//       <Handle type="source" id="source" position={Position.Right} style={{ background: '#4CAF50' }} />
//     </div>
//   )
// }