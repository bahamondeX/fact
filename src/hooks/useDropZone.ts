import { useEffect } from 'react';

interface UseDropZoneProps {
	isOpen: boolean;
	isDropzoneActive: boolean;
	setIsDropzoneActive: (isActive: boolean) => void;
	onFilesDropped: (files: File[]) => void;
}

export const useDropZone = ({
	isOpen,
	isDropzoneActive,
	setIsDropzoneActive,
	onFilesDropped
}: UseDropZoneProps) => {
	useEffect(() => {
		const handleDragEnter = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (isOpen) {
				setIsDropzoneActive(true);
			}
		};

		const handleDragLeave = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (isDropzoneActive) {
				setIsDropzoneActive(false);
			}
		};

		const handleDragOver = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
		};

		const handleDrop = (e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (isOpen && e.dataTransfer) {
				const newFiles = Array.from(e.dataTransfer.files);
				onFilesDropped(newFiles);
				setIsDropzoneActive(false);
			}
		};

		document.addEventListener("dragenter", handleDragEnter);
		document.addEventListener("dragleave", handleDragLeave);
		document.addEventListener("dragover", handleDragOver);
		document.addEventListener("drop", handleDrop);

		return () => {
			document.removeEventListener("dragenter", handleDragEnter);
			document.removeEventListener("dragleave", handleDragLeave);
			document.removeEventListener("dragover", handleDragOver);
			document.removeEventListener("drop", handleDrop);
		};
	}, [isOpen, isDropzoneActive, setIsDropzoneActive, onFilesDropped]);

	return null; // This hook doesn't return any values, just sets up event handlers
};