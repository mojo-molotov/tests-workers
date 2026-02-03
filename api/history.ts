import type { NextRequest } from "next/server";
import redis from "../lib/redis";
import isAuthorized from "../lib/isAuthorized";

export const config = { runtime: "edge" };

export default async function handler(request: NextRequest) {
  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const keys = await redis.keys("otp:*");

  const events = await Promise.all(
    keys.map(async (key) => {
      const value = await redis.get<string>(key);
      return value ? JSON.parse(value) : null;
    }),
  );

  return new Response(JSON.stringify(events.filter(Boolean)), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
