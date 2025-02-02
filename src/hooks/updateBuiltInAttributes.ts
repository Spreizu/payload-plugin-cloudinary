import type { CollectionAfterReadHook } from 'payload'

import type { CloudinaryService } from '../services/CloudinaryService.js'
import type { CloudinaryFile } from '../types.js'

/**
 * Updates built-in attributes of a document after it is read.
 *
 * @param {() => CloudinaryService} getCldService - A function that returns an instance of the CloudinaryService.
 * @returns {CollectionAfterReadHook<CloudinaryFile>} - A hook that updates the document with additional attributes.
 */
export const updateBuiltInAttributes: (
  getCldService: () => CloudinaryService
) => CollectionAfterReadHook<CloudinaryFile> =
  (getCldService: () => CloudinaryService): CollectionAfterReadHook<CloudinaryFile> =>
  ({ doc }) => {
    return {
      ...doc,
      thumbnailURL: getCldService().getThumbnailURL(doc)
    }
  }
