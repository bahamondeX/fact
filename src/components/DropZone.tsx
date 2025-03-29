import React from 'react';

interface DropZoneProps {
  isActive: boolean;
  onDrop: (files: File[]) => void;
  onCancel: () => void;
}

const DropZone: React.FC<DropZoneProps> = ({ isActive, onDrop, onCancel }) => {
  if (!isActive) return null;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const newFiles = Array.from(e.dataTransfer.files);
    onDrop(newFiles);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[60] flex flex-col items-center justify-center text-white"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p className="mb-4 text-xl">Suelta tus archivos aquí</p>
      <button
        onClick={onCancel}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Cancelar
      </button>
    </div>
  );
};

export default DropZone;