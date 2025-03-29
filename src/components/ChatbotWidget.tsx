import React, { useEffect, useState } from "react";
import { GripVertical, MessageCircle } from "lucide-react";
import { useChatState } from "~/hooks/useChatState";
import { useResizable } from "~/hooks/useResizable";
import { useDropZone } from "~/hooks/useDropZone";
import ChatHeader from "./ChatHeader";
import ThreadSelector from "./ThreadSelector";
import MessageList from "./MessageList";
import InputArea from "./InputArea";
import FileAttachmentsList from "./FileAttachment";
import DropZone from "~/components/Dropzone";
import ThreadSidebar from "./ThreadSideBar";

// Minimum width where we'll show the sidebar
const SIDEBAR_THRESHOLD_WIDTH = 700;

const ChatbotWidget: React.FC = () => {
  const [state, actions] = useChatState();
  const [showSidebar, setShowSidebar] = useState(false);

  const {
    isOpen,
    threads,
    currentThreadId,
    message,
    isRecording,
    files,
    isThreadsVisible,
    isDropzoneActive,
    chatboxSize,
    isMaximized,
  } = state;

  const {
    setIsOpen,
    setCurrentThreadId,
    setMessage,
    setFiles,
    setIsThreadsVisible,
    setIsDropzoneActive,
    setChatboxSize,
    sendMessage,
    toggleMaximize,
    handleFileUpload,
    startRecording,
    stopRecording,
    toggleThreadsVisibility,
  } = actions;

  const { resizeHandleRef, containerRef } = useResizable({
    onResize: (width, height) => {
      setChatboxSize({
        width: `${width}px`,
        height: `${height}px`,
      });
    },
  });

  // Determine if we should show the sidebar based on current width
  useEffect(() => {
    if (chatboxSize.width) {
      const widthInPx = parseInt(chatboxSize.width, 10);
      setShowSidebar(widthInPx >= SIDEBAR_THRESHOLD_WIDTH);
    }
  }, [chatboxSize.width]);

  // Setup drop zone
  useDropZone({
    isOpen,
    isDropzoneActive,
    setIsDropzoneActive,
    onFilesDropped: (newFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
  });

  // Get current thread messages
  const currentThreadMessages =
    threads.find((t) => t.id === currentThreadId)?.messages || [];

  const toggleChatVisibility = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThreadSelect = (threadId: number) => {
    setCurrentThreadId(threadId);
    // Only hide threads dropdown if we're not showing sidebar
    if (!showSidebar) {
      setIsThreadsVisible(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-50"
      style={{
        width: chatboxSize.width,
        height: chatboxSize.height,
        maxWidth: "90vw",
        maxHeight: "90vh"
      }}
    >
      {/* Chat Body */}
      {isOpen ? (
        <>
          {/* File Drop Zone */}
          <DropZone
            isActive={isDropzoneActive}
            onDrop={(newFiles) => {
              setFiles((prevFiles) => [...prevFiles, ...newFiles]);
              setIsDropzoneActive(false);
            }}
            onCancel={() => setIsDropzoneActive(false)}
          />
          
          {/* Thread Selector (only shown if sidebar is not visible) */}
          {!showSidebar && (
            <ThreadSelector
              threads={threads}
              isVisible={isOpen && isThreadsVisible}
              onThreadSelect={handleThreadSelect}
            />
          )}

          {/* Main Chatbot Container */}
          <div className="bg-white shadow-2xl rounded-xl overflow-hidden border flex flex-col h-full relative">
            {/* Resize Handle */}
            <div
              ref={resizeHandleRef}
              className="absolute top-0 left-0 w-8 h-8 cursor-nwse-resize z-20 flex items-center justify-center"
              style={{ background: 'transparent' }}
            >
              <GripVertical size={20} className="text-gray-400 opacity-50" />
            </div>
            
            <ChatHeader
              isMaximized={isMaximized}
              toggleMaximize={toggleMaximize}
              toggleThreadsVisibility={!showSidebar ? toggleThreadsVisibility : undefined}
              toggleChatVisibility={toggleChatVisibility}
              isOpen={isOpen}
              onClose={toggleChatVisibility}
              showSidebar={showSidebar}
            />
            
            <div className="flex flex-grow min-h-0">
              {/* Sidebar for threads on larger screens */}
              {showSidebar && (
                <ThreadSidebar 
                  threads={threads}
                  currentThreadId={currentThreadId}
                  onThreadSelect={handleThreadSelect}
                />
              )}
              
              {/* Main chat area */}
              <div className="flex flex-col flex-grow min-h-0">
                {/* Messages Container */}
                <MessageList messages={currentThreadMessages} />

                {/* Files Preview */}
                <FileAttachmentsList files={files} onRemoveFile={handleRemoveFile} />

                {/* Input Area */}
                <InputArea
                  message={message}
                  onMessageChange={setMessage}
                  onSendMessage={sendMessage}
                  onFileUpload={handleFileUpload}
                  isRecording={isRecording}
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
       <MessageCircle 
          onClick={toggleChatVisibility} 
          className="bottom-4 right-4 absolute cursor-pointer hover:scale-125 ease-in-out duration-300 text-blue-500" 
          size={32} 
        />
      )}
    </div>
  );
};

export default ChatbotWidget;