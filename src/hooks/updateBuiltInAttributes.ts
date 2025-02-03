import type { CollectionAfterReadHook } from 'payload'

import type { CloudinaryService } from '../services/CloudinaryService.js'
import type { CloudinaryFile } from '../types.js'

import { getMediaDimensions } from '../utils/index.js'

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
    const mediaDimensions = getMediaDimensions(doc)

    return {
      ...doc,
      height: mediaDimensions.height,
      thumbnailURL: getCldService().getThumbnailURL(doc),
      width: mediaDimensions.width
    }
  }
