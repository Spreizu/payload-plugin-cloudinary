import type { CollectionBeforeChangeHook } from 'payload'

import type { CloudinaryService } from '../services/CloudinaryService.js'
import type { CloudinaryFile } from '../types.js'

import { isObject } from '../utils/index.js'

/**
 * Updates document attributes before a change in the collection.
 * This function ensures that transformations are updated for existing files when necessary.
 * If the operation is an update and the publicId has not changed, it queues the updateTransformations task.
 *
 * @param {() => CloudinaryService} getCldService - A function that returns an instance of the CloudinaryService.
 * @returns {CollectionBeforeChangeHook<CloudinaryFile>} - A hook that updates the document with additional attributes.
 */
export const updateDocAttributes: (
  getCldService: () => CloudinaryService
) => CollectionBeforeChangeHook<CloudinaryFile> =
  (getCldService: () => CloudinaryService): CollectionBeforeChangeHook<CloudinaryFile> =>
  async ({ collection, data, originalDoc, req }) => {
    // Skip for new files
    if (req.file) {
      return
    }

    // Skip when transformations did not change
    if (JSON.stringify(data.rawTransformations) === JSON.stringify(originalDoc?.rawTransformations)) {
      return
    }

    // Queue updateTransformations task
    await req.payload.jobs.queue({
      input: {
        collection: collection.slug,
        configOptions: getCldService().getConfigOptions(),
        doc: structuredClone({ ...data }),
        previousDoc: isObject(originalDoc) ? structuredClone({ ...originalDoc }) : null,
        uploadApiOptions: getCldService().getUploadApiOptions()
      },
      queue: 'cloudinary',
      task: 'updateTransformations'
    })
  }
