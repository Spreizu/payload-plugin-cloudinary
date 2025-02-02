import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'

import type { CloudinaryFile } from '../types.js'

type GetStaticHandlerArgs = {
  collection: CollectionConfig
}

export const getStaticHandler = ({ collection }: GetStaticHandlerArgs): StaticHandler => {
  return async (req, { params: { filename } }) => {
    try {
      // Obtain retrievedDoc to access the file properties and verify its existence
      const result = await req.payload.find({
        collection: collection.slug,
        pagination: false,
        req,
        where: {
          filename: {
            equals: filename
          }
        }
      })

      if (result.docs.length === 0) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const retrievedDoc = result.docs[0] as unknown as CloudinaryFile

      if (!retrievedDoc.downloadURL || retrievedDoc.downloadURL.trim() === '') {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      // If the request originates from Node, simulate the response to prevent downloading the entire file from
      // Cloudinary, since we only need to modify some field values
      const isRequestedByNode = req.headers.get('user-agent') === 'node'

      if (isRequestedByNode) {
        req.payload.logger.debug('File request originates from Node, simulating a successful response.')
        const blob = getEmptyFile()

        return new Response(blob, {
          headers: new Headers({
            'Content-Length': String(blob.size),
            'Content-Type': blob.type
          }),
          status: 200
        })
      }

      // In other cases fetch the file from Cloudinary
      const response = await fetch(retrievedDoc.downloadURL)

      if (!response.ok) {
        return new Response(null, { status: 404, statusText: 'Not Found' })
      }

      const blob = await response.blob()

      const etagFromHeaders = req.headers.get('etag') || req.headers.get('if-none-match')
      const objectEtag = response.headers.get('etag') as string

      if (etagFromHeaders && etagFromHeaders === objectEtag) {
        return new Response(null, {
          headers: new Headers({
            'Content-Length': String(blob.size),
            'Content-Type': blob.type,
            ETag: objectEtag
          }),
          status: 304
        })
      }

      return new Response(blob, {
        headers: new Headers({
          'Content-Length': String(blob.size),
          'Content-Type': blob.type,
          ETag: objectEtag
        }),
        status: 200
      })
    } catch (err) {
      req.payload.logger.error({ err, msg: 'Unexpected error in staticHandler' })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Creates an empty binary file.
 * This function generates a Blob object representing an empty file.
 *
 * @returns {Blob} - A Blob object representing an empty file with the specified MIME type.
 */
function getEmptyFile(): Blob {
  const filesize = 0
  const mimeType = 'application/octet-stream'

  const fileData = new Uint8Array(filesize)
  return new Blob([fileData], { type: mimeType })
}
