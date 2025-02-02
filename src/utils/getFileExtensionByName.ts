import { last } from './last.js'

/**
 * Retrieves the file extension from a given filename.
 * This function ensures that the file extension is returned in lowercase if present, otherwise null.
 *
 * @param {null | string | undefined} filename - The name of the file, which may include an extension.
 * @returns {string | null} - The file extension in lowercase if present, otherwise null.
 */
export function getFileExtensionByName(filename: null | string | undefined): null | string {
  if (!filename || filename.trim() === '') {
    return null
  }

  const parts = filename.split('.')

  if (parts.length < 2 || !last(parts)) {
    return null
  }

  return parts.pop()?.toLowerCase() ?? null
}
