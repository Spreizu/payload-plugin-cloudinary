import type { CollectionAfterChangeHook, PayloadRequest } from 'payload'

import type { CloudinaryFile } from '../types.js'

/**
 * Executes Cloudinary jobs after a change in the File collection using Payload's job runner.
 * This function ensures that Cloudinary transformations are updated
 * when files are added, replaced, or when transformations are modified by the user.
 *
 * @param {Object} args - Method arguments.
 * @param {PayloadRequest} args.req - The request object.
 * @returns {void}
 */
export const runJobs: CollectionAfterChangeHook<CloudinaryFile> = ({ req }: { req: PayloadRequest }): void => {
  void req.payload.jobs.run({
    queue: 'cloudinary'
  })
}
