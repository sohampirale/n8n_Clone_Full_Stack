import { Handle, Position } from "@xyflow/react";

// export function ReactFlowNode({ data }: { data: any }) {
//   return (
//     <>
//       <div
//         draggable
//         style={{
//           padding: "8px",
//           border: "2px solid #2196F3",
//           borderRadius: "5px",
//           background: "#E3F2FD",
//           textAlign: "center",
//           width: "200px",   // fixed smaller width
//           position: "relative",
//         }}
//       >
//         <Handle
//           type="target"
//           id="left"
//           position={Position.Left}
//           style={{ background: "#4CAF50", width: 10, height: 10, borderRadius: "50%", zIndex: 10 }}
//         />        <strong>{data.name}</strong>
//         <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
//         <Handle
//           type="source"
//           id="right"
//           position={Position.Right}
//           style={{ background: "#4CAF50", width: 10, height: 10, borderRadius: "50%", zIndex: 10 }}
//         />        <div>
//           {/* {JSON.stringify(data)} */}
//         </div>
//       </div>
//     </>
//   )
// }

export function ReactFlowNode({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #2196F3",
        borderRadius: "8px",
        background: "#E3F2FD",
        textAlign: "center",
        width: "200px",
        position: "relative",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Target handle on the left */}
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={{
          background: "#4CAF50",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
      
      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#555", 
          margin: 0,
          opacity: 0.8 
        }}>
          Tool Form
        </p>
      </div>

      {/* Source handle on the right */}
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          background: "#4CAF50",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
    </div>
  );
}


export function ReactFlowAINode({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #FF6B35",
        borderRadius: "8px",
        background: "#FFF3E0",
        textAlign: "center",
        width: "200px",
        position: "relative",
        minHeight: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Target handle on the left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "#FF6B35",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />

      {/* Source handle on top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          background: "#FF6B35",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />

      {/* Source handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: "#FF6B35",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
      
      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ 
          fontSize: "14px", 
          display: "block", 
          marginBottom: "4px",
          color: "#D84315"
        }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#BF360C", 
          margin: 0,
          opacity: 0.8 
        }}>
          AI Agent
        </p>
      </div>

      {/* Source handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: "#FF6B35",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
    </div>
  );
}

// export function ReactFlowAINode({ data }: { data: any }) {
//   return (
//     <>
//       <div draggable
//         style={{
//           padding: '10px',
//           border: '2px solid #2196F3',
//           borderRadius: '5px',
//           background: '#E3F2FD',
//           textAlign: 'center',
//           minWidth: '120px',
//         }} key={data._id}>
//         <Handle type="target" id="left" position={Position.Left} style={{ background: '#4CAF50' }} />
//         <Handle type="source" id="top" position={Position.Top} style={{ background: '#4CAF50' }} />
//         <Handle type="source" id="bottom" position={Position.Bottom} style={{ background: '#4CAF50' }} />
//         <strong>{data.name}</strong>
//         <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
//         <Handle type="source" id="right" position={Position.Right} style={{ background: '#4CAF50' }} />
//         <div>
//           {JSON.stringify(data)}
//         </div>
//       </div>
//     </>
//   )
// }

export function ReactFlowTriggerNode({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #FF6B35",
        borderRadius: "8px",
        background: "#FFF3E0",
        textAlign: "center",
        width: "200px",
        position: "relative",
        minHeight: "80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >


      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ 
          fontSize: "14px", 
          display: "block", 
          marginBottom: "4px",
          color: "#D84315"
        }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#BF360C", 
          margin: 0,
          opacity: 0.8 
        }}>
          AI Agent
        </p>
      </div>

      {/* Source handle on the right */}
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          background: "#FF6B35",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
    </div>
  );
}