import React from 'react';
import { MessageCircle, ChevronDown, Minimize2, Maximize2, X } from 'lucide-react';

interface ChatHeaderProps {
  isMaximized: boolean;
  toggleMaximize: () => void;
  toggleThreadsVisibility?: () => void;
  toggleChatVisibility: () => void;
  isOpen: boolean;
  onClose: () => void;
  showSidebar?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isMaximized,
  toggleMaximize,
  toggleThreadsVisibility,
  toggleChatVisibility,
  isOpen,
  onClose,
  showSidebar = false
}) => {
  return (
    <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <MessageCircle size={20} />
        <span>Chatbot</span>
      </div>
      <div className="flex items-center space-x-2">
        {/* Only show thread toggle button if sidebar is not visible and toggle function is provided */}
        {!showSidebar && toggleThreadsVisibility && (
          <button
            onClick={toggleThreadsVisibility}
            className="hover:bg-blue-600 p-1 rounded"
            aria-label="Toggle threads"
          >
            <ChevronDown size={20} />
          </button>
        )}
        <button
          onClick={toggleMaximize}
          className="hover:bg-blue-600 p-1 rounded"
          aria-label={isMaximized ? "Minimize" : "Maximize"}
        >
          {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        <button
          onClick={onClose}
          className="hover:bg-blue-600 p-1 rounded"
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;