
![Group 2 (1)](https://github.com/user-attachments/assets/1bb43b44-006d-4a1c-a41b-61eb718d3efd)

# thirdweb Telegram Mini App Example (Unity WebGL Version!)

[<img alt="thirdweb SDK" src="https://img.shields.io/npm/v/thirdweb?label=Thirdweb SDK&style=for-the-badge&logo=npm" height="30">](https://www.npmjs.com/package/thirdweb)
[<img alt="Discord" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=for-the-badge" height="30">](https://discord.gg/thirdweb)

## Set up this project for Unity

Follow the steps in the [original readme](https://github.com/thirdweb-example/telegram-mini-app/blob/main/README.md).

## What now?

```bash
cd unity-app
```

Open the Unity example project, it already has thirdweb's [Unity SDK](https://github.com/thirdweb-dev/unity-sdk) imported.

1. Open `Scene_TelegramExample`

2. Set the client id you previously created in your `ThirdwebManager`

3. Set your `ServerUrl` and `EncryptionKey` to your server url and your `NEXT_PUBLIC_AUTH_PHRASE` respectively.

4. Build

5. Copy the Build folder's outputs to this repo's `root/next-app/public/unity-webgl`.

That's it, start the bot and you should see Unity load and after a few seconds, your wallet will be connected.

## How it works

As opposed to the original project, the callback from the telegram bot starting now stores the auth token for that user in local storage temporarily.

A few seconds later Unity will query it and it'll be consumed.

From there, you simply use the Unity SDK's `InAppWallet` + `AuthEndpoint` login!

```csharp
var connection = new WalletConnection(
    provider: WalletProvider.InAppWallet,
    chainId: 1,
    authOptions: new AuthOptions(authProvider: AuthProvider.AuthEndpoint, jwtOrPayload: JsonConvert.SerializeObject(payload), encryptionKey: EncryptionKey)
);
var address = await ThirdwebManager.Instance.SDK.Wallet.Connect(connection);
```

## Support

For help or feedback, please [visit our support site](https://thirdweb.com/support)
