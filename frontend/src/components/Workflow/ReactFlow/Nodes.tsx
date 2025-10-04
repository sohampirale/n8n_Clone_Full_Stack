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


export function Trigger_telegram_on_message({data}:{data:any}){
    return (
      <>
        Trigger_telegram_on_message component
      </>
    )
}



//Different wrappers for TriggerActions


// Common styles for all triggers
const baseTriggerStyles = {
  container: {
    padding: '16px',
    border: '2px solid #8B5CF6',
    borderRadius: '8px',
    background: '#F3E8FF',
    textAlign: 'center' as const,
    width: '180px',
    position: 'relative' as const,
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain' as const,
  },
  content: {
    pointerEvents: 'none' as const,
  },
  title: {
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
    color: '#7C3AED',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '12px',
    color: '#6D28D9',
    margin: 0,
    opacity: 0.8,
  },
  handle: {
    background: '#8B5CF6',
    width: '12px',
    height: '12px',
    border: '2px solid #fff',
  },
};

// Generic Trigger Component (can be used for any trigger)
interface TriggerNodeProps {
  data: {
    name: string;
    icon?: string;
    label?: string;
  };
}

export function GenericTriggerNode({ data }: TriggerNodeProps) {
  return (
    <div style={baseTriggerStyles.container}>
      <div style={baseTriggerStyles.content}>
        {data.icon && (
          <div style={baseTriggerStyles.iconWrapper}>
            <img 
              src={data.icon} 
              alt={data.label || data.name}
              style={baseTriggerStyles.icon}
            />
          </div>
        )}
        <strong style={baseTriggerStyles.title}>
          {data.label || data.name}
        </strong>
        <p style={baseTriggerStyles.subtitle}>
          Trigger
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseTriggerStyles.handle}
      />
    </div>
  );
}

// Webhook Trigger Component
export function WebhookTriggerNode({ data }: TriggerNodeProps) {
  return (
    <div style={baseTriggerStyles.container}>
      <div style={baseTriggerStyles.content}>
        <div style={baseTriggerStyles.iconWrapper}>
          <img 
            src="https://www.svix.com/resources/assets/images/color-webhook-240-1deccb0e365ff4ea493396ad28638fb7.png"
            alt="Webhook"
            style={baseTriggerStyles.icon}
          />
        </div>
        <strong style={baseTriggerStyles.title}>
          Webhook
        </strong>
        <p style={baseTriggerStyles.subtitle}>
          Trigger
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseTriggerStyles.handle}
      />
    </div>
  );
}

// Manual Click Trigger Component
export function ManualClickTriggerNode({ data }: TriggerNodeProps) {
  return (
    <div style={{
      ...baseTriggerStyles.container,
      border: '2px solid #10B981',
      background: '#D1FAE5',
    }}>
      <div style={baseTriggerStyles.content}>
        <div style={baseTriggerStyles.iconWrapper}>
          <img 
            src="https://media.gettyimages.com/id/1974389824/vector/hand-cursor-click-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=Vds_aGP00pVqkX58Ye5WmgsepMHj6JH_8VJziB2t3YI="
            alt="Manual Click"
            style={baseTriggerStyles.icon}
          />
        </div>
        <strong style={{
          ...baseTriggerStyles.title,
          color: '#059669',
        }}>
          Manual Click
        </strong>
        <p style={{
          ...baseTriggerStyles.subtitle,
          color: '#047857',
        }}>
          Trigger
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          ...baseTriggerStyles.handle,
          background: '#10B981',
        }}
      />
    </div>
  );
}

// Telegram On Message Trigger Component
export function TelegramOnMessageTriggerNode({ data }: TriggerNodeProps) {
  return (
    <div style={{
      ...baseTriggerStyles.container,
      border: '2px solid #0088CC',
      background: '#E0F2FE',
    }}>
      <div style={baseTriggerStyles.content}>
        <div style={baseTriggerStyles.iconWrapper}>
          <img 
            src="https://imgs.search.brave.com/WFAdu672ZAB4qo1sO_7AQzLzk2NDM2NTcucG5nP3NlbXQ9YWlzX3doaXRlX2xhYmVs"
            alt="Telegram"
            style={baseTriggerStyles.icon}
          />
        </div>
        <strong style={{
          ...baseTriggerStyles.title,
          color: '#0088CC',
        }}>
          Telegram Message
        </strong>
        <p style={{
          ...baseTriggerStyles.subtitle,
          color: '#0369A1',
        }}>
          Trigger
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={{
          ...baseTriggerStyles.handle,
          background: '#0088CC',
        }}
      />
    </div>
  );
}

