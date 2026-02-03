import type { NextRequest } from "next/server";

const API_SECRET = process.env.API_SECRET;

function isAuthorized(request: NextRequest): boolean {
  if (typeof API_SECRET !== "string") {
    console.error("[CONFIG ERROR] API_SECRET is not defined");
    return false;
  }

  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("apiKey") ?? request.headers.get("x-api-key");
  return apiKey === API_SECRET;
}

export default isAuthorized;
