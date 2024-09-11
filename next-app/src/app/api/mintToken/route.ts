import { NextResponse } from "next/server";

const {
  BACKEND_WALLET_ADDRESS,
  NFT_CONTRACT_ADDRESS,
  ENGINE_URL,
  THIRDWEB_SECRET_KEY,
} = process.env;

async function checkTransactionStatus(queueId: string): Promise<boolean> {
  const statusResponse = await fetch(`${ENGINE_URL}/transaction/status/${queueId}`, {
    headers: {
      Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
    },
  });

  if (statusResponse.ok) {
    const statusData = await statusResponse.json();
    return statusData.result.status === 'mined';
  }
  return false;
}

async function pollTransactionStatus(queueId: string, maxAttempts = 15, interval = 3000): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const isMined = await checkTransactionStatus(queueId);
    if (isMined) return true;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  return false;
}

export async function POST(request: Request) {
  if (
    !BACKEND_WALLET_ADDRESS ||
    !NFT_CONTRACT_ADDRESS ||
    !ENGINE_URL ||
    !THIRDWEB_SECRET_KEY
  ) {
    throw 'Server misconfigured. Did you forget to add a ".env.local" file?';
  }

  const { userWalletAddress, amount } = await request.json();

  const resp = await fetch(
    `${ENGINE_URL}/contract/sepolia/${NFT_CONTRACT_ADDRESS}/erc20/mint-to`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
        "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
      },
      body: JSON.stringify({
        toAddress: userWalletAddress,
        amount: amount,
      }),
    }
  );

  if (resp.ok) {
    const data = await resp.json();
    const queueId = data.result.queueId;

    const isMined = await pollTransactionStatus(queueId);

    if (isMined) {
      return NextResponse.json({ message: "Transaction mined successfully!", queueId });
    } else {
      return NextResponse.json({ message: "Transaction not mined within the timeout period.", queueId }, { status: 408 });
    }
  } else {
    const errorText = await resp.text();
    console.error("[DEBUG] not ok", errorText);
    return NextResponse.json({ message: "Failed to initiate transaction", error: errorText }, { status: 500 });
  }
}