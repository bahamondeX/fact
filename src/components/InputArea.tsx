import React, { useRef } from 'react';
import { Paperclip, Mic, Send, Headphones, HeadphoneOff } from 'lucide-react';

interface InputAreaProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  message,
  onMessageChange,
  onSendMessage,
  onFileUpload,
  isRecording,
  startRecording,
  stopRecording
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [useSpeechCallBack, setUseSpeechCallBack] = useState(false)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSendMessage();
    }
  };

  return (
    <div className="p-3 border-t flex space-x-1">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onFileUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="audio/wav"
        ref={audioInputRef}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="text-gray-500 hover:bg-gray-100 p-1 rounded"
        aria-label="Attach files"
      >
        <Paperclip size={20} />
      </button>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`text-gray-500 hover:bg-gray-100 p-1 rounded ${
          isRecording ? "text-red-500" : ""
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        <Mic size={20} />
      </button>
      <button
        onClick={()=>setUseSpeechCallBack(!useSpeechCallBack)}
        className={`text-gray-500 hover:bg-gray-100 p-1 rounded ${
          useSpeechCallBack ? "text-blue-500" : ""
        }`}
        aria-label={useSpeechCallBack ? "Speech Response" : "No Speech"}
      >
        {useSpeechCallBack ? <Headphones className="p-1 rounded-lg bg-gray-500 text-white"  size={24} /> : <HeadphoneOff className="p-1" size={24}/>}
      </button>
      <input
        type="text"
        value={message}
        onChange={(e) => onMessageChange(e.target.value)}
        placeholder="Escribe un mensaje..."
        className="flex-grow border rounded-full px-3 py-2"
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={onSendMessage}
        className="bg-blue-500 text-white p-2 rounded-full"
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default InputArea;