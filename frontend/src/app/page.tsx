'use client';
import { useState, useCallback, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls, Position, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
export default function Home() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [cnt,setCnt]=useState(4)
  const reactFlowWrapper = useRef(null); 
  const [reactFlowInstance, setReactFlowInstance] = useState(null); 
  console.log('nodes initially : ', nodes);
  console.log('edges initially : ', edges);

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

  return (

    <div style={{ width: '100vw', height: '100vh' }}>
      <div
        style={{
          width: '200px',
          background: '#f0f0f0',
          padding: '10px',
          borderRight: '1px solid #ccc',
        }}
      >
        <h3>Add Nodes</h3>
        <div
          draggable
          onDragStart={onDragStart}
          style={{
            padding: '10px',
            margin: '5px',
            background: '#4CAF50',
            color: 'white',
            textAlign: 'center',
            cursor: 'grab',
          }}
        >
          Webhook Node
        </div>
      </div>
      <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
    </div>
  );
}