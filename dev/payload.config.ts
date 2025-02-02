import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { cloudinaryStorage } from 'payload-plugin-cloudinary'
import { fileURLToPath } from 'url'

import { devUser } from './helpers/credentials.js'
import { testEmailAdapter } from './helpers/testEmailAdapter.js'
import { seed } from './seed.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

export default buildConfig({
  admin: {
    autoLogin: devUser,
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [
    {
      slug: 'posts',
      fields: []
    },
    {
      slug: 'media',
      fields: [],
      upload: {
        displayPreview: true
      }
    }
  ],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || ''
  }),
  editor: lexicalEditor(),
  email: testEmailAdapter,
  onInit: async (payload) => {
    await seed(payload)
  },
  plugins: [
    cloudinaryStorage({
      collections: {
        media: true
      },
      configOptions: {
        api_key: process.env.CLOUDINARY_API_KEY || 'test-key',
        api_secret: process.env.CLOUDINARY_API_SECRET || 'test-secret',
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'test-cloud-name'
      },
      uploadApiOptions: {
        folder: process.env.CLOUDINARY_FOLDER || 'test-folder'
      }
    })
  ],
  secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  }
})
