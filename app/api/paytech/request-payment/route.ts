import { NextResponse } from "next/server";

export const runtime = "nodejs";

type PaytechRequest = {
  amount: number;
  currency: string;
  ref: string;
  itemName: string;
  email: string;
  successUrl: string;
  cancelUrl: string;
  ipnUrl: string;
  customField?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PaytechRequest;

    if (
      !body.amount ||
      !body.currency ||
      !body.ref ||
      !body.itemName ||
      !body.email ||
      !body.successUrl ||
      !body.cancelUrl ||
      !body.ipnUrl
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing payment fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET;
    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        { ok: false, error: "Missing PAYTECH credentials" },
        { status: 500 }
      );
    }

    const payload = {
      item_name: body.itemName,
      item_price: String(body.amount),
      currency: body.currency,
      ref_command: body.ref,
      command_name: body.itemName,
      env: process.env.PAYTECH_ENV || "test",
      ipn_url: body.ipnUrl,
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
      custom_field: body.customField ?? "",
      email: body.email,
    };

    const response = await fetch(
      "https://paytech.sn/api/payment/request-payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          API_KEY: apiKey,
          API_SECRET: apiSecret,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await response.text();
    let data: unknown = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // keep raw text
    }

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "PayTech request failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json(
      { ok: false, error: "PayTech error" },
      { status: 500 }
    );
  }
}
