import type { CloudinaryFile } from '../types.js'

/**
 * Retrieves the dimensions of a media file from a CloudinaryFile document.
 * This function calculates the width and height of the media file, taking into account any crop transformations.
 *
 * @param {CloudinaryFile} doc - The CloudinaryFile document containing the media file information.
 * @returns {{ height: number, width: number }} - An object containing the width and height of the media file.
 */
export function getMediaDimensions(doc: CloudinaryFile): {
  height: CloudinaryFile['height']
  width: CloudinaryFile['width']
} {
  const rawTransformations = Array.isArray(doc.rawTransformations)
    ? (doc.rawTransformations as unknown as string[])
    : []

  let { height, width } = doc

  for (const transformation of rawTransformations) {
    if (transformation.startsWith('c_crop')) {
      const cropWidth = transformation.match(/w_(\d+)/)
      const cropHeight = transformation.match(/h_(\d+)/)

      if (cropWidth) {
        width = parseInt(cropWidth[1], 10)
      }

      if (cropHeight) {
        height = parseInt(cropHeight[1], 10)
      }
    }
  }

  return { height, width }
}
