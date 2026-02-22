import React, { useState } from 'react';
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { buildCloudinaryUrl, type CloudinaryTransformation } from '../../utils/cloudinary';

interface ZoomableImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  transformations?: CloudinaryTransformation;
  zoomTransformations?: CloudinaryTransformation;
  onClick?: () => void;
}

interface ImageZoomModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  transformations?: CloudinaryTransformation;
}

const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  src,
  alt,
  isOpen,
  onClose,
  transformations,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev / 1.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Generate high-quality image URL for zoom
  const zoomImageUrl = buildCloudinaryUrl(src, transformations);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
          title="Zoom Out"
        >
          <MagnifyingGlassMinusIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
          title="Zoom In"
        >
          <MagnifyingGlassPlusIcon className="w-6 h-6" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white text-sm font-medium transition-colors"
          title="Reset"
        >
          1:1
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
          title="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm">
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Image */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={zoomImageUrl}
          alt={alt}
          className={`max-w-none transition-transform duration-200 ${
            isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
          }`}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={scale === 1 ? handleZoomIn : undefined}
          draggable={false}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm text-center">
          {scale === 1 ? 'Click image or use + to zoom in' : 'Drag to pan • Use +/- to zoom'}
        </div>
      </div>
    </div>
  );
};

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  transformations,
  zoomTransformations,
  onClick,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsZoomOpen(true);
    }
  };

  // Handle null/undefined src
  if (!src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const imageUrl = buildCloudinaryUrl(src, transformations);

  return (
    <>
      <div className="relative group cursor-zoom-in" onClick={handleClick}>
        <img
          src={imageUrl}
          alt={alt}
          className={`transition-transform duration-200 group-hover:scale-105 ${className}`}
        />
        
        {/* Zoom overlay hint */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-2">
              <MagnifyingGlassPlusIcon className="w-6 h-6 text-gray-700" />
            </div>
          </div>
        </div>
      </div>

      <ImageZoomModal
        src={src}
        alt={alt}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        transformations={zoomTransformations}
      />
    </>
  );
};

export default ZoomableImage;