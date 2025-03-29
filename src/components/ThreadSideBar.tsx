import React from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import { Thread } from '~/hooks/useChatState';

interface ThreadSidebarProps {
  threads: Thread[];
  currentThreadId: number;
  onThreadSelect: (threadId: number) => void;
  onNewThread?: () => void;
}

const ThreadSidebar: React.FC<ThreadSidebarProps> = ({ 
  threads, 
  currentThreadId, 
  onThreadSelect,
  onNewThread 
}) => {
  return (
    <div className="w-64 border-r border-gray-200 flex flex-col h-full">
      <div className="p-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-gray-700">Conversations</h2>
        {onNewThread && (
          <button 
            onClick={onNewThread}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="New conversation"
          >
            <Plus size={20} className="text-gray-600" />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-grow">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => onThreadSelect(thread.id)}
            className={`
              p-3 flex items-center gap-2 cursor-pointer
              ${currentThreadId === thread.id ? 'bg-blue-50' : 'hover:bg-gray-50'}
            `}
          >
            <MessageCircle 
              size={16} 
              className={`${currentThreadId === thread.id ? 'text-blue-500' : 'text-gray-500'}`} 
            />
            <div className="flex-grow truncate">
              <div className="font-medium text-sm text-gray-800">{thread.name}</div>
              {thread.messages.length > 0 && (
                <div className="text-xs text-gray-500 truncate">
                  {thread.messages[thread.messages.length - 1].text || '[Attachment]'}
                </div>
              )}
            </div>
            {thread.messages.length > 0 && (
              <div className="text-xs text-gray-400">
                {formatMessageTime(thread.messages[thread.messages.length - 1].id)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format timestamps
const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // This week, show day
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export default ThreadSidebar;