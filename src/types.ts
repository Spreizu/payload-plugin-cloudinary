import type { CollectionOptions, TypeWithPrefix } from '@payloadcms/plugin-cloud-storage/types'
import type { ConfigOptions, UploadApiOptions } from 'cloudinary'
import type { FileData, Plugin, TypeWithID, UploadCollectionSlug } from 'payload'

export type CloudinaryStorageTransformationOptions = {
  images?: {
    /**
     * Array of image formats for which transformations will be generated.
     * Include every format you want to support.
     *
     * Defaults are chosen to support the most widely used browsers in
     * automatic format selection mode (f_auto).
     *
     * @default ['jp2', 'webp']
     */
    formats?: string[]
  }
  videos: {
    // TODO: implement video formats
    formats: string[]
  }
}

export type CloudinaryStoragePluginOptions = {
  /**
   * Collection options to apply the adapter to.
   */
  collections: Partial<Record<UploadCollectionSlug, Omit<CollectionOptions, 'adapter'> | true>>

  /**
   * Cloudinary configuration options.
   *
   * @default { secure: true }
   */
  configOptions: ConfigOptions

  /**
   * Whether to enable the plugin.
   *
   * Default: `true`
   */
  enabled?: boolean

  /**
   * Options for image and video file transformations.
   */
  transformationOptions?: CloudinaryStorageTransformationOptions

  /**
   * Cloudinary upload API options.
   * This can be used to specify additional options for file uploads.
   * For example, you can use the `folder` attribute to organize assets within your Cloudinary product environment.
   */
  uploadApiOptions?: UploadApiOptions
}

export type CloudinaryStoragePlugin = (pluginOptions: CloudinaryStoragePluginOptions) => Plugin

/**
 * Resource types which are categorized as media types.
 */
export type MediaType = 'image' | 'video'

/**
 * Media collection type with our custom fields.
 */
export type CloudinaryFile = {
  customFilename?: null | string
  downloadURL?: null | string
  format?: null | string
  hasErrors?: boolean | null
  isProcessing?: boolean | null
  placeholder?: null | string
  publicId?: null | string
  rawTransformations?:
    | {
        [k: string]: unknown
      }
    | boolean
    | null
    | number
    | string
    | unknown[]
  resourceType?: ('auto' | 'image' | 'raw' | 'video') | null
  secureURL?: null | string
  thumbnailURL?: null | string // This is added by Payload, but does not exist in any of their types
} & FileData &
  TypeWithID &
  TypeWithPrefix
