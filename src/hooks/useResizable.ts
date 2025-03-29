import { useEffect, useRef } from "react";

interface ResizableProps {
	onResize: (width: number, height: number) => void;
}

export const useResizable = ({ onResize }: ResizableProps) => {
	const resizeHandleRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const resizeHandle = resizeHandleRef.current;
		const container = containerRef.current;

		if (!resizeHandle || !container) return;

		let isResizing = false;
		let initialMouseX = 0;
		let initialMouseY = 0;
		let initialWidth = 0;
		let initialHeight = 0;

		// Make the handle easier to grab
		resizeHandle.style.cursor = "nwse-resize";
		resizeHandle.style.touchAction = "none";

		const onMouseMove = (e: MouseEvent) => {
			if (!isResizing) return;

			// Calculate distance moved from starting position
			const dx = initialMouseX - e.clientX;
			const dy = initialMouseY - e.clientY;

			// Apply scaling factor to make movement more noticeable
			const scaleFactor = 2;
			const scaledDx = dx * scaleFactor;
			const scaledDy = dy * scaleFactor;

			// Calculate new dimensions
			const newWidth = Math.max(300, initialWidth + scaledDx);
			const newHeight = Math.max(300, initialHeight + scaledDy);

			// Update size
			onResize(newWidth, newHeight);
		};

		const onMouseUp = () => {
			isResizing = false;
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};

		const onMouseDown = (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			isResizing = true;
			initialMouseX = e.clientX;
			initialMouseY = e.clientY;
			initialWidth = container.offsetWidth;
			initialHeight = container.offsetHeight;

			document.body.style.cursor = "nwse-resize";
			document.body.style.userSelect = "none";

			document.addEventListener("mousemove", onMouseMove);
			document.addEventListener("mouseup", onMouseUp);

			// Log to help debug
			console.log("Resize started", { initialWidth, initialHeight });
		};

		resizeHandle.addEventListener("mousedown", onMouseDown);

		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("mousedown", onMouseDown);
		};
	}, [onResize]);

	return { resizeHandleRef, containerRef };
};