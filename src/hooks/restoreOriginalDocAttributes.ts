import type { CollectionBeforeChangeHook } from 'payload'

import type { CloudinaryFile } from '../types.js'

/**
 * Restores the original file attributes when a file is updated without being replaced.
 * This optimization allows for an early response return in `staticHandler`, significantly improving performance.
 *
 * @param {Object} args - Method arguments.
 * @param {CloudinaryFile} args.data - The updated file data.
 * @param {string} args.operation - The type of operation being performed (e.g., 'update').
 * @param {CloudinaryFile} args.originalDoc - The original document before the update.
 * @returns {void}
 */
export const restoreOriginalDocAttributes: CollectionBeforeChangeHook<CloudinaryFile> = ({
  data,
  operation,
  originalDoc
}: {
  data: Partial<CloudinaryFile>
  operation: string
  originalDoc?: CloudinaryFile
}): void => {
  if (operation !== 'update' || originalDoc?.publicId !== data.publicId) {
    return
  }

  if (originalDoc?.width) {
    data.width = originalDoc.width
  }

  if (originalDoc?.height) {
    data.height = originalDoc.height
  }

  if (originalDoc?.filesize) {
    data.filesize = originalDoc.filesize
  }

  if (originalDoc?.mimeType) {
    data.mimeType = originalDoc.mimeType
  }
}
