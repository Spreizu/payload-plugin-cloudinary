import type { CloudinaryFile, MediaType } from '../types.js'

/**
 * Checks if the given resource type is a valid media type.
 * This function ensures that the resource type is either 'image' or 'video'.
 *
 * @template T - The type of the resource.
 * @param {T} resourceType - The resource type to be checked.
 * @returns {boolean} - Returns true if the resource type is 'image' or 'video', false otherwise.
 */
export function isMediaType<T extends CloudinaryFile['resourceType']>(resourceType: T): resourceType is MediaType & T {
  return resourceType === 'image' || resourceType === 'video'
}
