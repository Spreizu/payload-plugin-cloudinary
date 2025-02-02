import { APIError } from 'payload'

export class CloudinaryServiceError extends APIError {
  constructor(message: string) {
    super(message, 500, undefined, false)
  }
}
