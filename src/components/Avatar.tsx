import { useState } from 'react';
import { buildCloudinaryUrl, imagePresets } from '../utils/cloudinary';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isZoomable?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg'
};

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64
};

export default function Avatar({ src, name, size = 'md', className = '', isZoomable = false }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const shouldShowImage = src && !imageError;
  
  // Generate Cloudinary URL for avatar with proper sizing
  const avatarUrl = shouldShowImage 
    ? buildCloudinaryUrl(src, imagePresets.avatar(sizePixels[size]))
    : undefined;
  
  const AvatarContent = () => (
    <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center ${className}`}>
      {shouldShowImage ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-primary-500 text-white font-semibold flex items-center justify-center">
          {getInitials(name)}
        </div>
      )}
    </div>
  );

  if (isZoomable && shouldShowImage) {
    return (
      <div className="cursor-zoom-in group">
        <AvatarContent />
        {/* You can add zoom functionality here if needed for avatars */}
      </div>
    );
  }
  
  return <AvatarContent />;
}