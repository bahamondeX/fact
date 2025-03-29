import { useState } from "react";

export interface Thread {
  id: number;
  name: string;
  messages: Message[];
  createdAt: number;
}

export interface Message {
  id: number;
  text: string;
  files: File[];
  audio: File | null;
  sender: "user" | "bot";
}

export interface ChatState {
  isOpen: boolean;
  threads: Thread[];
  currentThreadId: number;
  message: string;
  isRecording: boolean;
  audioFile: File | null;
  files: File[];
  isThreadsVisible: boolean;
  isDropzoneActive: boolean;
  chatboxSize: {
    width: string;
    height: string;
  };
  isMaximized: boolean;
}

export interface ChatStateActions {
  setIsOpen: (isOpen: boolean) => void;
  setThreads: React.Dispatch<React.SetStateAction<Thread[]>>;
  setCurrentThreadId: (id: number) => void;
  setMessage: (message: string) => void;
  setIsRecording: (isRecording: boolean) => void;
  setAudioFile: (file: File | null) => void;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setIsThreadsVisible: (isVisible: boolean) => void;
  setIsDropzoneActive: (isActive: boolean) => void;
  setChatboxSize: React.Dispatch<React.SetStateAction<{ width: string; height: string }>>;
  setIsMaximized: (isMaximized: boolean) => void;
  sendMessage: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  toggleMaximize: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleThreadsVisibility: () => void;
  createNewThread: () => void;
  renameThread: (threadId: number, newName: string) => void;
  deleteThread: (threadId: number) => void;
}

export const useChatState = (): [ChatState, ChatStateActions] => {
  const [isOpen, setIsOpen] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([
    { 
      id: 1, 
      name: "Conversación 1", 
      messages: [],
      createdAt: Date.now() - 86400000 // 1 day ago
    },
    { 
      id: 2, 
      name: "Conversación 2", 
      messages: [],
      createdAt: Date.now() - 3600000 // 1 hour ago
    },
  ]);
  const [currentThreadId, setCurrentThreadId] = useState(1);
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isThreadsVisible, setIsThreadsVisible] = useState(false);
  const [isDropzoneActive, setIsDropzoneActive] = useState(false);
  const [chatboxSize, setChatboxSize] = useState({
    width: "400px",
    height: "500px",
  });
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleThreadsVisibility = () => {
    setIsThreadsVisible(!isThreadsVisible);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setChatboxSize({ width: "400px", height: "500px" });
    } else {
      setChatboxSize({ width: "90vw", height: "90vh" });
    }
    setIsMaximized(!isMaximized);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

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

  const sendMessage = () => {
    if (message.trim() || files.length || audioFile) {
      const newMessage = {
        id: Date.now(),
        text: message,
        files: [...files],
        audio: audioFile,
        sender: "user" as const,
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

  // Create a new thread
  const createNewThread = () => {
    const newThreadId = Date.now();
    const newThread: Thread = {
      id: newThreadId,
      name: `New Conversation`,
      messages: [],
      createdAt: Date.now()
    };

    setThreads(prev => [...prev, newThread]);
    setCurrentThreadId(newThreadId);
  };

  // Rename a thread
  const renameThread = (threadId: number, newName: string) => {
    setThreads(prev => 
      prev.map(thread => 
        thread.id === threadId 
          ? { ...thread, name: newName } 
          : thread
      )
    );
  };

  // Delete a thread
  const deleteThread = (threadId: number) => {
    setThreads(prev => prev.filter(thread => thread.id !== threadId));
    
    // If the current thread is deleted, switch to another thread
    if (currentThreadId === threadId) {
      const remainingThreads = threads.filter(thread => thread.id !== threadId);
      if (remainingThreads.length > 0) {
        setCurrentThreadId(remainingThreads[0].id);
      } else {
        // If no threads left, create a new one
        createNewThread();
      }
    }
  };

  const state: ChatState = {
    isOpen,
    threads,
    currentThreadId,
    message,
    isRecording,
    audioFile,
    files,
    isThreadsVisible,
    isDropzoneActive,
    chatboxSize,
    isMaximized,
  };

  const actions: ChatStateActions = {
    setIsOpen,
    setThreads,
    setCurrentThreadId,
    setMessage,
    setIsRecording,
    setAudioFile,
    setFiles,
    setIsThreadsVisible,
    setIsDropzoneActive,
    setChatboxSize,
    setIsMaximized,
    sendMessage,
    startRecording,
    stopRecording,
    toggleMaximize,
    handleFileUpload,
    toggleThreadsVisibility,
    createNewThread,
    renameThread,
    deleteThread
  };

  return [state, actions];
};