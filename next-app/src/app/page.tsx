"use client";
import Image from "next/image";
import { useActiveAccount } from "thirdweb/react";
import thirdwebIcon from "@public/thirdweb.svg";
import { shortenAddress } from "thirdweb/utils";
import { Button } from "@headlessui/react";
import { client, wallet } from "./constants";
import { AutoConnect } from "thirdweb/react";
import Link from "next/link";


export default function Home() {
  const account = useActiveAccount();
  
  return (
    <main className="p-4 pb-10 min-h-[100vh] flex items-center justify-center container max-w-screen-lg mx-auto">
      <div className="py-20">
        <Header />
        <AutoConnect client={client} wallets={[wallet]}/>
        <div className="flex justify-center mb-20">
          {account ? 
            (
            <> 
            <Button onClick={() => (window as any).Telegram.WebApp.openLink(`https://etherscan.io/address/${account.address}`)} className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">Smart Account: {shortenAddress(account.address)}</Button>  
            </>
            ) 
          : (
              <p className="text-sm text-zinc-400">Smart Account Not Connected</p>
            )}      
        </div>

        <Menu />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center mb-20 md:mb-20">
      <Image
        src={thirdwebIcon}
        alt=""
        className="size-[150px] md:size-[150px]"
        style={{
          filter: "drop-shadow(0px 0px 24px #a726a9a8)",
        }}
      />

      <h1 className="text-2xl md:text-6xl font-semibold md:font-bold tracking-tighter mb-6 text-zinc-100">
        thirdweb SDK
        <span className="text-zinc-300 inline-block mx-1"> + </span>
        <span className="inline-block text-blue-500"> Telegram </span>
      </h1>

      <p className="text-zinc-300 text-base">
        Read the{" "}
        <code className="bg-zinc-800 text-zinc-300 px-2 rounded py-1 text-sm mx-1">
          README.md
        </code>{" "}
        file to get started.
      </p>
    </header>
  );
}

function Menu() {
	return (
		<div className="grid gap-4 lg:grid-cols-3 justify-center">
			<MenuItem
				title="Sponsored transactions"
				href="/gasless"
				description="Execute transactions without requiring users to hold ETH."
			/>
      <MenuItem
				title="Pay"
				href="/pay"
				description="Allow users to purchase NFT's using fiat"
			/>
		</div>
	);
}

function MenuItem(props: { title: string; href: string; description: string }) {
	return (
		<Link
			href={props.href}
			className="flex flex-col border border-zinc-800 p-4 rounded-lg hover:bg-zinc-900 transition-colors hover:border-zinc-700"
		>
			<article>
				<h2 className="text-lg font-semibold mb-2">{props.title}</h2>
				<p className="text-sm text-zinc-400">{props.description}</p>
			</article>
		</Link>
	);
}

