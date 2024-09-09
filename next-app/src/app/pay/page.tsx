"use client";
import type React from "react";
import {getNFT, balanceOf, claimTo} from "thirdweb/extensions/erc721";
import {
	MediaRenderer,
	PayEmbed,
	useActiveAccount,
	useReadContract,
} from "thirdweb/react";
import {
	client,
	oeNFTContract
} from "../constants";
import Link from "next/link";

const PayHome: React.FC = () => {
	const smartAccount = useActiveAccount();
	const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
		contract: oeNFTContract,
		tokenId: 1n,
	});
	const { data: ownedNfts } = useReadContract(balanceOf, {
		contract: oeNFTContract,
		owner: smartAccount?.address!,
		queryOptions: { enabled: !!smartAccount },
	});
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-12 text-zinc-100">
				Purchase NFT with Fiat
			</h1>
			<div className="flex flex-col">
				{isNftLoading ? (
					<div className="w-full mt-24">Loading...</div>
				) : (
					<>
						{smartAccount ? (
							<>
								<p className="font-semibold text-center mb-2">
									You own {ownedNfts?.toString() || "0"}{" "}
									Game Passes
								</p>
								<PayEmbed
									client={client}
									payOptions={{
										mode: "transaction",
										buyWithFiat: {
											testMode: true,
										}, 
										transaction: claimTo({
											contract: oeNFTContract,
											quantity: 1n,
											to: smartAccount?.address,
										}),
										metadata: nft?.metadata,
									}}
								/>
							</>
						) : (
							<p
								style={{
									textAlign: "center",
									width: "100%",
									marginTop: "10px",
								}}
							>
								Login to claim this Game Pass!
							</p>
						)}
					</>
				)}
			</div>
			<Link href={"/"} className="text-sm text-gray-400 mt-8">
				Back to menu
			</Link>
		</div>
	);
};

export default PayHome;
