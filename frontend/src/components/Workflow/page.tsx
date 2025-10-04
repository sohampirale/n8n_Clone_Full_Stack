'use client';
import '@xyflow/react/dist/style.css';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Position, Handle, ReactFlowProvider, NodeTypes, useStoreApi } from '@xyflow/react';
import { axiosInstance } from "@/helpers/axios";
import { ReactFlowNode, ReactFlowAINode, ReactFlowTriggerNode, ReactFlowLLM, ReactFlowTool, Trigger_telegram_on_message, WebhookTriggerNode, ManualClickTriggerNode, TelegramSendMessageNode, AIActionNode, TelegramSendAndWaitNode, GmailSendEmailNode } from './ReactFlow/Nodes';

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
  const [newWorkflowName, setNewWorkflowName] = useState(slug)
  const [triggerActions, setTriggerActions] = useState([])
  const [nodeActions, setNodeActions] = useState([])
  const [toolForms, setToolForms] = useState([])
  const [userCredentials, setUserCredentials] = useState(null)
  const [credentialForms, setCredentialForms] = useState([])

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

  const [workflowInfoExpanded, setWorkflowInfoExpanded] = useState(false);
  const [nodeActionsExpanded, setNodeActionsExpanded] = useState(false);
  const [triggerActionsExpanded, setTriggerActionsExpanded] = useState(false);
  const [llmsExpanded, setLlmsExpanded] = useState(false);
  const [toolsExpanded, setToolsExpanded] = useState(false);

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
      const nodeActionName = nodeAction?.name
      console.log('nodeActionName : ', nodeActionName);
      let func = function NodeComponent(props) {
        return <ReactFlowNode data={nodeAction} />;
      }

      if (nodeActionName == 'telegram_send_message') {
        func = function NodeComponent(props) {
          return <TelegramSendMessageNode data={nodeAction} />;
        }
      } else if (nodeActionName == 'aiNode') {
        func = function NodeComponent(props) {
          return <AIActionNode data={nodeAction} />;
        }
      } else if (nodeActionName == 'telegram_send_message_and_wait_for_response') {
        func = function NodeComponent(props) {
          return <TelegramSendAndWaitNode data={nodeAction} />;
        }
      } else if(nodeActionName=='gmail_send_email'){
        func = function NodeComponent(props) {
          return <GmailSendEmailNode data={nodeAction} />;
        }
      }

      types[nodeActionName] = func
    });


    triggerActions.forEach(triggerAction => {
      const triggerActionName = triggerAction?.name
      let func = function NodeComponent(props) {
        return <ReactFlowTriggerNode data={triggerAction} />;
      }

      if (triggerActionName == 'trigger_telegram_one_message') {
        func = function NodeComponent(props) {
          return <Trigger_telegram_on_message data={triggerAction} />;
        }
      } else if (triggerActionName == 'trigger:webhook') {
        func = function NodeComponent(props) {
          return <WebhookTriggerNode data={triggerAction} />;
        }
      } else if (triggerActionName == 'trigger:manual_click') {
        func = function NodeComponent(props) {
          return <ManualClickTriggerNode data={triggerAction} />;
        }
      }

      types[triggerActionName] = func
    });

    credentialForms.forEach(credentialForm => {
      if (credentialForm.type == 'llm') {
        types[credentialForm.name] = function NodeComponent(props) {
          return <ReactFlowLLM data={credentialForm} />;
        }
      }
    });

    toolForms.forEach(toolForm => {
      types[toolForm.name] = function NodeComponent(props) {
        return <ReactFlowTool data={toolForm} />;
      }
    });

    console.log('Generated nodeTypes:', types);
    return types;
  }, [nodeActions, triggerActions, credentialForms, toolForms]); // Dependency on nodeActions and triggerActions


  const onNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds))
  }

  const onEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds))

    setTimeout(() => {
      console.log('edges : ', edges)
    }, 2000)
  }

  function updateWorkflow(source: string, sourceRole: string, target: string, targetRole: string, sourceHandle: string, targetHandle: string) {
    console.log('inside updateWorkflow, sourceRole : ', sourceRole, ' targetRole : ', targetRole);
    try {
      if (sourceRole == 'trigger') {

        //working of source -> node might be same as souce -> aiNode
        if (targetRole == 'node' || targetRole == 'aiNode') {
          //update the triggerIdentityNo for that node in the requestedNodes in workflow
          let nodeObj = workflow.requestedNodes.filter((node) => node.identityNo == target)
          let triggerObj = (workflow.requestedTrigger?.identityNo == source) ? workflow.requestedTrigger : null;

          if (nodeObj && nodeObj.length != 0) {
            nodeObj = nodeObj[0]
          } else {
            console.log('nodeObj not found from nodes, returning');
            return false;
          }

          console.log('nodeObj : ', nodeObj);
          console.log('triggerObj : ', triggerObj);


          let existingNodeInWorkflow = workflow.requestedNodes.filter((node) => node.identityNo == nodeObj.identityNo)
          if (!existingNodeInWorkflow || existingNodeInWorkflow.length == 0) {
            console.log('nodeObj(target) does not exists in the workflow obj');
            return false;
          }

          existingNodeInWorkflow = existingNodeInWorkflow[0]
          if (existingNodeInWorkflow.prerequisiteNodesIdentityNos.includes(triggerObj.identityNo)) {
            return false;
          }

          console.log('existingNodeInWorkflow : ', existingNodeInWorkflow);
          existingNodeInWorkflow.prerequisiteNodesIdentityNos.push(triggerObj.identityNo)
          return true;


        } else return false;
      } else if (sourceRole == 'node') {
        if (targetRole == 'node' || targetRole == 'aiNode') {
          let sourceNodeObj = workflow.requestedNodes.find((node) => node.identityNo == source)
          let targetNodeObj = workflow.requestedNodes.find((node) => node.identityNo == target)

          if (!sourceNodeObj) {
            console.log('Requested source node not found in the workflow obj');
            return false;
          }

          if (!targetNodeObj) {
            console.log('Requested target node not found in the workflow obj');
            return false;
          }

          if (targetNodeObj.prerequisiteNodesIdentityNos.includes(sourceNodeObj.identityNo)) {
            return false;
          }

          targetNodeObj.prerequisiteNodesIdentityNos.push(sourceNodeObj.identityNo)
          return true
        }
      } else if (sourceRole == 'aiNode') {
        if (targetRole == 'node' || targetRole == 'aiNode') {
          //by default i am talkign about right side connection of aiNode
          const sourceAINodeWorkflow = workflow.requestedNodes?.find((node) => node.identityNo == source)
          const targetNodeWorkflow = workflow.requestedNodes?.find((node) => node.identityNo == target)

          if (!sourceAINodeWorkflow) {
            console.log('sourceAINodeWorkflow not found in the workflow object');
            return false;
          }
          if (!targetNodeWorkflow) {
            console.log('targetNodeWorkflow not found in the workflow object');
            return false;
          }

          if (targetNodeWorkflow.prerequisiteNodesIdentityNos.includes(source)) {
            console.log('Connection between these 2 nodes already exists');
            return false;
          }

          targetNodeWorkflow.prerequisiteNodesIdentityNos.push(source)
          return true;
        } else if (targetRole == 'tool') {
          const sourceAINodeWorkflow = workflow.requestedNodes?.find((node) => node.identityNo == source)
          const toolObjWorkflow = workflow.requestedTools?.find((tool) => tool.identityNo == target)

          if (!sourceAINodeWorkflow) {
            console.log('sourceAINodeWorkflow not found in the workflow object');
            return false;
          }
          if (!toolObjWorkflow) {
            console.log('tool not found in the workflow object');
            return false;
          }

          if (toolObjWorkflow.aiNodeIdentityNo == source) {
            console.log('Connection between aiNode and this tool already exists');
            return false;
          }

          toolObjWorkflow.aiNodeIdentityNo = source
          return true;
        } else if (targetRole == 'llm') {
          const sourceAINodeWorkflow = workflow.requestedNodes?.find((node) => node.identityNo == source)
          const llmObjWorkflow = workflow.requestedLLMS?.find((llm) => llm.identityNo == target)

          if (!sourceAINodeWorkflow) {
            console.log('sourceAINodeWorkflow not found in the workflow object');
            return false;
          }

          if (!llmObjWorkflow) {
            console.log('llm not found in the workflow object');
            return false;
          }

          const existingLLM = workflow.requestedLLMS.find((llm) => llm.aiNodeIdentityNo == source);
          if (existingLLM) {
            console.log('One llm connection already exists with the aiNode, delete existing llm with that aiNode to connect another');
            return false;
          }
          if (llmObjWorkflow.aiNodeIdentityNo == source) {
            console.log('Connection between aiNode and this tool already exists');
            return false;
          }

          llmObjWorkflow.aiNodeIdentityNo = source
          return true;
        }
      }

    } catch (error) {
      console.log('ERROR : updateWorkflow : ', error);
      return false;
    }
  }

  const onConnect = (params) => {
    let { source, target, sourceHandle, targetHandle } = params
    console.log('inside onConnect params : ', params)

    const { node, aiNode, llm, tool, trigger } = createdObjects
    let sourceRole, targetRole;

    //assigning sourceRole
    if (node.includes(source)) {
      console.log('source is a node');
      sourceRole = 'node'
    } else if (aiNode.includes(source)) {
      console.log('source is an aiNode');
      sourceRole = 'aiNode'
    } else if (trigger[0] == source) {
      console.log('Source is trigger');
      sourceRole = 'trigger'
    } else {
      console.log('invalid source identityType, not forming this edge');
      return;
    }

    //assinging targetRole
    if (node.includes(target)) {
      console.log('target is a node');
      targetRole = 'node'
    } else if (aiNode.includes(target)) {
      console.log('target is an aiNode!');
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
      console.log('hii');

      if (sourceHandle == 'right') {
        if (!(targetRole == 'node' || targetRole == 'aiNode')) {
          console.log('Invalid edge,aiNode cannot forward request to  : ', targetRole);
          return;
        }
      } else if (sourceHandle == 'top') {
        console.log('hey');

        if (targetRole != 'llm') {
          console.log('Invalid edge,aiNode cannot use  : ', targetRole, ' as LLM');
          return;
        }
      } else if (sourceHandle == 'bottom') {
        if (targetRole != 'tool') {
          console.log('Invalid edge,aiNode cannot use  : ', targetRole, ' as tool');
          return;
        }
      }
    }


    if (!updateWorkflow(source, sourceRole, target, targetRole, sourceHandle, targetHandle)) {
      return;
    }

    const edge = {
      id: Math.random().toString(),
      source,
      target,
      sourceHandle,
      targetHandle,
      type: 'default'
    }

    setEdges((eds) => [...eds, edge])
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

    if (instanceType == 'node' || instanceType == 'aiNode') {
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
        return;
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
    } else if (instanceType == 'tool') {
      const newToolWorkflow = {
        identityNo: id,
        toolFormId: data._id,
        toolForm: data,
        additionalDescription: "Add this later in frontend for users",
        data: {
          //add this also in future if needed
        }
      }

      workflow.requestedTools.push(newToolWorkflow)
    } else if (instanceType == 'llm') {
      const newLLMWorkflow = {
        identityNo: id,
        credentialFormId: data._id,
        credentialForm: data,
        model: 'temporary_model_name',
        data: {
          //add this also in future if needed
        }
      }

      workflow.requestedLLMS.push(newLLMWorkflow)
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
      console.log('all node actions :', response.data);

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
    fetchAllToolForms()
    // fetchAllUserCredentials()
    fetchAllCredentialForms()

  }, [])

  useEffect(() => {
    console.log('new nodeTypes ; ', nodeTypes);
  }, [nodeTypes])

  async function helperUpdateWorkflow() {
    try {
      const { data: response } = await axiosInstance.put(`api/v1/workflow/${slug}`, {
        workflow: {
          ...workflow,
          name: newWorkflowName
        }
      })
      console.log('response for updatingWorkflow : ', response);

    } catch (error) {
      console.log('Failed to update the workflow : ', error);
    }
  }

  return (
    <>
      <ReactFlowProvider>
        <button onClick={helperUpdateWorkflow}>Update workflow </button>
        {/* <div>
          <p>workflow obj</p>
          {JSON.stringify(workflow)}

          <p>nodeTypes</p>
          {JSON.stringify(nodeTypes)}

          <p>Node Actions List</p>
          <div>
            <p>Node actions</p>
            {nodeActions && nodeActions.map((nodeAction: any) => {

              if (nodeAction.type == 'aiNode') {
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
                    onDragStart={onDragStart(nodeAction, 'aiNode')}
                  >
                    <strong>{nodeAction.name}</strong>
                    <p style={{ fontSize: '12px', color: '#555' }}>Node action</p>
                    <div>
                      {JSON.stringify(nodeAction)}
                    </div>
                  </div>
                )
              } else if (nodeAction.type == 'node') {
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
              } else {
                return (<>
                  <p>Invalid node action type</p>
                </>)
              }

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

        <div>
          <p>LLM's for AI Node</p>
          {credentialForms && credentialForms?.map((credentialForm) => {
            if (credentialForm.type == 'llm') {
              return (
                <div
                  key={credentialForm._id}
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
                  onDragStart={onDragStart(credentialForm, 'llm')}
                >

                  <strong>{credentialForm.name}</strong>
                  <p style={{ fontSize: '12px', color: '#555', margin: '4px 0' }}>
                    LLM
                  </p>
                  <div style={{ fontSize: '10px', marginTop: '8px' }}>
                    {JSON.stringify(credentialForm)}
                  </div>
                </div>
              )
            }
          })}
        </div>

        <div>
          <p>Availaible Tools for AI Node</p>
          {toolForms && toolForms?.map((toolForm) => {
              return (
                <div
                  key={toolForm._id}
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
                  onDragStart={onDragStart(toolForm, 'tool')}
                >

                  <strong>{toolForm.name}</strong>
                  <p style={{ fontSize: '12px', color: '#555', margin: '4px 0' }}>
                    Tool
                  </p>
                  <div style={{ fontSize: '10px', marginTop: '8px' }}>
                    {JSON.stringify(toolForm)}
                  </div>
                </div>
              )
          })}
        </div> */}

        {/* Workflow Info Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setWorkflowInfoExpanded(!workflowInfoExpanded)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: workflowInfoExpanded ? '#f9fafb' : '#ffffff',
              color: '#374151',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              borderBottom: workflowInfoExpanded ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!workflowInfoExpanded) {
                e.currentTarget.style.background = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (!workflowInfoExpanded) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6b7280',
                marginRight: '12px'
              }}></div>
              Workflow Info
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: workflowInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {workflowInfoExpanded && (
            <div style={{ padding: '20px', background: '#ffffff' }}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '13px', fontWeight: '600' }}>Workflow Object</h4>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                  color: '#64748b',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {JSON.stringify(workflow, null, 2)}
                </div>
              </div>

              <div>
                <h4 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '13px', fontWeight: '600' }}>Node Types</h4>
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '11px',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                  color: '#64748b',
                  maxHeight: '100px',
                  overflowY: 'auto'
                }}>
                  {JSON.stringify(nodeTypes, null, 2)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Node Actions Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setNodeActionsExpanded(!nodeActionsExpanded)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: nodeActionsExpanded ? '#eff6ff' : '#ffffff',
              color: '#374151',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              borderBottom: nodeActionsExpanded ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!nodeActionsExpanded) {
                e.currentTarget.style.background = '#eff6ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!nodeActionsExpanded) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#3b82f6',
                marginRight: '12px'
              }}></div>
              Node Actions
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#e0e7ff',
                color: '#3730a3',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '12px'
              }}>
                {nodeActions?.length || 0}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: nodeActionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {nodeActionsExpanded && (
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
              }}>
                {nodeActions && nodeActions.map((nodeAction: any) => {
                  const isAINode = nodeAction.type === 'aiNode';
                  return (
                    <div draggable
                      style={{
                        padding: '16px',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        background: isAINode ? 'linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)' : 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
                        textAlign: 'center',
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      key={nodeAction._id}
                      onDragStart={onDragStart(nodeAction, isAINode ? 'aiNode' : 'node')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = isAINode ? '#3b82f6' : '#10b981';
                        e.currentTarget.style.boxShadow = `0 8px 25px ${isAINode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '18px'
                      }}>
                        {isAINode ? '🤖' : '⚡'}
                      </div>
                      <div style={{ marginBottom: '12px', paddingTop: '8px' }}>
                        <strong style={{
                          color: isAINode ? '#1e40af' : '#065f46',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          {nodeAction.name}
                        </strong>
                        <span style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          background: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          {isAINode ? 'AI Node' : 'Node'} Action
                        </span>
                      </div>
                      <details style={{ textAlign: 'left', marginTop: '8px' }}>
                        <summary style={{
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: '#6b7280',
                          fontWeight: '500',
                          padding: '4px 0'
                        }}>
                          View details
                        </summary>
                        <div style={{
                          fontSize: '10px',
                          color: '#6b7280',
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          padding: '8px',
                          borderRadius: '6px',
                          marginTop: '6px',
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                          maxHeight: '100px',
                          overflowY: 'auto'
                        }}>
                          {JSON.stringify(nodeAction, null, 2)}
                        </div>
                      </details>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Trigger Actions Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setTriggerActionsExpanded(!triggerActionsExpanded)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: triggerActionsExpanded ? '#fef3c7' : '#ffffff',
              color: '#374151',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              borderBottom: triggerActionsExpanded ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!triggerActionsExpanded) {
                e.currentTarget.style.background = '#fef3c7';
              }
            }}
            onMouseLeave={(e) => {
              if (!triggerActionsExpanded) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f59e0b',
                marginRight: '12px'
              }}></div>
              Trigger Actions
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '12px'
              }}>
                {triggerActions?.length || 0}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: triggerActionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {triggerActionsExpanded && (
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
              }}>
                {triggerActions?.map((triggerAction) => (
                  <div
                    key={triggerAction._id}
                    draggable
                    style={{
                      padding: '16px',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                      textAlign: 'center',
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onDragStart={onDragStart(triggerAction, 'trigger')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = '#f59e0b';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '18px'
                    }}>
                      🎯
                    </div>
                    <div style={{ marginBottom: '12px', paddingTop: '8px' }}>
                      <strong style={{
                        color: '#92400e',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '4px'
                      }}>
                        {triggerAction.name}
                      </strong>
                      <span style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        background: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontWeight: '500'
                      }}>
                        Trigger Action
                      </span>
                    </div>
                    <details style={{ textAlign: 'left', marginTop: '8px' }}>
                      <summary style={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: '500',
                        padding: '4px 0'
                      }}>
                        View details
                      </summary>
                      <div style={{
                        fontSize: '10px',
                        color: '#6b7280',
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        padding: '8px',
                        borderRadius: '6px',
                        marginTop: '6px',
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                        maxHeight: '100px',
                        overflowY: 'auto'
                      }}>
                        {JSON.stringify(triggerAction, null, 2)}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LLMs Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setLlmsExpanded(!llmsExpanded)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: llmsExpanded ? '#faf5ff' : '#ffffff',
              color: '#374151',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              borderBottom: llmsExpanded ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!llmsExpanded) {
                e.currentTarget.style.background = '#faf5ff';
              }
            }}
            onMouseLeave={(e) => {
              if (!llmsExpanded) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#8b5cf6',
                marginRight: '12px'
              }}></div>
              LLMs for AI Node
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#ede9fe',
                color: '#5b21b6',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '12px'
              }}>
                {credentialForms?.filter(c => c.type === 'llm').length || 0}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: llmsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {llmsExpanded && (
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
              }}>
                {credentialForms && credentialForms?.map((credentialForm) => {
                  if (credentialForm.type == 'llm') {
                    return (
                      <div
                        key={credentialForm._id}
                        draggable
                        style={{
                          padding: '16px',
                          border: '2px solid transparent',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ede9fe 0%, #faf5ff 100%)',
                          textAlign: 'center',
                          cursor: 'grab',
                          transition: 'all 0.2s ease',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onDragStart={onDragStart(credentialForm, 'llm')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.borderColor = '#8b5cf6';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          fontSize: '18px'
                        }}>
                          🧠
                        </div>
                        <div style={{ marginBottom: '12px', paddingTop: '8px' }}>
                          <strong style={{
                            color: '#5b21b6',
                            fontSize: '14px',
                            fontWeight: '600',
                            display: 'block',
                            marginBottom: '4px'
                          }}>
                            {credentialForm.name}
                          </strong>
                          <span style={{
                            fontSize: '11px',
                            color: '#6b7280',
                            background: '#ffffff',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontWeight: '500'
                          }}>
                            LLM
                          </span>
                        </div>
                        <details style={{ textAlign: 'left', marginTop: '8px' }}>
                          <summary style={{
                            cursor: 'pointer',
                            fontSize: '11px',
                            color: '#6b7280',
                            fontWeight: '500',
                            padding: '4px 0'
                          }}>
                            View details
                          </summary>
                          <div style={{
                            fontSize: '10px',
                            color: '#6b7280',
                            background: '#ffffff',
                            border: '1px solid #e5e7eb',
                            padding: '8px',
                            borderRadius: '6px',
                            marginTop: '6px',
                            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                            maxHeight: '100px',
                            overflowY: 'auto'
                          }}>
                            {JSON.stringify(credentialForm, null, 2)}
                          </div>
                        </details>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Tools Section */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          marginBottom: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setToolsExpanded(!toolsExpanded)}
            style={{
              width: '100%',
              padding: '16px 20px',
              background: toolsExpanded ? '#f0fdfa' : '#ffffff',
              color: '#374151',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '15px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              borderBottom: toolsExpanded ? '1px solid #e5e7eb' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!toolsExpanded) {
                e.currentTarget.style.background = '#f0fdfa';
              }
            }}
            onMouseLeave={(e) => {
              if (!toolsExpanded) {
                e.currentTarget.style.background = '#ffffff';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#14b8a6',
                marginRight: '12px'
              }}></div>
              Available Tools
              <span style={{
                marginLeft: '8px',
                padding: '2px 8px',
                background: '#ccfbf1',
                color: '#134e4a',
                fontSize: '12px',
                fontWeight: '600',
                borderRadius: '12px'
              }}>
                {toolForms?.length || 0}
              </span>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                transform: toolsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <path d="M6 9l6 6 6-6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {toolsExpanded && (
            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'grid',
                gap: '16px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
              }}>
                {toolForms && toolForms?.map((toolForm) => {
                  return (
                    <div
                      key={toolForm._id}
                      draggable
                      style={{
                        padding: '16px',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ccfbf1 0%, #f0fdfa 100%)',
                        textAlign: 'center',
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onDragStart={onDragStart(toolForm, 'tool')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#14b8a6';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(20, 184, 166, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '18px'
                      }}>
                        🛠️
                      </div>
                      <div style={{ marginBottom: '12px', paddingTop: '8px' }}>
                        <strong style={{
                          color: '#134e4a',
                          fontSize: '14px',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          {toolForm.name}
                        </strong>
                        <span style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          background: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: '500'
                        }}>
                          Tool
                        </span>
                      </div>
                      <details style={{ textAlign: 'left', marginTop: '8px' }}>
                        <summary style={{
                          cursor: 'pointer',
                          fontSize: '11px',
                          color: '#6b7280',
                          fontWeight: '500',
                          padding: '4px 0'
                        }}>
                          View details
                        </summary>
                        <div style={{
                          fontSize: '10px',
                          color: '#6b7280',
                          background: '#ffffff',
                          border: '1px solid #e5e7eb',
                          padding: '8px',
                          borderRadius: '6px',
                          marginTop: '6px',
                          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace',
                          maxHeight: '100px',
                          overflowY: 'auto'
                        }}>
                          {JSON.stringify(toolForm, null, 2)}
                        </div>
                      </details>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
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