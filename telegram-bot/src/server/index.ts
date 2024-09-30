import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { serve } from '@hono/node-server'
import { webhookCallback } from 'grammy'
import { getPath } from 'hono/utils/url'
import { requestId } from './middlewares/request-id.js'
import { setLogger } from './middlewares/logger.js'
import type { Env } from './environment.js'
import type { Bot } from '../bot/index.js'
import { requestLogger } from './middlewares/request-logger.js'
import type { Logger } from '../logger.js'
import type { Config } from '../config.js'

interface Dependencies {
  bot: Bot
  config: Config
  logger: Logger
}

export function createServer(dependencies: Dependencies) {
  const {
    bot,
    config,
    logger,
  } = dependencies

  const server = new Hono<Env>()

  server.use(requestId())
  server.use(setLogger(logger))
  if (config.isDebug)
    server.use(requestLogger())

  server.onError(async (error, c) => {
    if (error instanceof HTTPException) {
      if (error.status < 500)
        c.var.logger.info(error)
      else
        c.var.logger.error(error)

      return error.getResponse()
    }

    // unexpected error
    c.var.logger.error({
      err: error,
      method: c.req.raw.method,
      path: getPath(c.req.raw),
    })
    return c.json(
      {
        error: 'Oops! Something went wrong.',
      },
      500,
    )
  })

  server.get('/', c => c.json({ status: true }))

  if (config.isWebhookMode) {
    server.post(
      '/webhook',
      webhookCallback(bot, 'hono', {
        secretToken: config.botWebhookSecret,
      }),
    )
  }

  return server
}

export type Server = Awaited<ReturnType<typeof createServer>>

export function createServerManager(server: Server, options: { host: string, port: number }) {
  let handle: undefined | ReturnType<typeof serve>
  return {
    start() {
      return new Promise<{ url: string }>((resolve) => {
        handle = serve(
          {
            fetch: server.fetch,
            hostname: options.host,
            port: options.port,
          },
          info => resolve({
            url: info.family === 'IPv6'
              ? `http://[${info.address}]:${info.port}`
              : `http://${info.address}:${info.port}`,
          }),
        )
      })
    },
    stop() {
      return new Promise<void>((resolve) => {
        if (handle)
          handle.close(() => resolve())
        else
          resolve()
      })
    },
  }
}
