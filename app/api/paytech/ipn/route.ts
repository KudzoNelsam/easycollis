import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    // TODO: verify payload signature if needed
    return NextResponse.json({ ok: true, payload });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