// Factory function to create the appropriate trigger component
export function createTriggerNode(triggerType: string) {
  switch (triggerType) {
    case 'trigger:webhook':
      return WebhookTriggerNode;
    case 'trigger:manual_click':
      return ManualClickTriggerNode;
    case 'trigger:telegram_on_message':
      return TelegramMessageTriggerNode;
    default:
      return GenericTriggerNode;
  }
}

// Helper function to get node types for ReactFlow
export function getTriggerNodeTypes() {
  return {
    'trigger:webhook': WebhookTriggerNode,
    'trigger:manual_click': ManualClickTriggerNode,
    'trigger:telegram_on_message': TelegramMessageTriggerNode,
    'trigger:generic': GenericTriggerNode,
  };
}

// Usage example:
/*


import { getTriggerNodeTypes } from './TriggerComponents';

const nodeTypes = getTriggerNodeTypes();

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  ...
/>

// When creating nodes:
const newNode = {
  id: 'node-1',
  type: 'trigger:webhook', // matches the trigger name from backend
  position: { x: 100, y: 100 },
  data: {
    name: 'trigger:webhook',
    icon: 'https://...',
    label: 'Webhook Trigger'
  }
};
*/



//Wrapper for all node actions


// Common styles for all node actions
const baseNodeStyles = {
  container: {
    padding: '16px',
    border: '2px solid #3B82F6',
    borderRadius: '8px',
    background: '#EFF6FF',
    textAlign: 'center' as const,
    width: '180px',
    position: 'relative' as const,
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain' as const,
    borderRadius: '4px',
  },
  content: {
    pointerEvents: 'none' as const,
  },
  title: {
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
    color: '#1E40AF',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0,
    opacity: 0.8,
  },
  handleLeft: {
    background: '#10B981',
    width: '12px',
    height: '12px',
    border: '2px solid #fff',
  },
  handleRight: {
    background: '#10B981',
    width: '12px',
    height: '12px',
    border: '2px solid #fff',
  },
};

// Generic Node Action Component
interface NodeActionProps {
  data: {
    name: string;
    icon?: string;
    label?: string;
  };
}

export function GenericActionNode({ data }: NodeActionProps) {
  return (
    <div style={baseNodeStyles.container}>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={baseNodeStyles.handleLeft}
      />
      
      <div style={baseNodeStyles.content}>
        {data.icon && (
          <div style={baseNodeStyles.iconWrapper}>
            <img 
              src={data.icon} 
              alt={data.label || data.name}
              style={baseNodeStyles.icon}
            />
          </div>
        )}
        <strong style={baseNodeStyles.title}>
          {data.label || data.name}
        </strong>
        <p style={baseNodeStyles.subtitle}>
          Action
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseNodeStyles.handleRight}
      />
    </div>
  );
}

// Telegram Send Message Node
export function TelegramSendMessageNode({ data }: NodeActionProps) {
  return (
    <div style={{
      ...baseNodeStyles.container,
      border: '2px solid #0088CC',
      background: '#E0F2FE',
    }}>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={baseNodeStyles.handleLeft}
      />
      
      <div style={baseNodeStyles.content}>
        <div style={baseNodeStyles.iconWrapper}>
          <img 
            src="https://i.pinimg.com/736x/29/52/b7/2952b7f67446895f8f11c3afacc89edc.jpg"
            alt="Telegram"
            style={baseNodeStyles.icon}
          />
        </div>
        <strong style={{
          ...baseNodeStyles.title,
          color: '#0369A1',
        }}>
          Send Message
        </strong>
        <p style={{
          ...baseNodeStyles.subtitle,
          color: '#0088CC',
        }}>
          Telegram
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseNodeStyles.handleRight}
      />
    </div>
  );
}

// Gmail Send Email Node
export function GmailSendEmailNode({ data }: NodeActionProps) {
  return (
    <div style={{
      ...baseNodeStyles.container,
      border: '2px solid #EA4335',
      background: '#FEE2E2',
    }}>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={baseNodeStyles.handleLeft}
      />
      
      <div style={baseNodeStyles.content}>
        <div style={baseNodeStyles.iconWrapper}>
          <img 
            src="https://imgs.search.brave.com/VUh26_a7IUB9j8lXGp_pRpdmUtdWktdXgtcHJvamVjdHMtTUFHWEY3bEZtZWsucG5n"
            alt="Gmail"
            style={baseNodeStyles.icon}
          />
        </div>
        <strong style={{
          ...baseNodeStyles.title,
          color: '#991B1B',
        }}>
          Send Email
        </strong>
        <p style={{
          ...baseNodeStyles.subtitle,
          color: '#DC2626',
        }}>
          Gmail
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseNodeStyles.handleRight}
      />
    </div>
  );
}

