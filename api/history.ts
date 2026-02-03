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

  let cursor = "0";
  const allEvents = [];
  const BATCH_SIZE = 100;

  do {
    const [newCursor, keys] = await redis.scan(cursor, {
      match: "otp:*",
      count: BATCH_SIZE,
    });
    cursor = newCursor;

    if (keys.length > 0) {
      const values = await redis.mget(...keys);
      allEvents.push(...values.filter(Boolean));
    }
  } while (cursor !== "0");

  return new Response(JSON.stringify(allEvents), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
