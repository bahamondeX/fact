import React from 'react';
import { FileText, Image, File, Mic, X } from 'lucide-react';

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  isMessage?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, isMessage = false }) => {
  const getFileIcon = (file: File) => {
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

  return (
    <div className={`flex items-center space-x-2 ${!isMessage ? 'bg-white p-1 rounded' : 'mt-2'}`}>
      {getFileIcon(file)}
      <span className={isMessage ? "" : "text-xs"}>{file.name}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-red-500"
          aria-label="Remove file"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

interface AudioAttachmentProps {
  file: File;
}

export const AudioAttachment: React.FC<AudioAttachmentProps> = ({ file }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Mic size={20} />
      <span>Audio: {file.name}</span>
    </div>
  );
};

interface FileAttachmentsListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FileAttachmentsList: React.FC<FileAttachmentsListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;
  
  return (
    <div className="p-2 bg-gray-100 flex space-x-2 overflow-x-auto">
      {files.map((file, index) => (
        <FilePreview 
          key={index} 
          file={file} 
          onRemove={() => onRemoveFile(index)} 
        />
      ))}
    </div>
  );
};

export default FileAttachmentsList;