using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using Thirdweb;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class TelegramIAWCustomAuth : MonoBehaviour
{
    [field: SerializeField]
    private string ServerUrl;

    [field: SerializeField]
    private string EncryptionKey;

    [field: SerializeField]
    private Button WalletButton;

    [field: SerializeField]
    private TMP_Text LogText;

    private void Start()
    {
        Log("Waiting for payload...");
        var url = Application.absoluteURL;
        var uri = new System.Uri(url);
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        var payload = query.Get("payload");
        var payloadDecoded = System.Web.HttpUtility.UrlDecode(payload);
        var payloadObject = JsonConvert.DeserializeObject<Payload>(payloadDecoded);
        Log($"Payload: {JsonConvert.SerializeObject(payloadObject)}");
        ProcessPayload(payloadObject);
    }

    private async void ProcessPayload(Payload payload)
    {
        var connection = new WalletConnection(
            provider: WalletProvider.SmartWallet,
            chainId: ThirdwebManager.Instance.SDK.Session.ChainId,
            personalWallet: WalletProvider.InAppWallet,
            authOptions: new AuthOptions(authProvider: AuthProvider.AuthEndpoint, jwtOrPayload: JsonConvert.SerializeObject(payload), encryptionKey: EncryptionKey)
        );
        Log("Connecting wallet...");
        try
        {
            var address = await ThirdwebManager.Instance.SDK.Wallet.Connect(connection);
            WalletButton.GetComponentInChildren<TMP_Text>().text = address.ShortenAddress();
            WalletButton.onClick.AddListener(() =>
            {
                Application.OpenURL("https://sepolia.arbiscan.io/address/" + address);
            });
            Log("Connected!");
        }
        catch (System.Exception e)
        {
            Log(e.Message);
        }
    }

    private void Log(string message)
    {
        LogText.text = message;
        Debug.Log(message);
    }

    [System.Serializable]
    public class Payload
    {
        public string signature;
        public string message;
    }
}
