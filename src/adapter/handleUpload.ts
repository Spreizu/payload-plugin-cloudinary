import type { HandleUpload } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig, PayloadRequest } from 'payload'

import type { CloudinaryService } from '../services/CloudinaryService.js'
import type { CloudinaryFile } from '../types.js'

import { CloudinaryAdapterError } from '../errors/index.js'
import { getFileExtensionByMimeType, getFileExtensionByName, isObject } from '../utils/index.js'

type GetHandleUploadArgs = {
  collection: CollectionConfig
  getCldService: () => CloudinaryService
}

export const getHandleUpload = ({ collection, getCldService }: GetHandleUploadArgs): HandleUpload => {
  return async ({ data, file, req }) => {
    const doc: CloudinaryFile = data
    const previousDoc = await getPreviousDoc({ collection, doc, req })
    const uploadResponse = await getCldService().upload({ file, req })
    const customFilename =
      (doc.customFilename || doc.filename?.substring(0, doc.filename?.lastIndexOf('.')) || doc.filename) ?? ''

    // Update doc
    Object.assign(doc, {
      customFilename,
      filesize: uploadResponse.bytes,
      format: uploadResponse.format ?? getFileExtensionByMimeType(doc.mimeType) ?? getFileExtensionByName(doc.filename),
      height: uploadResponse.height,
      isProcessing: true,
      publicId: uploadResponse.public_id,
      rawTransformations: [], // Ensure transformations are reset when the file is replaced
      resourceType: uploadResponse.resource_type,
      url: uploadResponse.secure_url,
      width: uploadResponse.width
    })

    // Queue transformations task
    await req.payload.jobs.queue({
      input: {
        collection: collection.slug,
        configOptions: getCldService().getConfigOptions(),
        doc: structuredClone({ ...doc }),
        previousDoc: isObject(previousDoc) ? structuredClone({ ...previousDoc }) : null,
        uploadApiOptions: getCldService().getUploadApiOptions()
      },
      queue: 'cloudinary',
      task: 'updateTransformations'
    })

    // Delete the old file from Cloudinary in case the user replaced it with a new one.
    if (previousDoc?.publicId && previousDoc?.publicId !== doc.publicId) {
      try {
        await getCldService().delete({
          file: previousDoc,
          invalidate: true,
          req
        })
      } catch {
        // Non-fatal, warning/error will get logged by the delete function
      }
    }
  }
}

/**
 * Retrieves the previous version of a document from the database if the request method is 'PATCH'.
 *
 * @param {Object} args - Method arguments.
 * @param {CollectionConfig} args.collection - The collection configuration object.
 * @param {CloudinaryFile} args.doc - The current document for which the previous version is to be retrieved.
 * @param {PayloadRequest} args.req - The request object.
 * @returns {Promise<CloudinaryFile | null>} - A promise that resolves to the previous version of the document or null if not found.
 * @throws {CloudinaryAdapterError} - Throws an error if the previous document is not found.
 */
async function getPreviousDoc({
  collection,
  doc,
  req
}: {
  collection: CollectionConfig
  doc: CloudinaryFile
  req: PayloadRequest
}): Promise<CloudinaryFile | null> {
  let previousDoc: CloudinaryFile | null = null

  if (req.method === 'PATCH') {
    previousDoc = await req.payload.db.findOne<CloudinaryFile>({
      collection: collection.slug,
      req,
      where: {
        publicId: {
          equals: doc.publicId
        }
      }
    })

    if (!previousDoc) {
      throw new CloudinaryAdapterError('Failed to find previousDoc')
    }
  }

  return previousDoc
}
