"use client"
import { Maximize2, Minimize2, X } from "lucide-react";
import { useEffect, useState } from "react";


export function ModalWrapper({
    showModal,
    doubleClickedNode,
    setShowModal,
    workflow,
    setWorkflow,
    nodeActions,
    triggerActions,
    toolForms,
    credentialForms,
    userCredentials,
    Modal
  }: {
    showModal: boolean;
    doubleClickedNode: any;
    setShowModal: (show: boolean) => void;
    workflow: any;
    setWorkflow: any;
    nodeActions: any;
    triggerActions: any;
    toolForms: any;
    credentialForms: any;
    userCredentials: any;
    Modal: React.ComponentType<any>;
  }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
      if (showModal && doubleClickedNode) {
        setIsVisible(true);
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
        document.body.style.overflow = 'hidden';
      } else {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [showModal, doubleClickedNode]);

    const handleClose = () => {
      setIsAnimating(false);
      setTimeout(() => setShowModal(false), 300);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    };

    if (!isVisible) return null;

    return (
      <div
        className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleBackdropClick}
      >
        {/* Enhanced backdrop with gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-slate-900/80 backdrop-blur-md transition-all duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
        />

        {/* Animated glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl transition-all duration-1000 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`} />
          <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl transition-all duration-1000 delay-100 ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`} />
        </div>

        {/* Modal container */}
        <div
          className={`relative w-full bg-white rounded-2xl shadow-2xl transform transition-all duration-300 overflow-hidden flex flex-col ${isFullscreen
              ? 'max-w-[95vw] h-[95vh]'
              : 'max-w-4xl max-h-[90vh]'
            } ${isAnimating
              ? 'scale-100 translate-y-0 opacity-100'
              : 'scale-95 translate-y-4 opacity-0'
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" />

          {/* Enhanced header */}
          <div className="relative flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.15) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }} />

            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Node Configuration</h3>
                <p className="text-xs text-gray-500">Configure your workflow node settings</p>
              </div>
            </div>

            <div className="relative flex items-center gap-2">
              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="group relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5 text-gray-600 group-hover:text-violet-700 transition-colors relative z-10" />
                ) : (
                  <Maximize2 className="w-5 h-5 text-gray-600 group-hover:text-violet-700 transition-colors relative z-10" />
                )}
              </button>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="group relative p-2.5 rounded-xl hover:bg-red-50 transition-all duration-200 hover:shadow-md"
                title="Close"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
                <X className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors relative z-10" />
              </button>
            </div>
          </div>

          {/* Scrollable content with custom scrollbar */}
          <div
            className="flex-1 overflow-y-auto overflow-x-hidden"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#a78bfa #f3f4f6'
            }}
          >
            <style>{`
            .flex-1::-webkit-scrollbar {
              width: 8px;
            }
            .flex-1::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            .flex-1::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #a78bfa, #818cf8);
              border-radius: 4px;
            }
            .flex-1::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #8b5cf6, #6366f1);
            }
          `}</style>

            <Modal
              doubleClickedNode={doubleClickedNode}
              setShowModal={setShowModal}
              workflow={workflow}
              setWorkflow={setWorkflow}
              allFetchedData={{
                nodeActions,
                triggerActions,
                toolForms,
                credentialForms,
                userCredentials
              }}
            />
          </div>

          {/* Optional footer with gradient */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Ready
              </span>
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      </div>
    );
  }