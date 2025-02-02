import { IMAGE_EXTENSIONS, VIDEO_EXTENSIONS } from '../constants.js'
import { getFileExtensionByMimeType } from './getFileExtensionByMimeType.js'

/**
 * Determines the resource type based on the given MIME type.
 *
 * @param {null | string | undefined} mimeType - The MIME type for which to determine the resource type.
 * @returns {string} - The resource type ('image', 'video', or 'raw') based on the MIME type.
 */
export function getResourceTypeByMimeType(mimeType: null | string | undefined): 'image' | 'raw' | 'video' {
  const fileExtension = getFileExtensionByMimeType(mimeType)

  if (fileExtension && IMAGE_EXTENSIONS.includes(fileExtension)) {
    return 'image'
  } else if (fileExtension && VIDEO_EXTENSIONS.includes(fileExtension)) {
    return 'video'
  }

  return 'raw'
}
