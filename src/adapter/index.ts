import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import type { Field } from 'payload'

import type { CloudinaryService } from '../services/CloudinaryService.js'

import { getGenerateURL } from './generateURL.js'
import { getHandleDelete } from './handleDelete.js'
import { getHandleUpload } from './handleUpload.js'
import { getStaticHandler } from './staticHandler.js'

export default function cldStorageAdapter(getCldService: () => CloudinaryService): Adapter {
  return ({ collection }): GeneratedAdapter => {
    const fields = getFields(getCldService)

    return {
      name: 'cloudinary',
      fields,
      generateURL: getGenerateURL({ getCldService }),
      handleDelete: getHandleDelete({ getCldService }),
      handleUpload: getHandleUpload({ collection, getCldService }),
      staticHandler: getStaticHandler({ collection })
    }
  }
}

/**
 * Generates an array of field configurations for Cloudinary storage options.
 *
 * @param {CloudinaryService} getCldService - An instance of CloudinaryService configured with the specified options.
 * @returns {Field[]} An array of field configurations.
 */
function getFields(getCldService: () => CloudinaryService): Field[] {
  return [
    {
      name: 'publicId',
      type: 'text',
      admin: { hidden: true, readOnly: true },
      index: true
    },
    {
      name: 'customFilename',
      type: 'text'
    },
    {
      name: 'resourceType',
      type: 'select',
      admin: { hidden: true, readOnly: true },
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Raw', value: 'raw' },
        { label: 'Auto', value: 'auto' }
      ]
    },
    {
      name: 'rawTransformations',
      type: 'json',
      admin: { hidden: true, readOnly: true },
      defaultValue: []
    },
    {
      name: 'format',
      type: 'text',
      admin: { hidden: true, readOnly: true }
    },
    {
      name: 'isProcessing',
      type: 'checkbox',
      admin: { hidden: true, readOnly: true },
      defaultValue: false
    },
    {
      name: 'hasErrors',
      type: 'checkbox',
      admin: { hidden: true, readOnly: true },
      defaultValue: false
    },
    {
      name: 'secureURL',
      type: 'text',
      admin: { hidden: true, readOnly: true },
      hooks: {
        afterRead: [({ originalDoc }) => getCldService().getSecureURL(originalDoc)]
      },
      virtual: true
    },
    {
      name: 'downloadURL',
      type: 'text',
      admin: { hidden: true, readOnly: true },
      hooks: {
        afterRead: [({ originalDoc }) => getCldService().getSecureURL(originalDoc, true)]
      },
      virtual: true
    }
  ]
}
