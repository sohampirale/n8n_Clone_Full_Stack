'use client';
import '@xyflow/react/dist/style.css';
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Position, Handle, ReactFlowProvider, NodeTypes } from '@xyflow/react';
import { axiosInstance } from "@/helpers/axios";
import { ReactFlowNode, ReactFlowAINode, ReactFlowTriggerNode, ReactFlowLLM, ReactFlowTool } from './ReactFlow/Nodes';

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
      if (nodeAction.type == 'node') {
        types[nodeAction.name] = function NodeComponent(props) {
          return <ReactFlowNode data={nodeAction} />;
        }
      } else if (nodeAction.type == 'aiNode') {
        types[nodeAction.name] = function NodeComponent(props) {
          return <ReactFlowAINode data={nodeAction} />;
        }
      }
    });


    triggerActions.forEach(triggerAction => {
      types[triggerAction.name] = function NodeComponent(props) {
        return <ReactFlowTriggerNode data={triggerAction} />;
      }
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
    fetchAllToolForms()
    // fetchAllUserCredentials()
    fetchAllCredentialForms()

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
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '8px',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setWorkflowInfoExpanded(!workflowInfoExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #5a6268 0%, #495057 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>📊</span>
              Workflow Info
            </div>
            <span style={{
              transform: workflowInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>

          {workflowInfoExpanded && (
            <div style={{ padding: '16px', background: '#ffffff' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#495057', fontSize: '14px' }}>Workflow Object</h4>
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#6c757d',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(workflow, null, 2)}
              </div>

              <h4 style={{ margin: '16px 0 8px 0', color: '#495057', fontSize: '14px' }}>Node Types</h4>
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '11px',
                fontFamily: 'monospace',
                color: '#6c757d',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                {JSON.stringify(nodeTypes, null, 2)}
              </div>
            </div>
          )}
        </div>

        {/* Node Actions Section */}
        <div style={{
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setNodeActionsExpanded(!nodeActionsExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>⚙️</span>
              Node Actions ({nodeActions?.length || 0})
            </div>
            <span style={{
              transform: nodeActionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>

          {nodeActionsExpanded && (
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
              }}>
                {nodeActions && nodeActions.map((nodeAction: any) => {
                  if (nodeAction.type == 'aiNode') {
                    return (
                      <div draggable
                        style={{
                          padding: '16px',
                          border: '2px solid #2196F3',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #E3F2FD 0%, #f5f9ff 100%)',
                          textAlign: 'center',
                          minWidth: '180px',
                          cursor: 'grab',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)'
                        }}
                        key={nodeAction._id}
                        onDragStart={onDragStart(nodeAction, 'aiNode')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(33, 150, 243, 0.1)';
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🤖</div>
                        <strong style={{ color: '#1565c0', fontSize: '14px' }}>{nodeAction.name}</strong>
                        <p style={{ fontSize: '12px', color: '#757575', margin: '4px 0 8px 0' }}>AI Node Action</p>
                        <details style={{ textAlign: 'left', marginTop: '8px' }}>
                          <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#666' }}>Details</summary>
                          <div style={{
                            fontSize: '10px',
                            color: '#666',
                            background: '#fff',
                            padding: '8px',
                            borderRadius: '4px',
                            marginTop: '4px',
                            fontFamily: 'monospace',
                            maxHeight: '100px',
                            overflowY: 'auto'
                          }}>
                            {JSON.stringify(nodeAction, null, 2)}
                          </div>
                        </details>
                      </div>
                    )
                  } else if (nodeAction.type == 'node') {
                    return (
                      <div draggable
                        style={{
                          padding: '16px',
                          border: '2px solid #4caf50',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)',
                          textAlign: 'center',
                          minWidth: '180px',
                          cursor: 'grab',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)'
                        }}
                        key={nodeAction._id}
                        onDragStart={onDragStart(nodeAction, 'node')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(76, 175, 80, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(76, 175, 80, 0.1)';
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚡</div>
                        <strong style={{ color: '#2e7d32', fontSize: '14px' }}>{nodeAction.name}</strong>
                        <p style={{ fontSize: '12px', color: '#757575', margin: '4px 0 8px 0' }}>Node Action</p>
                        <details style={{ textAlign: 'left', marginTop: '8px' }}>
                          <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#666' }}>Details</summary>
                          <div style={{
                            fontSize: '10px',
                            color: '#666',
                            background: '#fff',
                            padding: '8px',
                            borderRadius: '4px',
                            marginTop: '4px',
                            fontFamily: 'monospace',
                            maxHeight: '100px',
                            overflowY: 'auto'
                          }}>
                            {JSON.stringify(nodeAction, null, 2)}
                          </div>
                        </details>
                      </div>
                    )
                  } else {
                    return (
                      <div key={nodeAction._id} style={{
                        padding: '16px',
                        border: '2px solid #f44336',
                        borderRadius: '8px',
                        background: '#ffebee',
                        textAlign: 'center',
                        color: '#c62828'
                      }}>
                        <p style={{ margin: 0 }}>⚠️ Invalid node action type</p>
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )}
        </div>

        {/* Trigger Actions Section */}
        <div style={{
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setTriggerActionsExpanded(!triggerActionsExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🎯</span>
              Trigger Actions ({triggerActions?.length || 0})
            </div>
            <span style={{
              transform: triggerActionsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>

          {triggerActionsExpanded && (
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
              }}>
                {triggerActions?.map((triggerAction) => (
                  <div
                    key={triggerAction._id}
                    draggable
                    style={{
                      padding: '16px',
                      border: '2px solid #ff9800',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #fff3e0 0%, #fef7ed 100%)',
                      textAlign: 'center',
                      minWidth: '180px',
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(255, 152, 0, 0.1)'
                    }}
                    onDragStart={onDragStart(triggerAction, 'trigger')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.1)';
                    }}
                  >
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                    <strong style={{ color: '#e65100', fontSize: '14px' }}>{triggerAction.name}</strong>
                    <p style={{ fontSize: '12px', color: '#757575', margin: '4px 0 8px 0' }}>
                      Trigger Action
                    </p>
                    <details style={{ textAlign: 'left', marginTop: '8px' }}>
                      <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#666' }}>Details</summary>
                      <div style={{
                        fontSize: '10px',
                        color: '#666',
                        background: '#fff',
                        padding: '8px',
                        borderRadius: '4px',
                        marginTop: '4px',
                        fontFamily: 'monospace',
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
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setLlmsExpanded(!llmsExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #7b1fa2 0%, #6a1b9a 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🧠</span>
              LLMs for AI Node ({credentialForms?.filter(c => c.type === 'llm').length || 0})
            </div>
            <span style={{
              transform: llmsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>

          {llmsExpanded && (
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
              }}>
                {credentialForms && credentialForms?.map((credentialForm) => {
                  if (credentialForm.type == 'llm') {
                    return (
                      <div
                        key={credentialForm._id}
                        draggable
                        style={{
                          padding: '16px',
                          border: '2px solid #9c27b0',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #f3e5f5 0%, #faf5ff 100%)',
                          textAlign: 'center',
                          minWidth: '180px',
                          cursor: 'grab',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.1)'
                        }}
                        onDragStart={onDragStart(credentialForm, 'llm')}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(156, 39, 176, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(156, 39, 176, 0.1)';
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧠</div>
                        <strong style={{ color: '#6a1b9a', fontSize: '14px' }}>{credentialForm.name}</strong>
                        <p style={{ fontSize: '12px', color: '#757575', margin: '4px 0 8px 0' }}>
                          LLM
                        </p>
                        <details style={{ textAlign: 'left', marginTop: '8px' }}>
                          <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#666' }}>Details</summary>
                          <div style={{
                            fontSize: '10px',
                            color: '#666',
                            background: '#fff',
                            padding: '8px',
                            borderRadius: '4px',
                            marginTop: '4px',
                            fontFamily: 'monospace',
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
          background: '#fff',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          marginBottom: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => setToolsExpanded(!toolsExpanded)}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #009688 0%, #00695c 100%)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #00695c 0%, #00796b 100%)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #009688 0%, #00695c 100%)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>🛠️</span>
              Available Tools ({toolForms?.length || 0})
            </div>
            <span style={{
              transform: toolsExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>▼</span>
          </button>

          {toolsExpanded && (
            <div style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gap: '12px',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
              }}>
                {toolForms && toolForms?.map((toolForm) => {
                  return (
                    <div
                      key={toolForm._id}
                      draggable
                      style={{
                        padding: '16px',
                        border: '2px solid #009688',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #e0f2f1 0%, #f0fdf4 100%)',
                        textAlign: 'center',
                        minWidth: '180px',
                        cursor: 'grab',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0, 150, 136, 0.1)'
                      }}
                      onDragStart={onDragStart(toolForm, 'tool')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 150, 136, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 150, 136, 0.1)';
                      }}
                    >
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🛠️</div>
                      <strong style={{ color: '#00796b', fontSize: '14px' }}>{toolForm.name}</strong>
                      <p style={{ fontSize: '12px', color: '#757575', margin: '4px 0 8px 0' }}>
                        Tool
                      </p>
                      <details style={{ textAlign: 'left', marginTop: '8px' }}>
                        <summary style={{ cursor: 'pointer', fontSize: '11px', color: '#666' }}>Details</summary>
                        <div style={{
                          fontSize: '10px',
                          color: '#666',
                          background: '#fff',
                          padding: '8px',
                          borderRadius: '4px',
                          marginTop: '4px',
                          fontFamily: 'monospace',
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