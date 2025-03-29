import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Paperclip,
  Mic,
  Send,
  X,
  ChevronDown,
  FileText,
  Image,
  File,
  Minimize2,
  Maximize2,
  GripVertical,
} from "lucide-react";

const ChatbotWidget = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState([
    { id: 1, name: "Conversación 1", messages: [] },
    { id: 2, name: "Conversación 2", messages: [] },
  ]);
  const [currentThreadId, setCurrentThreadId] = useState(1);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [isThreadsVisible, setIsThreadsVisible] = useState(false);
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);
  const [chatboxSize, setChatboxSize] = useState({
    width: "400px",
    height: "500px",
  });
  const [isMaximized, setIsMaximized] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const dropZoneRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Resizing logic
  useEffect(() => {
    const resizeHandle = resizeHandleRef.current;
    const container = chatContainerRef.current;

    let isResizing = false;
    let startX, startY, startWidth, startHeight, startLeft, startTop;

    const onMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newWidth = Math.max(300, startWidth - deltaX);
      const newHeight = Math.max(300, startHeight - deltaY);

      setChatboxSize({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      });
    };

    const onMouseUp = () => {
      isResizing = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = container.offsetWidth;
      startHeight = container.offsetHeight;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    };

    if (resizeHandle) {
      resizeHandle.addEventListener("mousedown", onMouseDown);
    }

    return () => {
      if (resizeHandle) {
        resizeHandle.removeEventListener("mousedown", onMouseDown);
      }
    };
  }, []);

  // Global drag and drop handlers
  useEffect(() => {
    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        setIsDropzoneActive(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isDropzoneActive) {
        setIsDropzoneActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen) {
        const newFiles = Array.from(e.dataTransfer.files);
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setIsDropzoneActive(false);
      }
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("dragover", (e) => e.preventDefault());
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDrop);
    };
  }, [isOpen, isDropzoneActive]);

  // Maximize/Restore functionality
  const toggleMaximize = () => {
    if (isMaximized) {
      setChatboxSize({ width: "400px", height: "500px" });
    } else {
      setChatboxSize({ width: "90vw", height: "90vh" });
    }
    setIsMaximized(!isMaximized);
  };

  // File handling
  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // Audio recording (simplified mock implementation)
  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, you'd use MediaRecorder API
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Mock audio file creation
    const mockAudioFile = new File(["mock audio content"], "recording.wav", {
      type: "audio/wav",
    });
    setAudioFile(mockAudioFile);
  };

  // Message sending
  const sendMessage = () => {
    if (message.trim() || files.length || audioFile) {
      const newMessage = {
        id: Date.now(),
        text: message,
        files: [...files],
        audio: audioFile,
        sender: "user",
      };

      // Update current thread
      setThreads((prevThreads) =>
        prevThreads.map((thread) =>
          thread.id === currentThreadId
            ? { ...thread, messages: [...thread.messages, newMessage] }
            : thread
        )
      );

      // Reset inputs
      setMessage("");
      setFiles([]);
      setAudioFile(null);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads, currentThreadId]);

  // File type icon selection
  const getFileIcon = (file) => {
    const fileType = file.type.split("/")[0];
    switch (fileType) {
      case "image":
        return <Image size={20} />;
      case "text":
        return <FileText size={20} />;
      default:
        return <File size={20} />;
    }
  };

  // Current thread messages
  const currentThreadMessages =
    threads.find((t) => t.id === currentThreadId)?.messages || [];

  return (
    <div
      ref={chatContainerRef}
      className="fixed bottom-4 right-4 z-50"
      style={{
        width: chatboxSize.width,
        height: chatboxSize.height,
        maxWidth: "90vw",
        maxHeight: "90vh",
      }}
    >
      {/* Global Dropzone overlay */}
      {isDropzoneActive && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex flex-col items-center justify-center text-white"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const newFiles = Array.from(e.dataTransfer.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setIsDropzoneActive(false);
          }}
        >
          <p className="mb-4 text-xl">Suelta tus archivos aquí</p>
          <button
            onClick={() => setIsDropzoneActive(false)}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Threads Selector */}
      {isOpen && isThreadsVisible && (
        <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-lg w-full">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => {
                setCurrentThreadId(thread.id);
                setIsThreadsVisible(false);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {thread.name}
            </div>
          ))}
        </div>
      )}

      {/* Main Chatbot Container */}
      <div className="bg-white shadow-2xl rounded-xl overflow-hidden border flex flex-col h-full relative">
        {/* Resize Handle */}
        <div
          ref={resizeHandleRef}
          className="absolute top-0 left-0 w-full h-6 cursor-move z-10 flex items-center justify-center hover:bg-blue-600/10"
        >
          <GripVertical size={20} className="text-gray-400 opacity-50" />
        </div>

        {/* Chat Header */}
        <div className="bg-blue-500 text-white p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageCircle size={20} />
            <span>Chatbot</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsThreadsVisible(!isThreadsVisible)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              <ChevronDown size={20} />
            </button>
            <button
              onClick={toggleMaximize}
              className="hover:bg-blue-600 p-1 rounded"
            >
              {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-blue-600 p-1 rounded"
            >
              {isOpen ? <X size={20} /> : <MessageCircle size={20} />}
            </button>
          </div>
        </div>

        {/* Chat Body */}
        {isOpen && (
          <div className="flex flex-col flex-grow min-h-0">
            {/* Messages Container */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {currentThreadMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                    max-w-[70%] p-3 rounded-lg 
                    ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }
                  `}
                  >
                    {msg.text && <p>{msg.text}</p>}
                    {msg.files &&
                      msg.files.map((file) => (
                        <div
                          key={file.name}
                          className="flex items-center space-x-2 mt-2"
                        >
                          {getFileIcon(file)}
                          <span>{file.name}</span>
                        </div>
                      ))}
                    {msg.audio && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Mic size={20} />
                        <span>Audio: {msg.audio.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>

            {/* Files Preview */}
            {files.length > 0 && (
              <div className="p-2 bg-gray-100 flex space-x-2 overflow-x-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 bg-white p-1 rounded"
                  >
                    {getFileIcon(file)}
                    <span className="text-xs">{file.name}</span>
                    <button
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
                      className="text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Area */}
            <div className="p-3 border-t flex space-x-2">
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                type="file"
                accept="audio/wav"
                ref={audioInputRef}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded"
              >
                <Paperclip size={20} />
              </button>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`text-gray-500 hover:bg-gray-100 p-2 rounded ${
                  isRecording ? "text-red-500" : ""
                }`}
              >
                <Mic size={20} />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-grow border rounded-full px-3 py-2"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white p-2 rounded-full"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotWidget;
