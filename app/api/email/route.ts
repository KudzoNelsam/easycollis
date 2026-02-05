import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type EmailPayload = {
  to?: string;
  subject?: string;
  html?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as EmailPayload;
    const to = body.to?.trim();
    const subject = body.subject?.trim();
    const html = body.html?.trim();

    if (!to || !subject || !html) {
      return NextResponse.json(
        { ok: false, error: "Missing email fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM || "onboarding@resend.dev";

    const result = await resend.emails.send({
      from: `Easycollis <${from}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Email send failed" },
      { status: 500 }
    );
  }
}
