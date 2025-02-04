import type { ConfigOptions, UploadApiOptions } from 'cloudinary'
import type { CollectionSlug, PayloadRequest, TaskConfig } from 'payload'

import type { CloudinaryFile } from '../types.js'

import { CloudinaryService } from '../services/CloudinaryService.js'

/**
 * Task configuration for updating transformations of a Cloudinary file.
 * This task handles the process of updating transformations for a given image or video in the Cloudinary
 * product environment and ensures that the document's state is updated in the database accordingly.
 *
 * @type {TaskConfig<'updateTransformations'>}
 * @property {string} slug - The unique identifier for the task.
 * @property {Function} handler - The function that handles the task execution by calling the updateTransformations method.
 * @property {Array} inputSchema - The schema defining the input parameters for the task.
 * @property {number} retries - The number of retries allowed for the task.
 */
export const updateTransformationsTask: TaskConfig<'updateTransformations'> = {
  slug: 'updateTransformations',
  handler: async ({ input, req }) => {
    const { collection, configOptions, doc, previousDoc, uploadApiOptions } = input as unknown as {
      collection: CollectionSlug
      configOptions?: ConfigOptions
      doc: CloudinaryFile
      previousDoc: CloudinaryFile | null
      uploadApiOptions?: UploadApiOptions
    }
    const cldService = new CloudinaryService(configOptions, uploadApiOptions)

    // Update transformations
    try {
      const docUpdated = await updateDoc({ collection, doc, hasErrors: false, isProcessing: true, req })

      if (docUpdated) {
        await cldService.updateTransformations({ doc, previousDoc, req })
        await updateDoc({ collection, doc, hasErrors: false, isProcessing: false, req })
      }
    } catch (err) {
      const docUpdated = await updateDoc({ collection, doc, hasErrors: true, isProcessing: false, req })

      // If the underlying file did not change, log the error
      if (docUpdated) {
        req.payload.logger.error({ err, msg: 'Unexpected error in updateTransformations task.' })
      }
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

/**
 * Retrieves a document from the specified collection based on the provided publicId.
 * This function queries the database to find a document in the given collection where the publicId matches the provided value.
 *
 * @param {Object} args - Method arguments.
 * @param {string} args.collection - The name of the collection to query.
 * @param {null | string | undefined} args.publicId - The publicId of the document to retrieve.
 * @param {PayloadRequest} args.req - The request object.
 * @returns {Promise<CloudinaryFile | null>} - A promise that resolves with the retrieved CloudinaryFile document or null if it does not exist.
 */
function getDoc({
  collection,
  publicId,
  req
}: {
  collection: string
  publicId: null | string | undefined
  req: PayloadRequest
}): Promise<CloudinaryFile | null> {
  return req.payload.db.findOne<CloudinaryFile>({
    collection,
    where: {
      publicId: {
        equals: publicId ?? '-1'
      }
    }
  })
}

/**
 * Updates a document in the specified collection based on the provided publicId.
 * This function checks if the document exists in the collection and updates its attributes if found.
 * If the document does not exist, it logs a warning message.
 *
 * @param {Object} args - Method arguments.
 * @param {string} args.collection - The name of the collection to update.
 * @param {CloudinaryFile} args.doc - The document to be updated.
 * @param {boolean} args.hasErrors - Indicates if there are errors in the document.
 * @param {boolean} args.isProcessing - Indicates if the document is being processed.
 * @param {PayloadRequest} args.req - The request object.
 * @returns {Promise<boolean>} - A promise that resolves to true if the document was updated, false otherwise.
 */
async function updateDoc({
  collection,
  doc,
  hasErrors,
  isProcessing,
  req
}: {
  collection: string
  doc: CloudinaryFile
  hasErrors: boolean
  isProcessing: boolean
  req: PayloadRequest
}): Promise<boolean> {
  const existingDoc = await getDoc({ collection, publicId: doc.publicId, req })

  if (existingDoc) {
    await req.payload.db.updateOne({
      collection,
      data: {
        hasErrors,
        isProcessing
      },
      where: {
        publicId: {
          equals: doc.publicId
        }
      }
    })

    return true
  } else {
    req.payload.logger.warn({
      msg: `Unable to update document with publicId ${doc.publicId} as it has been deleted from the database.`
    })
  }

  return false
}
