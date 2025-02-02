import type { HandleDelete } from '@payloadcms/plugin-cloud-storage/types'

import type { CloudinaryService } from '../services/CloudinaryService.js'

type GetHandleDeleteArgs = {
  getCldService: () => CloudinaryService
}

export const getHandleDelete = ({ getCldService }: GetHandleDeleteArgs): HandleDelete => {
  return async ({ doc, req }) => {
    // Only handle direct DELETE requests. Replacements for files are handled in `handleUpload`.
    if (req.method !== 'DELETE') {
      return
    }

    await getCldService().delete({
      file: doc,
      invalidate: true,
      req
    })
  }
}
