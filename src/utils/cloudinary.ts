// Cloudinary configuration and utilities
export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset?: string;
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  uploadPreset:
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset",
};

// Cloudinary transformation parameters
export interface CloudinaryTransformation {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "crop" | "pad" | "limit" | "mfit" | "mpad";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png";
  gravity?:
    | "auto"
    | "face"
    | "faces"
    | "center"
    | "north"
    | "south"
    | "east"
    | "west";
  radius?: number | "max";
  effect?: string;
  overlay?: string;
  border?: string;
}

/**
 * Generate Cloudinary URL with transformations
 * @param publicId - The public ID of the image in Cloudinary
 * @param transformations - Transformation parameters
 * @returns Transformed image URL
 */
export const buildCloudinaryUrl = (
  publicId: string | null | undefined,
  transformations: CloudinaryTransformation = {}
): string => {
  if (!publicId || typeof publicId !== 'string') return "";

  // If it's already a full URL, return as is (for backward compatibility)
  if (publicId.startsWith("http")) return publicId;

  const { cloudName } = cloudinaryConfig;

  // Build transformation string
  const transformParams: string[] = [];

  if (transformations.width) transformParams.push(`w_${transformations.width}`);
  if (transformations.height)
    transformParams.push(`h_${transformations.height}`);
  if (transformations.crop) transformParams.push(`c_${transformations.crop}`);
  if (transformations.quality)
    transformParams.push(`q_${transformations.quality}`);
  if (transformations.format)
    transformParams.push(`f_${transformations.format}`);
  if (transformations.gravity)
    transformParams.push(`g_${transformations.gravity}`);
  if (transformations.radius)
    transformParams.push(`r_${transformations.radius}`);
  if (transformations.effect)
    transformParams.push(`e_${transformations.effect}`);
  if (transformations.overlay)
    transformParams.push(`l_${transformations.overlay}`);
  if (transformations.border)
    transformParams.push(`bo_${transformations.border}`);

  const transformString =
    transformParams.length > 0 ? `${transformParams.join(",")}` : "";

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
};

/**
 * Common image transformation presets
 */
export const imagePresets = {
  // Profile pictures
  avatar: (size: number = 150): CloudinaryTransformation => ({
    width: size,
    height: size,
    crop: "fill",
    gravity: "face",
    quality: "auto",
    format: "auto",
    radius: "max",
  }),

  // Item card thumbnails
  itemCard: {
    width: 400,
    height: 300,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "auto",
  },

  // Item detail page main image
  itemDetail: {
    width: 800,
    height: 600,
    crop: "fit",
    quality: "auto",
    format: "auto",
  },

  // Evidence images in claims
  evidence: {
    width: 300,
    height: 300,
    crop: "fill",
    quality: "auto",
    format: "auto",
  },

  // Gallery thumbnails
  galleryThumb: {
    width: 150,
    height: 150,
    crop: "fill",
    quality: "auto",
    format: "auto",
  },

  // High quality for zoom
  zoomable: {
    width: 1200,
    height: 900,
    crop: "fit",
    quality: "auto",
    format: "auto",
  },
};

/**
 * Upload image to Cloudinary
 * @param file - File to upload
 * @param folder - Optional folder name
 * @returns Promise with upload result
 */
export const uploadToCloudinary = async (
  file: File,
  folder?: string
): Promise<{ public_id: string; url: string; secure_url: string }> => {
  const { cloudName, uploadPreset } = cloudinaryConfig;

  if (!uploadPreset) {
    throw new Error("Upload preset not configured");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  if (folder) {
    formData.append("folder", folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  return response.json();
};
