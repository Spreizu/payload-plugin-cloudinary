import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

import type { CloudinaryFile } from '../types.js'

/**
 * Restores the original file attributes when a file is updated without being replaced.
 * This optimization allows for an early response return in `staticHandler`, significantly improving performance.
 *
 * @param {Object} args - Method arguments.
 * @param {CloudinaryFile} args.data - The updated file data.
 * @param {CloudinaryFile} args.originalDoc - The original document before the update.
 * @param {PayloadRequest} args.req - The request object.
 * @returns {void}
 */
export const restoreOriginalDocAttributes: CollectionBeforeChangeHook<CloudinaryFile> = ({
  data,
  originalDoc,
  req
}: {
  data: Partial<CloudinaryFile>
  originalDoc?: CloudinaryFile
  req: PayloadRequest
}): void => {
  // Skip for new files
  if (req.file) {
    return
  }

  Object.assign(data, {
    filesize: originalDoc?.filesize ?? data.filesize,
    height: originalDoc?.height ?? data.height,
    mimeType: originalDoc?.mimeType ?? data.mimeType,
    width: originalDoc?.width ?? data.width
  })
}
