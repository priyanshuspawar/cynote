"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils"; // Ensure this utility is correctly implemented

type Props = {
  url: string;
  isDragable: boolean;
  fileId: string;
  onChangePosition: (position: { x: number; y: number }) => void;
};

const DragImagePosition: React.FC<Props> = ({ url, isDragable,fileId,onChangePosition}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dragSpeed = 1; // Speed factor for dragging
    useEffect(()=>{
        if(typeof window !== undefined){
            const storagePosi = JSON.parse(window.localStorage.getItem(fileId) as string)
            if(storagePosi && (storagePosi.x || storagePosi.y)){
                setPosition({
                    x:storagePosi.x,
                    y: storagePosi.y
                })
            }
        }
    },[])
  // Function to handle mouse move events
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const x = e.clientX;
    const y = e.clientY;
    const { clientWidth: targetWidth, clientHeight: targetHeight } = container;

    const imageProportion = imageDimensions.width / imageDimensions.height;
    let maxPosX = 0;
    let maxPosY = 0;

    if (imageDimensions.width > targetWidth && imageDimensions.height > targetHeight) {
      maxPosY = targetWidth / imageProportion - targetHeight;
    } else {
      if (targetWidth - imageDimensions.width > targetHeight - imageDimensions.height) {
        maxPosY = targetWidth / imageProportion - targetHeight;
      } else {
        maxPosX = targetWidth / imageProportion - targetWidth;
      }
    }

    const imageBgPosX = (x - startPosition.x) * dragSpeed + position.x;
    const imageBgPosY = (y - startPosition.y) * dragSpeed + position.y;

    setPosition(prev => ({
      x: Math.min(Math.max(imageBgPosX, -maxPosX), 0),
      y: Math.min(Math.max(imageBgPosY, -maxPosY), 0)
    }));

    setStartPosition({ x, y });
  }, [isDragging, position, startPosition, imageDimensions]);

  // Function to handle mouse up events
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      const styles = getComputedStyle(containerRef.current);
      let posi = {
        x: parseInt(styles.getPropertyValue('background-position-x'), 10),
        y: parseInt(styles.getPropertyValue('background-position-y'), 10),
      }
      setPosition(posi);
      onChangePosition({...posi})
    }
  }, []);

  // Function to handle mouse down events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragable) return; // Only allow dragging if isDragable is true

    e.preventDefault();
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
  }, [isDragable]);

  // Add and remove event listeners for mouse events
  useEffect(() => {
    if (!isDragable) return; // Add listeners only if dragging is allowed

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, isDragable]);

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [url]);
  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-[30vh] bg-cover bg-no-repeat bg-center mx-auto", {
            "cursor-move":isDragable
      })}
      style={{
        backgroundImage: `url('${url}')`,
        backgroundPositionX: `${position.x}px`,
        backgroundPositionY: `${position.y}px`,
        transition: isDragging ? 'none' : 'background-position 0.3s ease',
      }}
      onMouseDown={handleMouseDown}
    />
  );
};

export default DragImagePosition;
