import { generate } from "otplib";
import type { NextRequest } from "next/server";
import redis from "../lib/redis";
import isAuthorized from "../lib/isAuthorized";

export const config = { runtime: "edge" };

const OTP_SECRET_MIN_LENGTH = 26;

const DEFAULT_OTP_SECRET = "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP";
const OTP_TTL = 60;
const OTP_HISTORY_TTL = OTP_TTL * 4;

function ensureSecretLength(secret: string): string {
  if (secret.length >= OTP_SECRET_MIN_LENGTH) return secret;

  const repetitions = Math.ceil(OTP_SECRET_MIN_LENGTH / secret.length);
  return secret.repeat(repetitions).substring(0, OTP_SECRET_MIN_LENGTH);
}

export default async function handler(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { searchParams } = new URL(request.url);
  const rawSecret = searchParams.get("secret") ?? DEFAULT_OTP_SECRET;
  const secret = ensureSecretLength(rawSecret);

  const otpCode = await generate({ secret });

  const now = Date.now();
  const expiresAtMs = now + OTP_TTL * 1000;

  const createdAtTimestampLackingMsPrecision = new Date(
    now - (now % 1000),
  ).toISOString();

  const event = {
    otpCode,
    secret,
    createdAtTimestampLackingMsPrecision,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };

  const key = `otp:${now}:${crypto.randomUUID()}`;
  await redis.set(key, JSON.stringify(event), { ex: OTP_HISTORY_TTL });

  return new Response(JSON.stringify(event), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
