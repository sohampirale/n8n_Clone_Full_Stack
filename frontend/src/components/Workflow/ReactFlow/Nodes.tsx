// import { Handle, Position } from "@xyflow/react";

// // export function ReactFlowNode({ data }: { data: any }) {
// //   return (
// //     <>
// //       <div
// //         draggable
// //         style={{
// //           padding: "8px",
// //           border: "2px solid #2196F3",
// //           borderRadius: "5px",
// //           background: "#E3F2FD",
// //           textAlign: "center",
// //           width: "200px",   // fixed smaller width
// //           position: "relative",
// //         }}
// //       >
// //         <Handle
// //           type="target"
// //           id="left"
// //           position={Position.Left}
// //           style={{ background: "#4CAF50", width: 10, height: 10, borderRadius: "50%", zIndex: 10 }}
// //         />        <strong>{data.name}</strong>
// //         <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
// //         <Handle
// //           type="source"
// //           id="right"
// //           position={Position.Right}
// //           style={{ background: "#4CAF50", width: 10, height: 10, borderRadius: "50%", zIndex: 10 }}
// //         />        <div>
// //           {/* {JSON.stringify(data)} */}
// //         </div>
// //       </div>
// //     </>
// //   )
// // }

// export function ReactFlowNode({ data }: { data: any }) {
//   return (
//     <div
//       style={{
//         padding: "16px",
//         border: "2px solid #2196F3",
//         borderRadius: "8px",
//         background: "#E3F2FD",
//         textAlign: "center",
//         width: "200px",
//         position: "relative",
//         minHeight: "60px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Target handle on the left */}
//       <Handle
//         type="target"
//         id="left"
//         position={Position.Left}
//         style={{
//           background: "#4CAF50",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
      
//       {/* Node content */}
//       <div style={{ pointerEvents: "none" }}>
//         <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
//           {data.name}
//         </strong>
//         <p style={{ 
//           fontSize: "12px", 
//           color: "#555", 
//           margin: 0,
//           opacity: 0.8 
//         }}>
//           Tool Form
//         </p>
//       </div>

//       {/* Source handle on the right */}
//       <Handle
//         type="source"
//         id="right"
//         position={Position.Right}
//         style={{
//           background: "#4CAF50",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
//     </div>
//   );
// }

// export function ReactFlowAINode({ data }: { data: any }) {
//   return (
//     <div
//       style={{
//         padding: "16px",
//         border: "2px solid #FF6B35",
//         borderRadius: "8px",
//         background: "#FFF3E0",
//         textAlign: "center",
//         width: "200px",
//         position: "relative",
//         minHeight: "80px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Target handle on the left */}
//       <Handle
//         type="target"
//         position={Position.Left}
//         style={{
//           background: "#FF6B35",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />

//       {/* Source handle on top */}
//       <Handle
//         type="source"
//         position={Position.Top}
//         id="top"
//         style={{
//           background: "#FF6B35",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />

//       {/* Source handle on bottom */}
//       <Handle
//         type="source"
//         position={Position.Bottom}
//         id="bottom"
//         style={{
//           background: "#FF6B35",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
      
//       {/* Node content */}
//       <div style={{ pointerEvents: "none" }}>
//         <strong style={{ 
//           fontSize: "14px", 
//           display: "block", 
//           marginBottom: "4px",
//           color: "#D84315"
//         }}>
//           {data.name}
//         </strong>
//         <p style={{ 
//           fontSize: "12px", 
//           color: "#BF360C", 
//           margin: 0,
//           opacity: 0.8 
//         }}>
//           AI Agent
//         </p>
//       </div>

//       {/* Source handle on the right */}
//       <Handle
//         type="source"
//         position={Position.Right}
//         id="right"
//         style={{
//           background: "#FF6B35",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
//     </div>
//   );
// }

// // export function ReactFlowAINode({ data }: { data: any }) {
// //   return (
// //     <>
// //       <div draggable
// //         style={{
// //           padding: '10px',
// //           border: '2px solid #2196F3',
// //           borderRadius: '5px',
// //           background: '#E3F2FD',
// //           textAlign: 'center',
// //           minWidth: '120px',
// //         }} key={data._id}>
// //         <Handle type="target" id="left" position={Position.Left} style={{ background: '#4CAF50' }} />
// //         <Handle type="source" id="top" position={Position.Top} style={{ background: '#4CAF50' }} />
// //         <Handle type="source" id="bottom" position={Position.Bottom} style={{ background: '#4CAF50' }} />
// //         <strong>{data.name}</strong>
// //         <p style={{ fontSize: '12px', color: '#555' }}>Tool Form</p>
// //         <Handle type="source" id="right" position={Position.Right} style={{ background: '#4CAF50' }} />
// //         <div>
// //           {JSON.stringify(data)}
// //         </div>
// //       </div>
// //     </>
// //   )
// // }

// export function ReactFlowTriggerNode({ data }: { data: any }) {
//   return (
//     <div
//       style={{
//         padding: "16px",
//         border: "2px solid #FF6B35",
//         borderRadius: "8px",
//         background: "#FFF3E0",
//         textAlign: "center",
//         width: "200px",
//         position: "relative",
//         minHeight: "80px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >


