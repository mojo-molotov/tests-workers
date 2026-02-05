import { generate } from "otplib";
import type { NextRequest } from "next/server";
import redis from "../lib/redis";
import isAuthorized from "../lib/isAuthorized";

export const config = { runtime: "edge" };

const SECRET_QUERY_PARAM_KEY = "secret";
const OTP_SECRET_MIN_LENGTH = 32;
const OTP_SECRET_MAX_LENGTH = 64;
const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const OTP_TTL = 60;
const OTP_HISTORY_TTL = OTP_TTL * 4;
const MAX_FREE_PAYLOAD_SIZE = 4096;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "x-api-key, Content-Type",
} as const;

function generateRandomBase32Secret(length: number = 32): string {
  let secret = "";
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    secret += BASE32_ALPHABET[randomValues[i] % 32];
  }
  return secret;
}

function ensureSecretLength(secret: string): string {
  const cleaned = secret.toUpperCase().replace(/\s/g, "");
  if (cleaned.length > OTP_SECRET_MAX_LENGTH) {
    const validLength = Math.floor(OTP_SECRET_MAX_LENGTH / 8) * 8;
    return cleaned.substring(0, validLength);
  }
  if (cleaned.length >= OTP_SECRET_MIN_LENGTH) {
    const validLength = Math.floor(cleaned.length / 8) * 8;
    return cleaned.substring(0, validLength);
  }
  const repetitions = Math.ceil(OTP_SECRET_MIN_LENGTH / cleaned.length);
  const repeated = cleaned.repeat(repetitions);
  const validLength = Math.floor(repeated.length / 8) * 8;
  return repeated.substring(0, Math.max(validLength, OTP_SECRET_MIN_LENGTH));
}

export default async function handler(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const freePayload: Record<string, string> = {};
  let payloadSize = 0;

  searchParams.forEach((value, key) => {
    if (key === SECRET_QUERY_PARAM_KEY) return;
    const entrySize = new TextEncoder().encode(key + value).length;
    if (payloadSize + entrySize > MAX_FREE_PAYLOAD_SIZE) {
      payloadSize += entrySize;
      return;
    }
    freePayload[key] = value;
    payloadSize += entrySize;
  });

  if (payloadSize > MAX_FREE_PAYLOAD_SIZE) {
    return new Response(
      JSON.stringify({
        error: "Bad Request",
        message: `Free payload exceeds maximum size of ${MAX_FREE_PAYLOAD_SIZE} bytes (got ${payloadSize} bytes)`,
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }

  const rawSecret =
    searchParams.get(SECRET_QUERY_PARAM_KEY) ?? generateRandomBase32Secret();
  const secret = ensureSecretLength(rawSecret);
  const otpCode = await generate({ secret });
  const now = Date.now();
  const expiresAtMs = now + OTP_TTL * 1000;
  const createdAtTimestampLackingMsPrecision = new Date(
    now - (now % 1000),
  ).toISOString();

  const event = {
    ...freePayload,
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
      ...corsHeaders,
    },
  });
}