// AI Node Component
export function AIActionNode({ data }: NodeActionProps) {
  return (
    <div style={{
      ...baseNodeStyles.container,
      border: '2px solid #8B5CF6',
      background: '#F3E8FF',
    }}>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={baseNodeStyles.handleLeft}
      />
      
      <div style={baseNodeStyles.content}>
        <div style={baseNodeStyles.iconWrapper}>
          <img 
            src="https://imgs.search.brave.com/KkurEJTTp02R4mtOWY22aS1yb2JvdC0zLTEwODkzODAucG5nP2Y9d2VicCZ3PTEyOA"
            alt="AI Node"
            style={baseNodeStyles.icon}
          />
        </div>
        <strong style={{
          ...baseNodeStyles.title,
          color: '#6B21A8',
        }}>
          AI Node
        </strong>
        <p style={{
          ...baseNodeStyles.subtitle,
          color: '#7C3AED',
        }}>
          AI Processing
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseNodeStyles.handleRight}
      />
    </div>
  );
}

// Telegram Send & Wait Node
export function TelegramSendAndWaitNode({ data }: NodeActionProps) {
  return (
    <div style={{
      ...baseNodeStyles.container,
      border: '2px solid #0088CC',
      background: '#DBEAFE',
      minHeight: '80px',
    }}>
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={baseNodeStyles.handleLeft}
      />
      
      <div style={baseNodeStyles.content}>
        <div style={baseNodeStyles.iconWrapper}>
          <img 
            src="https://lh3.googleusercontent.com/rd-gg-dl/AJfQ9KRbpgyh0qKLOgYrCT8lNFk9FN6SLcBrBNsTekzf_dkb_S=s1024"
            alt="Telegram Wait"
            style={baseNodeStyles.icon}
          />
        </div>
        <strong style={{
          ...baseNodeStyles.title,
          color: '#0369A1',
          fontSize: '13px',
        }}>
          Send & Wait
        </strong>
        <p style={{
          ...baseNodeStyles.subtitle,
          color: '#0088CC',
        }}>
          Telegram
        </p>
      </div>
      
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={baseNodeStyles.handleRight}
      />
    </div>
  );
}

// Factory function to create the appropriate action node component
export function createActionNode(actionType: string) {
  switch (actionType) {
    case 'telegram_send_message':
      return TelegramSendMessageNode;
    case 'gmail_send_email':
      return GmailSendEmailNode;
    case 'aiNode':
      return AIActionNode;
    case 'telegram_send_message_and_wait_for_response':
      return TelegramSendAndWaitNode;
    default:
      return GenericActionNode;
  }
}

// Helper function to get node types for ReactFlow
export function getActionNodeTypes() {
  return {
    'telegram_send_message': TelegramSendMessageNode,
    'gmail_send_email': GmailSendEmailNode,
    'aiNode': AIActionNode,
    'telegram_send_message_and_wait_for_response': TelegramSendAndWaitNode,
    'action:generic': GenericActionNode,
  };
}

// Combine with trigger node types
// export function getAllNodeTypes() {
//   // Import trigger types if in separate file
//   // import { getTriggerNodeTypes } from './TriggerComponents';
  
//   return {
//     // Triggers
//     'trigger:webhook': WebhookTriggerNode, // Import these
//     'trigger:manual_click': ManualClickTriggerNode,
//     'trigger:telegram_on_message': TelegramMessageTriggerNode,
    
//     // Actions
//     'telegram_send_message': TelegramSendMessageNode,
//     'gmail_send_email': GmailSendEmailNode,
//     'aiNode': AIActionNode,
//     'telegram_send_message_and_wait_for_response': TelegramSendAndWaitNode,
//     'action:generic': GenericActionNode,
//   };
// }

// Usage example:
/*
import { getActionNodeTypes } from './ActionNodeComponents';

const nodeTypes = getActionNodeTypes();

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  ...
/>

// When creating nodes:
const newNode = {
  id: 'node-1',
  type: 'telegram_send_message', // matches the action name from backend
  position: { x: 100, y: 100 },
  data: {
    name: 'telegram_send_message',
    icon: 'https://...',
    label: 'Send Telegram Message'
  }
};
*/