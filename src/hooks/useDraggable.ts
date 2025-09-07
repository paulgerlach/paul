import { useState, useRef, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface UseDraggableOptions {
  initialPosition?: Position;
  bounds?: {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
  };
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const [position, setPosition] = useState<Position>(
    options.initialPosition || { x: 0, y: 0 }
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; elementX: number; elementY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    
    e.preventDefault();
    setIsDragging(true);
    
    const rect = dragRef.current.getBoundingClientRect();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      elementX: rect.left,
      elementY: rect.top
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      let newX = dragStartRef.current.elementX + deltaX;
      let newY = dragStartRef.current.elementY + deltaY;

      // Apply bounds if specified
      if (options.bounds) {
        const { left = 0, top = 0, right = window.innerWidth, bottom = window.innerHeight } = options.bounds;
        newX = Math.max(left, Math.min(newX, right - (dragRef.current?.offsetWidth || 0)));
        newY = Math.max(top, Math.min(newY, bottom - (dragRef.current?.offsetHeight || 0)));
      }

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, options.bounds]);

  // Method to update position programmatically
  const updatePosition = (newPosition: Position) => {
    setPosition(newPosition);
    setIsInitialized(true);
  };

  return {
    position,
    isDragging,
    dragRef,
    updatePosition,
    isInitialized,
    dragHandleProps: {
      onMouseDown: handleMouseDown,
      style: { cursor: isDragging ? 'grabbing' : 'grab' }
    }
  };
}
