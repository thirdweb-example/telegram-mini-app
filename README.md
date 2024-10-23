
![Group 2 (1)](https://github.com/user-attachments/assets/1bb43b44-006d-4a1c-a41b-61eb718d3efd)

# thirdweb Telegram Mini App Example

[<img alt="thirdweb SDK" src="https://img.shields.io/npm/v/thirdweb?label=Thirdweb SDK&style=for-the-badge&logo=npm" height="30">](https://www.npmjs.com/package/thirdweb)
[<img alt="Discord" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=for-the-badge" height="30">](https://discord.gg/thirdweb)

Authenticate your users and generate a smart wallet without ever leaving Telegram. This example app showcases thirdweb's custom authentication and smart accounts from within a Telegram mini app.

> [!IMPORTANT]  
> Due to Google's security policies, Google OAuth does not work in Telegram mini-apps.

## Getting Started

> This project assumes some basic knowledge of TypeScript, Next.js App Router, and [Connect SDK](https://portal.thirdweb.com/typescript/v5).

## Environment Variables

1. Create your `.env` by running `cp .env.example .env` in both the `/next-app` and `/telegram-bot` directories.

2. Create a client ID from the [thirdweb dashboard](https://thirdweb.com/dashboard/settings/api-keys) and add it to your `.env` as `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`. Follow the instructions in each `.env` file to set up your environment variables.

## Set the authentication endpoint

This project uses a powerful thirdweb feature called [Authentication Endpoints](https://portal.thirdweb.com/connect/in-app-wallet/custom-auth/custom-auth-server). It uses your own API endpoint to generate a wallet for users on successful authentication. All the code for this is written for you in this project, you'll just need to set the endpoint in your thirdweb dashboard.

> To use Custom Authentication Endpoints, you'll need to be on the Growth Plan. If you have questions about the plan options or want to try it out, [reach out to our team](https://thirdweb.com/contact-us).

Navigate to the [In-App Wallets](https://thirdweb.com/dashboard/connect/in-app-wallets) page on the dashboard and select your project from the dropdown. **This should be the same project your `clientId` is from.** Then click the **"Configuration" tab** and scroll down to "Custom Authentication Endpoint" and enable the toggle. You'll then see a field to enter your endpoint.

<img width="1196" alt="Screenshot 2024-08-02 at 2 24 00 AM" src="https://github.com/user-attachments/assets/7cd1201f-1928-4fbc-8b8c-62c9cbe92833">

While testing the project locally, you'll need a publicly exposed endpoint to authenticate through. We recommend using a tool like [ngrok](https://ngrok.com/product/secure-tunnels) to create a public endpoint that forwards traffic to your local server. Forward your traffic to `http://localhost:3000` (where your app will run locally).

Once you have your ngrok or similar endpoint, add it to the Authentication Endpoint field as `[YOUR FORWARDING ENDPOINT]/api/auth/telegram`, the route this app uses to perform authentication.

You're now ready to run the project!

> **When you deploy to production (or any live URL), you'll modify this authentication endpoint to be your actual live URL. You could also create a separate thirdweb project for local development and production.**

### Run the project

You're now ready to test the project! First, you'll need to install the dependencies. Run the following command in both the `/next-app` and `/telegram-bot` directories:

```bash
pnpm install
```

Now, run `pnpm dev` in both the `/next-app` and `/telegram-bot` directories. This will start the Next.js app and the Telegram bot.

You should see the app at http://localhost:3000. Try messaging the `/start` command to the bot you configured with the Bot Father in Telegram.

When you press "thirdweb App", your mini app should open and a wallet should be generated for you.

### Going to production

Once you've implemented this flow into your own app, there are a few changes you'll need to make to go to production.

Remember to go to your project in the [In-App Wallets](https://thirdweb.com/dashboard/connect/in-app-wallets) configuration tab and update the auth endpoint to be `[YOUR PRODUCTION URL]/api/auth/telegram` which is the URL to the Next.js app. In this case, do include `https://` in the URL.

The `/telegram-bot` is a simple Node.js project that is using Telegram polling (not webhooks) and thus cannot run in a serverless environment like Vercel. If you want to run this in a serverless environment, you'll need to switch to using webhooks and make the necessary changes to `index.ts` to handle the webhook events.

Now, you're ready to deploy your app and Telegram bot to production!

## How it works

All the logic for this example can be found in `telegram-bot/src/bot/start.ts`, `/next-app/src/app/api/auth/telegram/route.ts`, and `/next-app/src/app/login/telegran/page.tsx`.

When a user requests a new link to the app, we generate a unique signature for them based on their telegram ID and the current time. This signature can then be verified in your Next.js app's backend. This is how the user will authenticate their telegram profile, no password or extra login steps required!

```ts
const adminAccount = privateKeyToAccount({
  privateKey: process.env.ADMIN_SECRET_KEY as string,
  client: createThirdwebClient({ clientId: process.env.THIRDWEB_CLIENT_ID as string }),
});

// ...

const username = ctx.from?.id+"";
const expiration = Date.now() + 600_000; // valid for 10 minutes
const message = JSON.stringify({
    username,
    expiration
});
const authCode = await adminAccount.signMessage({
    message
});
```

When the user clicks their unique login link, they're first sent to `/login/telegram` to be authenticated. When the user lands on this page, the search parameters are immediately send to your custom authentication endpoint for verification (we'll look at how that works next). If the user is successfully authenticated, the wallet will connect. Otherwise, the connection will fail. Because of the seamless login experience with Telegram, normal users will never face a failed login. Everything happens seamlessly behind the scenes without passwords or one-time codes.

```ts
const { connect } = useConnect();

await connect(async () => {
    
    await wallet.connect({
        client,
        strategy: "auth_endpoint",
        payload: JSON.stringify({
            signature: searchParams.signature,
            message: searchParams.message,
        }),
        encryptionKey: process.env.NEXT_PUBLIC_AUTH_PHRASE as string,
    });
    return wallet;
});
```

The backend authentication sends a POST request with the signature and message to the `/api/auth/telegram` endpoint. There, we use the same admin account to verify the original signature and expiration time (to prevent replay attacks). If the signature is valid, we can trust that we verified this user form within our Telegram bot. We return a unique `userId` to generate their wallet, which in this case is their Telegram username.

```ts
export async function verifyTelegram(signature: string, message: string) {
    const metadata = JSON.parse(message);
    
    if (!metadata.expiration || metadata.expiration < Date.now()) {
        return false;
    }

    if (!metadata.username) {
        return false;
    }

    const isValid = await verifySignature({
        client,
        address: adminAccount.address,
        message: message,
        signature,
    });

    if (!isValid) {
        return false;
    }

    return metadata.username;
}
```

Now that the user is connected, they'll be redirected to the homepage where they can use their wallet in your app.

## Documentation

-   [TypeScript SDK](https://portal.thirdweb.com/typescript/v5)
-   [Next.js Docs](https://nextjs.org/docs)

## Support

For help or feedback, please [visit our support site](https://thirdweb.com/support)
