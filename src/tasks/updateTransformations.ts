import type { ConfigOptions, UploadApiOptions } from 'cloudinary'
import type { CollectionSlug, TaskConfig } from 'payload'

import type { CloudinaryFile } from '../types.js'

import { CloudinaryService } from '../services/CloudinaryService.js'

/**
 * Task configuration for updating transformations of a Cloudinary file.
 * This task handles the process of updating transformations for a given image or video file in the Cloudinary
 * product environment and ensures that the document's state is updated in the database accordingly.
 */
export const updateTransformationsTask: TaskConfig<'updateTransformations'> = {
  slug: 'updateTransformations',
  handler: async ({ input, req }) => {
    let hasErrors = false
    const { collection, configOptions, doc, previousDoc, uploadApiOptions } = input as unknown as {
      collection: CollectionSlug
      configOptions?: ConfigOptions
      doc: CloudinaryFile
      previousDoc: CloudinaryFile | null
      uploadApiOptions?: UploadApiOptions
    }

    // Update transformations
    try {
      const cldService = new CloudinaryService(configOptions, uploadApiOptions)

      await req.payload.db.updateOne({
        collection,
        data: {
          isProcessing: true
        },
        where: {
          publicId: {
            equals: doc.publicId ?? -1
          }
        }
      })

      await cldService.updateTransformations({ doc, previousDoc, req })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Unexpected error in updateTransformations' })
      hasErrors = true
    }

    const isProcessing = false

    // Update file state
    try {
      await req.payload.db.updateOne({
        collection,
        data: {
          hasErrors,
          isProcessing
        },
        where: {
          publicId: {
            equals: doc.publicId ?? -1
          }
        }
      })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Failed to update file in updateTransformations' })
    }

    return {
      output: undefined
    }
  },
  inputSchema: [
    {
      name: 'configOptions',
      type: 'json'
    },
    {
      name: 'uploadApiOptions',
      type: 'json'
    },
    {
      name: 'collection',
      type: 'text',
      required: true
    },
    {
      name: 'doc',
      type: 'json',
      required: true
    },
    {
      name: 'previousDoc',
      type: 'json',
      required: true
    }
  ],
  retries: 0
}
