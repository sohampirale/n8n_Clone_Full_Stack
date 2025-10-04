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
      return TelegramOnMessageTriggerNode;
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


interface AINodeProps {
  data: {
    name: string;
    icon?: string;
    label?: string;
  };
}

export function AIActionNode({ data }: AINodeProps) {
  return (
    <div
      style={{
        padding: '16px',
        border: '2px solid #F97316',
        borderRadius: '8px',
        background: '#FFF7ED',
        textAlign: 'center',
        width: '180px',
        position: 'relative',
        minHeight: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Target handle on the left */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#F97316',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />

      {/* Source handle on top */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{
          background: '#F97316',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />

      {/* Source handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{
          background: '#F97316',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
      />

      {/* Node content */}
      <div style={{ pointerEvents: 'none' }}>
        {data.icon && (
          <div style={{
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img 
              src={data.icon}
              alt="AI Node"
              style={{
                width: '32px',
                height: '32px',
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
          </div>
        )}
        <strong
          style={{
            fontSize: '14px',
            display: 'block',
            marginBottom: '4px',
            color: '#C2410C',
            fontWeight: 600,
          }}
        >
          {data.label || data.name}
        </strong>
        <p
          style={{
            fontSize: '12px',
            color: '#9A3412',
            margin: 0,
            opacity: 0.8,
          }}
        >
          AI Agent
        </p>
      </div>

      {/* Source handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: '#F97316',
          width: '12px',
          height: '12px',
          border: '2px solid #fff',
        }}
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

//Wrapper for ToolsForms

// Common styles for all tool forms
const baseToolStyles = {
  container: {
    padding: '16px',
    border: '2px solid #0891B2',
    borderRadius: '8px',
    background: '#F0F9FF',
    textAlign: 'center' as const,
    width: '180px',
    position: 'relative' as const,
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    color: '#0369A1',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '12px',
    color: '#0284C7',
    margin: 0,
    opacity: 0.8,
    fontWeight: '500',
  },
  handleTop: {
    background: '#0891B2',
    width: '12px',
    height: '12px',
    border: '2px solid #fff',
    borderRadius: '50%',
  },
};

// Generic Tool Form Component
interface ToolFormProps {
  data: {
    name: string;
    description?: string;
    label?: string;
  };
}

export function GenericToolFormNode({ data }: ToolFormProps) {
  return (
    <div style={baseToolStyles.container}>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={baseToolStyles.handleTop}
      />
      
      <div style={baseToolStyles.content}>
        <div style={baseToolStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#0891B2',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            🛠️
          </div>
        </div>
        <strong style={baseToolStyles.title}>
          {data.label || data.name}
        </strong>
        <p style={baseToolStyles.subtitle}>
          Tool
        </p>
      </div>
    </div>
  );
}

// Wikipedia Search Tool
export function WikipediaSearchToolNode({ data }: ToolFormProps) {
  return (
    <div style={{
      ...baseToolStyles.container,
      border: '2px solid #64748B',
      background: '#F1F5F9',
    }}>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{
          ...baseToolStyles.handleTop,
          background: '#64748B',
        }}
      />
      
      <div style={baseToolStyles.content}>
        <div style={baseToolStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#64748B',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            📚
          </div>
        </div>
        <strong style={{
          ...baseToolStyles.title,
          color: '#1E293B',
        }}>
          Wikipedia
        </strong>
        <p style={{
          ...baseToolStyles.subtitle,
          color: '#475569',
        }}>
          Search Tool
        </p>
      </div>
    </div>
  );
}

// SerpAPI Search Tool
export function SerpAPIToolNode({ data }: ToolFormProps) {
  return (
    <div style={{
      ...baseToolStyles.container,
      border: '2px solid #10B981',
      background: '#D1FAE5',
    }}>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{
          ...baseToolStyles.handleTop,
          background: '#10B981',
        }}
      />
      
      <div style={baseToolStyles.content}>
        <div style={baseToolStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#10B981',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            🔍
          </div>
        </div>
        <strong style={{
          ...baseToolStyles.title,
          color: '#065F46',
        }}>
          Web Search
        </strong>
        <p style={{
          ...baseToolStyles.subtitle,
          color: '#059669',
        }}>
          SerpAPI
        </p>
      </div>
    </div>
  );
}

// Weather Fetch Tool
export function WeatherToolNode({ data }: ToolFormProps) {
  return (
    <div style={{
      ...baseToolStyles.container,
      border: '2px solid #06B6D4',
      background: '#CFFAFE',
    }}>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{
          ...baseToolStyles.handleTop,
          background: '#06B6D4',
        }}
      />
      
      <div style={baseToolStyles.content}>
        <div style={baseToolStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#06B6D4',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            ☁️
          </div>
        </div>
        <strong style={{
          ...baseToolStyles.title,
          color: '#164E63',
        }}>
          Weather
        </strong>
        <p style={{
          ...baseToolStyles.subtitle,
          color: '#0891B2',
        }}>
          Fetch Tool
        </p>
      </div>
    </div>
  );
}

// Telegram Send & Wait Tool
export function TelegramSendWaitToolNode({ data }: ToolFormProps) {
  return (
    <div style={{
      ...baseToolStyles.container,
      border: '2px solid #0088CC',
      background: '#E0F2FE',
      minHeight: '80px',
    }}>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={{
          ...baseToolStyles.handleTop,
          background: '#0088CC',
        }}
      />
      
      <div style={baseToolStyles.content}>
        <div style={baseToolStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#0088CC',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            💬
          </div>
        </div>
        <strong style={{
          ...baseToolStyles.title,
          color: '#075985',
          fontSize: '13px',
        }}>
          Send & Wait
        </strong>
        <p style={{
          ...baseToolStyles.subtitle,
          color: '#0284C7',
        }}>
          Telegram Tool
        </p>
      </div>
    </div>
  );
}

// Factory function to create the appropriate tool component
export function createToolFormNode(toolName: string) {
  switch (toolName) {
    case 'wikipedia_search':
      return WikipediaSearchToolNode;
    case 'serpAPI':
      return SerpAPIToolNode;
    case 'fetch_weather':
      return WeatherToolNode;
    case 'telegram_send_message_and_wait_for_response':
      return TelegramSendWaitToolNode;
    default:
      return GenericToolFormNode;
  }
}

// Helper function to get tool node types for ReactFlow
export function getToolFormNodeTypes() {
  return {
    'wikipedia_search': WikipediaSearchToolNode,
    'serpAPI': SerpAPIToolNode,
    'fetch_weather': WeatherToolNode,
    'telegram_send_message_and_wait_for_response': TelegramSendWaitToolNode,
    'tool:generic': GenericToolFormNode,
  };
}

// Combined export for all node types
export function getAllNodeTypes() {
  // You would import trigger and action types here
  // import { getTriggerNodeTypes } from './TriggerComponents';
  // import { getActionNodeTypes } from './ActionNodeComponents';
  
  return {
    // Triggers (import from trigger components)
    // ...getTriggerNodeTypes(),
    
    // Actions (import from action components)
    // ...getActionNodeTypes(),
    
    // Tools
    'wikipedia_search': WikipediaSearchToolNode,
    'serpAPI': SerpAPIToolNode,
    'fetch_weather': WeatherToolNode,
    'telegram_send_message_and_wait_for_response': TelegramSendWaitToolNode,
    'tool:generic': GenericToolFormNode,
  };
}

// Usage example:
/*
import { getToolFormNodeTypes } from './ToolFormComponents';

const nodeTypes = getToolFormNodeTypes();

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  ...
/>

// When creating nodes:
const newNode = {
  id: 'tool-1',
  type: 'wikipedia_search', // matches the tool name from backend
  position: { x: 100, y: 100 },
  data: {
    name: 'wikipedia_search',
    description: 'Does wikipedia search',
    label: 'Wikipedia Search'
  }
};
*/

// Usage example:
/*
import { getToolFormNodeTypes } from './ToolFormComponents';

const nodeTypes = getToolFormNodeTypes();

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  ...
/>

// When creating nodes:
const newNode = {
  id: 'tool-1',
  type: 'wikipedia_search', // matches the tool name from backend
  position: { x: 100, y: 100 },
  data: {
    name: 'wikipedia_search',
    description: 'Does wikipedia search',
    label: 'Wikipedia Search'
  }
};
*/


const baseLLMStyles = {
  container: {
    padding: '16px',
    border: '2px solid #10B981',
    borderRadius: '8px',
    background: '#ECFDF5',
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
    borderRadius: '6px',
  },
  content: {
    pointerEvents: 'none' as const,
  },
  title: {
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
    color: '#059669',
    fontWeight: 600,
  },
  subtitle: {
    fontSize: '12px',
    color: '#047857',
    margin: 0,
    opacity: 0.8,
  },
  handleBottom: {
    background: '#10B981',
    width: '12px',
    height: '12px',
    border: '2px solid #fff',
  },
};

// Generic LLM Node Component
interface LLMNodeProps {
  data: {
    name: string;
    label?: string;
    requiredFields?: Array<any>;
  };
}

export function GenericLLMNode({ data }: LLMNodeProps) {
  return (
    <div style={baseLLMStyles.container}>
      {/* Target handle on the bottom */}
      <Handle
        type="target"
        id="bottom"
        position={Position.Bottom}
        style={baseLLMStyles.handleBottom}
      />
      
      <div style={baseLLMStyles.content}>
        <div style={baseLLMStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#10B981',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            🤖
          </div>
        </div>
        <strong style={baseLLMStyles.title}>
          {data.label || data.name}
        </strong>
        <p style={baseLLMStyles.subtitle}>
          LLM Model
        </p>
      </div>
    </div>
  );
}

// Cohere LLM Node
export function CohereLLMNode({ data }: LLMNodeProps) {
  return (
    <div style={{
      ...baseLLMStyles.container,
      border: '2px solid #D946EF',
      background: '#FAE8FF',
    }}>
      {/* Target handle on the bottom */}
      <Handle
        type="target"
        id="bottom"
        position={Position.Bottom}
        style={{
          ...baseLLMStyles.handleBottom,
          background: '#D946EF',
        }}
      />
      
      <div style={baseLLMStyles.content}>
        <div style={baseLLMStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #D946EF 0%, #9333EA 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#fff',
          }}>
            CO
          </div>
        </div>
        <strong style={{
          ...baseLLMStyles.title,
          color: '#86198F',
        }}>
          Cohere
        </strong>
        <p style={{
          ...baseLLMStyles.subtitle,
          color: '#A855F7',
        }}>
          LLM Model
        </p>
      </div>
    </div>
  );
}

// Gemini LLM Node
export function GeminiLLMNode({ data }: LLMNodeProps) {
  return (
    <div style={{
      ...baseLLMStyles.container,
      border: '2px solid #3B82F6',
      background: '#DBEAFE',
    }}>
      {/* Target handle on the bottom */}
      <Handle
        type="target"
        id="bottom"
        position={Position.Bottom}
        style={{
          ...baseLLMStyles.handleBottom,
          background: '#3B82F6',
        }}
      />
      
      <div style={baseLLMStyles.content}>
        <div style={baseLLMStyles.iconWrapper}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#fff',
          }}>
            ✨
          </div>
        </div>
        <strong style={{
          ...baseLLMStyles.title,
          color: '#1E40AF',
        }}>
          Gemini
        </strong>
        <p style={{
          ...baseLLMStyles.subtitle,
          color: '#3B82F6',
        }}>
          LLM Model
        </p>
      </div>
    </div>
  );
}

// Factory function to create the appropriate LLM node component
export function createLLMNode(credentialName: string) {
  switch (credentialName) {
    case 'cohere':
      return CohereLLMNode;
    case 'gemini':
      return GeminiLLMNode;
    default:
      return GenericLLMNode;
  }
}

// Helper function to get LLM node types for ReactFlow
export function getLLMNodeTypes() {
  return {
    'cohere': CohereLLMNode,
    'gemini': GeminiLLMNode,
    'llm:generic': GenericLLMNode,
  };
}

// Filter function to extract only LLM credentials from your credential forms
export function filterLLMCredentials(credentials: Array<any>) {
  const llmNames = ['cohere', 'gemini'];
  return credentials.filter(cred => llmNames.includes(cred.name));
}

// Usage example:
/*
import { getLLMNodeTypes, filterLLMCredentials } from './LLMNodeComponents';

// Filter only LLM credentials from your backend data
const allCredentials = [
  { name: 'telegram', ... },
  { name: 'gmail', ... },
  { name: 'cohere', ... },
  { name: 'gemini', ... }
];

const llmCredentials = filterLLMCredentials(allCredentials);
// Returns: [{ name: 'cohere', ... }, { name: 'gemini', ... }]

const nodeTypes = getLLMNodeTypes();

<ReactFlow
  nodes={nodes}
  edges={edges}
  nodeTypes={nodeTypes}
  ...
/>

// When creating LLM nodes:
const newNode = {
  id: 'llm-1',
  type: 'cohere', // or 'gemini'
  position: { x: 100, y: 100 },
  data: {
    name: 'cohere',
    label: 'Cohere LLM',
    requiredFields: [...]
  }
};
*/
