import React from 'react';
import { Thread } from '~/hooks/useChatState';

interface ThreadSelectorProps {
  threads: Thread[];
  isVisible: boolean;
  onThreadSelect: (threadId: number) => void;
}

const ThreadSelector: React.FC<ThreadSelectorProps> = ({ 
  threads, 
  isVisible, 
  onThreadSelect 
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg w-full z-20">
      {threads.map((thread) => (
        <div
          key={thread.id}
          onClick={() => onThreadSelect(thread.id)}
          className="p-2 hover:bg-gray-500 text-gray-500 hover:text-gray-100 cursor-pointer"
        >
          {thread.name}
        </div>
      ))}
    </div>
  );
};

export default ThreadSelector;