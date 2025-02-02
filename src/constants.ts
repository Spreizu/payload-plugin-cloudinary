/**
 * Animated image extensions that Cloudinary categorizes as 'image' resources.
 * @see https://cloudinary.com/documentation/image_transformations#supported_image_formats
 */
export const ANIMATED_IMAGE_EXTENSIONS: readonly string[] = ['avif', 'gif', 'png', 'webp']

/**
 * Image extensions that Cloudinary categorizes as 'image' resources.
 * @see https://cloudinary.com/documentation/image_transformations#supported_image_formats
 */
export const IMAGE_EXTENSIONS: readonly string[] = [
  ...ANIMATED_IMAGE_EXTENSIONS,
  'ai',
  'png',
  'bmp',
  'bw',
  'djvu',
  'dng',
  'ps',
  'edt',
  'eps',
  'eps3',
  'fbx',
  'flif',
  'glb',
  'gltf',
  'heif',
  'heic',
  'ico',
  'indd',
  'jpg',
  'jpe',
  'jpeg',
  'jp2',
  'wdp',
  'jxr',
  'hdp',
  'jxl',
  'ply',
  'psd',
  'arw',
  'cr2',
  'tga',
  'tif',
  'tiff',
  'u3ma',
  'usdz'
]

/**
 * Video extensions that Cloudinary categorizes as 'video' resources.
 * @see https://cloudinary.com/documentation/video_manipulation_and_delivery#supported_video_formats
 */
export const VIDEO_EXTENSIONS: readonly string[] = [
  '3g2',
  '3gp',
  'avi',
  'ts',
  'm2ts',
  'mts',
  'mov',
  'mkv',
  'mp4',
  'mpeg',
  'mpd',
  'mxf',
  'ogv',
  'webm',
  'wmv'
]

/**
 * Supported transformation resolutions.
 */
export const TRANSFORMATION_RESOLUTIONS: readonly number[] = [
  6016, // 6K
  5120, // 5K
  4480, // 4.5K
  3840, // 4K
  3200, // QHD+
  2560, // WQXGA
  2048, // QXGA
  1920, // 1080p
  1668, // Various iPads
  1280, // 720p
  960,
  640,
  320
]

export const MULTIPART_THRESHOLD: number = 1024 * 1024 * 50 // 50MB
