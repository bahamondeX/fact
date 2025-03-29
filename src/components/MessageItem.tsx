import React from 'react';
import { Message } from '~/hooks/useChatState';
import { FilePreview, AudioAttachment } from './FileAttachment';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const { sender, text, files, audio } = message;
  const isUserMessage = sender === 'user';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[70%] p-3 rounded-lg 
          ${isUserMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}
        `}
      >
        {text && <p>{text}</p>}
        
        {files && files.length > 0 && 
          files.map((file, index) => (
            <FilePreview key={`${file.name}-${index}`} file={file} isMessage />
          ))
        }
        
        {audio && <AudioAttachment file={audio} />}
      </div>
    </div>
  );
};

export default MessageItem;