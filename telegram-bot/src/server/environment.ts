import type { Logger } from '../logger.js'

export interface Env {
  Variables: {
    requestId: string
    logger: Logger
  }
}
