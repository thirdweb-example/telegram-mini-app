
![Group 2 (1)](https://github.com/user-attachments/assets/1bb43b44-006d-4a1c-a41b-61eb718d3efd)

# thirdweb Telegram Mini App Example (Unity WebGL Version!)

[<img alt="thirdweb SDK" src="https://img.shields.io/npm/v/thirdweb?label=Thirdweb SDK&style=for-the-badge&logo=npm" height="30">](https://www.npmjs.com/package/thirdweb)
[<img alt="Discord" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=for-the-badge" height="30">](https://discord.gg/thirdweb)

This branch contains `unity-app` - an example Unity WebGL project (2022.3+), and an altered implementation of the original `next-app`.

## This example has been supeseded by the example below using thirdweb's Unity SDK v5

Visit https://github.com/thirdweb-example/unity-telegram to build with v5.

## Set up this project for Unity

Stay on this branch and follow the steps in the [original readme](https://github.com/thirdweb-example/telegram-mini-app/blob/main/README.md) to get setup.

Open the Unity example project, it already has thirdweb's [Unity SDK](https://github.com/thirdweb-dev/unity-sdk) imported.

1. Open `Scene_TelegramExample`

2. Set the client id you previously created in your `ThirdwebManager`

3. Set the `ServerUrl` and `EncryptionKey` in the scene's `TelegramIAWCustomAuth` to your server url and your `NEXT_PUBLIC_AUTH_PHRASE` respectively.

4. Build

5. Copy the Build folder's outputs to this repo's `root/next-app/public/unity-webgl`. (It should have Build, lib, TemplateData and index.html).

That's it, start the bot and you should see Unity load and after a few seconds, your wallet will be connected (default is Smart Wallet on Arbitrum Sepolia).

## How it works

As opposed to the original project, the callback from the telegram bot starting passes the payload to unity through query params for simplicity.

From there, you simply use the Unity SDK's `InAppWallet` + `AuthEndpoint` login!

Note that you must run the Unity build from Telegram for it to work properly.

```csharp
var connection = new WalletConnection(
    provider: WalletProvider.SmartWallet,
    chainId: ThirdwebManager.Instance.SDK.Session.ChainId,
    personalWallet: WalletProvider.InAppWallet,
    authOptions: new AuthOptions(authProvider: AuthProvider.AuthEndpoint, jwtOrPayload: JsonConvert.SerializeObject(payload), encryptionKey: EncryptionKey)
);
var address = await ThirdwebManager.Instance.SDK.Wallet.Connect(connection);
```

![5e7b2d6120c217a46b0b73e99c6cdeb2](https://github.com/user-attachments/assets/caf101be-231e-49b0-acc1-4e499d6c912a)

## Support

For help or feedback, please [visit our support site](https://thirdweb.com/support)
