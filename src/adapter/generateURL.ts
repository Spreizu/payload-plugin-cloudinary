import type { GenerateURL } from '@payloadcms/plugin-cloud-storage/types'

import type { CloudinaryService } from '../services/CloudinaryService.js'

type GenerateURLArgs = {
  getCldService: () => CloudinaryService
}

export const getGenerateURL =
  ({ getCldService }: GenerateURLArgs): GenerateURL =>
  ({ data }) => {
    return getCldService().getSecureURL(data) ?? data?.url
  }
