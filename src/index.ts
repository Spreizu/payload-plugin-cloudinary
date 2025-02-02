import type { CollectionOptions, PluginOptions } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionSlug } from 'payload'

import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'

import type { CloudinaryStoragePlugin } from './types.js'

import cldStorageAdapter from './adapter/index.js'
import { restoreOriginalDocAttributes } from './hooks/restoreOriginalDocAttributes.js'
import { runJobs } from './hooks/runJobs.js'
import { updateBuiltInAttributes } from './hooks/updateBuiltInAttributes.js'
import { updateDocAttributes } from './hooks/updateDocAttributes.js'
import { CloudinaryService } from './services/CloudinaryService.js'
import { updateTransformationsTask } from './tasks/updateTransformations.js'
import { isObject } from './utils/index.js'

export const cloudinaryStorage: CloudinaryStoragePlugin =
  ({ collections, configOptions, enabled, uploadApiOptions }) =>
  (config) => {
    let cldService: CloudinaryService | null = null

    if (enabled === false) {
      return config
    }

    const getCldService = () => {
      if (cldService) {
        return cldService
      }

      cldService = new CloudinaryService(configOptions, uploadApiOptions)

      return cldService
    }

    const adapter = cldStorageAdapter(getCldService)

    // Add adapter to each collection option object
    const collectionsWithAdapter: PluginOptions['collections'] = Object.entries(collections).reduce(
      (acc, [slug, collOptions]) => ({
        ...acc,
        [slug]: {
          ...(collOptions === true ? {} : collOptions),
          adapter
        }
      }),
      {} as Record<CollectionSlug, CollectionOptions>
    )

    // Update collection config
    config.collections?.map((collection) => {
      if (!(collection.slug in collectionsWithAdapter)) {
        return collection
      }

      return {
        ...collection,
        // Add custom components
        admin: {
          ...collection.admin,
          components: {
            ...(collection.admin?.components ?? {})
            // TODO: Add Media Editor component
          }
        },
        // Add hooks
        hooks: {
          ...(config.hooks ?? {}),
          afterChange: [...(collection.hooks?.afterChange || []), runJobs],
          afterRead: [...(collection.hooks?.afterRead || []), updateBuiltInAttributes(getCldService)],
          beforeChange: [
            ...(collection.hooks?.beforeChange || []),
            restoreOriginalDocAttributes,
            updateDocAttributes(getCldService)
          ]
        },
        // Update upload config
        // Disable local storage, cropping and focal point features,
        // as we're using the Cloudinary Media Editor
        upload: {
          ...(isObject(collection.upload) ? collection.upload : {}),
          crop: false,
          disableLocalStorage: true,
          focalPoint: false
        }
      }
    })

    // Add transformation job
    config.jobs = {
      ...(config.jobs ?? {}),
      tasks: [...(config.jobs?.tasks ?? []), updateTransformationsTask]
    }

    return cloudStoragePlugin({ collections: collectionsWithAdapter })(config)
  }
