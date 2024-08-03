// src/app/api/storePayload/route.ts

import { NextRequest, NextResponse } from "next/server";

const payloadStore: Record<string, string> = {};

export async function POST(request: NextRequest) {
  const { signature, message } = await request.json();
  const { username } = JSON.parse(message);

  if (!username) {
    return NextResponse.json(
      { error: "No username provided" },
      { status: 400 }
    );
  }

  payloadStore[username] = JSON.stringify({ signature, message });
  console.log(`Stored payload for ${username}:`, payloadStore[username]);

  return NextResponse.json({
    username,
    message: "Payload stored successfully",
  });
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");
  console.log(`Fetching payload for username: ${username}`);

  if (username && payloadStore[username]) {
    const payload = payloadStore[username];
    delete payloadStore[username]; // Clear the stored payload after retrieval
    console.log(`Returning payload for ${username}:`, payload);
    return NextResponse.json({ payload });
  } else {
    console.log(`No payload found for ${username}`);
    return NextResponse.json({ message: "No payload found" }, { status: 404 });
  }
}
