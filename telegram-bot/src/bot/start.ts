import { Composer, InlineKeyboard } from 'grammy'
import type { Context } from './context.js'
import { privateKeyToAccount } from 'thirdweb/wallets'
import { createThirdwebClient } from 'thirdweb'
import { config } from 'dotenv' 
config()

const composer = new Composer<Context>()

const feature = composer.chatType('private')

const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
})

feature.command('start', async (ctx) => {
  const username = ctx.from?.id+"";
  const expiration = Date.now() + 600_000; // valid for 10 minutes
  const message = JSON.stringify({
    username,
    expiration,
  });
  const authCode = await adminAccount.signMessage({
    message,
  });
  const keyboard = new InlineKeyboard().webApp('thirdweb App', `${process.env.FRONTEND_APP_ORIGIN}/login/telegram?signature=${authCode}&message=${encodeURI(message)}`);
  return ctx.reply('Pick an app to launch.', { reply_markup: keyboard })
})

export { composer as startFeature }
