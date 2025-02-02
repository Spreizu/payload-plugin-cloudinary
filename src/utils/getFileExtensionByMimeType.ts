import mime from 'mime'

/**
 * Retrieves the file extension associated with a given MIME type.
 *
 * @param {null | string | undefined} mimeType - The MIME type for which to get the file extension.
 * @returns {string | null} - The file extension as a string if the MIME type is valid and not empty. Otherwise, returns null.
 */
export function getFileExtensionByMimeType(mimeType: null | string | undefined): null | string {
  if (!mimeType || mimeType.trim() === '') {
    return null
  }

  return mime.getExtension(mimeType)
}
