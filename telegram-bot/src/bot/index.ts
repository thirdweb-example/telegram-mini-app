import { parseMode } from '@grammyjs/parse-mode'
import type { BotConfig, StorageAdapter } from 'grammy'
import { Bot as TelegramBot } from 'grammy'
import { startFeature } from './start.js'
import type { Context, SessionData } from './context.js'
import { createContextConstructor } from './context.js'
import type { Logger } from '../logger.js'
import type { Config } from '../config.js'

interface Dependencies {
  config: Config
  logger: Logger
}

interface Options {
  botSessionStorage?: StorageAdapter<SessionData>
  botConfig?: Omit<BotConfig<Context>, 'ContextConstructor'>
}

function getSessionKey(ctx: Omit<Context, 'session'>) {
  return ctx.chat?.id.toString()
}

export function createBot(token: string, dependencies: Dependencies, options: Options = {}) {
  const {
    config,
    logger,
  } = dependencies

  const bot = new TelegramBot(token, {
    ...options.botConfig,
    ContextConstructor: createContextConstructor({
      logger,
      config,
    }),
  })

  // Middlewares
  bot.api.config.use(parseMode('HTML'))

  // config.isPollingMode && protectedBot.use(sequentialize(getSessionKey))
  // config.isDebug && protectedBot.use(updateLogger())
  // bot.use(autoChatAction(bot.api))
  // bot.use(hydrateReply)
  // bot.use(hydrate())
  // bot.use(session({ getSessionKey, storage: options.botSessionStorage }))

  // Handlers
  bot.use(startFeature)

  return bot
}

export type Bot = ReturnType<typeof createBot>
