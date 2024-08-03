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
        StartCoroutine(FetchPayload());
        Log("Waiting for payload...");
    }

    private IEnumerator FetchPayload()
    {
        string username = GetUsernameFromUrl();
        if (string.IsNullOrEmpty(username))
        {
            Log("No username found in URL");
            yield break;
        }

        using UnityWebRequest request = UnityWebRequest.Get(ServerUrl + $"/api/storePayload?username={username}");
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Log("Error fetching payload: " + request.error);
            yield break;
        }

        var result = JsonConvert.DeserializeObject<Dictionary<string, string>>(request.downloadHandler.text);
        if (result.ContainsKey("payload"))
        {
            var payload = result["payload"];
            ReceivePayload(payload);
        }
        else
        {
            Log("No payload found");
        }
    }

    private string GetUsernameFromUrl()
    {
        var url = Application.absoluteURL;
        var uri = new System.Uri(url);
        var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
        return query.Get("username");
    }

    public void ReceivePayload(string payload)
    {
        var payloadObject = JsonConvert.DeserializeObject<Payload>(payload);
        ProcessPayload(payloadObject);
    }

    private async void ProcessPayload(Payload payload)
    {
        var connection = new WalletConnection(
            provider: WalletProvider.InAppWallet,
            chainId: 1,
            authOptions: new AuthOptions(authProvider: AuthProvider.AuthEndpoint, jwtOrPayload: JsonConvert.SerializeObject(payload), encryptionKey: EncryptionKey)
        );
        Log("Connecting wallet...");
        try
        {
            var address = await ThirdwebManager.Instance.SDK.Wallet.Connect(connection);
            WalletButton.GetComponentInChildren<TMP_Text>().text = address.ShortenAddress();
            WalletButton.onClick.AddListener(() =>
            {
                Application.OpenURL("https://etherscan.io/address/" + address);
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