//       {/* Node content */}
//       <div style={{ pointerEvents: "none" }}>
//         <strong style={{ 
//           fontSize: "14px", 
//           display: "block", 
//           marginBottom: "4px",
//           color: "#D84315"
//         }}>
//           {data.name}
//         </strong>
//         <p style={{ 
//           fontSize: "12px", 
//           color: "#BF360C", 
//           margin: 0,
//           opacity: 0.8 
//         }}>
//           AI Agent
//         </p>
//       </div>

//       {/* Source handle on the right */}
//       <Handle
//         type="source"
//         id="right"
//         position={Position.Right}
//         style={{
//           background: "#FF6B35",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
//     </div>
//   );
// }


// export function ReactFlowLLM({ data }: { data: any }) {
//   return (
//     <div
//       style={{
//         padding: "16px",
//         border: "2px solid #2196F3",
//         borderRadius: "8px",
//         background: "#E3F2FD",
//         textAlign: "center",
//         width: "200px",
//         position: "relative",
//         minHeight: "60px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Target handle on the left */}
//       <Handle
//         type="target"
//         id="bottom"
//         position={Position.Bottom}
//         style={{
//           background: "#4CAF50",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />
      
//       {/* Node content */}
//       <div style={{ pointerEvents: "none" }}>
//         <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
//           {data.name}
//         </strong>
//         <p style={{ 
//           fontSize: "12px", 
//           color: "#555", 
//           margin: 0,
//           opacity: 0.8 
//         }}>
//           Tool Form
//         </p>
//       </div>

//     </div>
//   );
// }

import { Handle, Position } from "@xyflow/react";

export function ReactFlowNode({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #3B82F6",
        borderRadius: "8px",
        background: "#EFF6FF",
        textAlign: "center",
        width: "180px",
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
          background: "#10B981",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
      
      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#1E40AF" }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#6B7280", 
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
          background: "#10B981",
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
        border: "2px solid #F97316",
        borderRadius: "8px",
        background: "#FFF7ED",
        textAlign: "center",
        width: "180px",
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
          background: "#F97316",
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
          background: "#F97316",
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
          background: "#F97316",
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
          color: "#C2410C"
        }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#9A3412", 
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
          background: "#F97316",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
    </div>
  );
}

export function ReactFlowTriggerNode({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #8B5CF6",
        borderRadius: "8px",
        background: "#F3E8FF",
        textAlign: "center",
        width: "180px",
        position: "relative",
        minHeight: "70px",
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
          color: "#7C3AED"
        }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#6D28D9", 
          margin: 0,
          opacity: 0.8 
        }}>
          Trigger
        </p>
      </div>

      {/* Source handle on the right */}
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          background: "#8B5CF6",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
    </div>
  );
}

export function ReactFlowLLM({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #10B981",
        borderRadius: "8px",
        background: "#ECFDF5",
        textAlign: "center",
        width: "180px",
        position: "relative",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Target handle on the bottom */}
      <Handle
        type="target"
        id="bottom"
        position={Position.Bottom}
        style={{
          background: "#10B981",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
        }}
      />
      
      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#059669" }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#047857", 
          margin: 0,
          opacity: 0.8 
        }}>
          LLM Model
        </p>
      </div>
    </div>
  );
}

// export function ReactFlowTool({ data }: { data: any }) {
//   return (
//     <div
//       style={{
//         padding: "16px",
//         border: "2px solid #10B981",
//         borderRadius: "8px",
//         background: "#ECFDF5",
//         textAlign: "center",
//         width: "180px",
//         position: "relative",
//         minHeight: "60px",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {/* Target handle on the bottom */}
//       <Handle
//         type="target"
//         id="top"
//         position={Position.Top}
//         style={{
//           background: "#10B981",
//           width: "12px",
//           height: "12px",
//           border: "2px solid #fff",
//         }}
//       />   
//       {/* Node content */}
//       <div style={{ pointerEvents: "none" }}>
//         <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#059669" }}>
//           {data.name}
//         </strong>
//         <p style={{ 
//           fontSize: "12px", 
//           color: "#047857", 
//           margin: 0,
//           opacity: 0.8 
//         }}>
//           Tool
//         </p>
//       </div>
//     </div>
//   );
// }

export function ReactFlowTool({ data }: { data: any }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "2px solid #0891B2",
        borderRadius: "8px",
        background: "#F0F9FF",
        textAlign: "center",
        width: "180px",
        position: "relative",
        minHeight: "60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {/* Target handle on the top */}
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{
          background: "#0891B2",
          width: "12px",
          height: "12px",
          border: "2px solid #fff",
          borderRadius: "50%",
        }}
      />

      
      {/* Node content */}
      <div style={{ pointerEvents: "none" }}>
        <strong style={{ fontSize: "14px", display: "block", marginBottom: "4px", color: "#0369A1" }}>
          {data.name}
        </strong>
        <p style={{ 
          fontSize: "12px", 
          color: "#0284C7", 
          margin: 0,
          opacity: 0.8,
          fontWeight: "500"
        }}>
          Tool
        </p>
      </div>
    </div>
  );
}