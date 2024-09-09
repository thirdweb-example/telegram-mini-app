import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia, defineChain } from "thirdweb/chains";
import { inAppWallet, SmartWalletOptions } from "thirdweb/wallets";

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

export const wallet = inAppWallet({
	smartAccount: {
		sponsorGas: true,
		chain: chain
	}
});

export const tokenDropAddress = "0xd64A548A82c190083707CBEFD26958E5e6551D18";
export const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
export const editionDropTokenId = 0n;
export const oeNFTAddress = "0xC28202BF7076B8C18BDE211AE371Ff674DadD7BE";

export const oeNFTContract = getContract({
	address: oeNFTAddress,
	chain: defineChain(8333),
	client,
});

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