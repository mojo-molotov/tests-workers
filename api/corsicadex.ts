import type { NextRequest } from "next/server";
import isAuthorized from "../lib/isAuthorized";
import { corsicaDexData } from "../consts/corsicadexData";

export const config = { runtime: "edge" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "x-api-key, Content-Type",
} as const;

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

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id parameter" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const corsicamonId = parseInt(id, 10);

  if (isNaN(corsicamonId)) {
    return new Response(JSON.stringify({ error: "Invalid ID" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  const corsicamon = corsicaDexData.find((p) => p.id === corsicamonId);

  if (!corsicamon) {
    return new Response(JSON.stringify({ error: "Corsicamon not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }

  return new Response(JSON.stringify(corsicamon), {
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}
