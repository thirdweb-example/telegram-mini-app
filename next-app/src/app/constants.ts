import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { SmartWalletOptions } from "thirdweb/wallets";

// Replace this with your client ID string
// refer to https://portal.thirdweb.com/typescript/v5/client on how to get a client ID
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

if (!clientId) {
	throw new Error("No client ID provided");
}

export const client = createThirdwebClient({
	clientId: clientId,
});

export const chain = baseSepolia;
export const tokenDropAddress = "0xd64A548A82c190083707CBEFD26958E5e6551D18";
export const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
export const editionDropTokenId = 0n;

export const editionDropContract = getContract({
	address: editionDropAddress,
	chain,
	client,
});

export const tokenDropContract = getContract({
	address: tokenDropAddress,
	chain,
	client,
});

export const accountAbstraction: SmartWalletOptions = {
	chain,
	sponsorGas: true,
};