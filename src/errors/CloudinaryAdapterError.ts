import { APIError } from 'payload'

export class CloudinaryAdapterError extends APIError {
  constructor(message: string) {
    super(message, 500, undefined, false)
  }
}
