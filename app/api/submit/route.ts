import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

type SubmitBody = {
  econScore?: number;
  socScore?: number;
  quizVersion?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

function getSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };
}

export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ipHashSalt = process.env.IP_HASH_SALT;

  if (!supabaseUrl || !serviceRoleKey || !ipHashSalt) {
    return NextResponse.json({ error: "Server configuration is incomplete." }, { status: 500 });
  }

  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const { econScore, socScore, quizVersion } = body;
  if (!Number.isInteger(econScore) || !Number.isInteger(socScore) || quizVersion !== "v1") {
    return NextResponse.json({ error: "Invalid payload. Expected econScore, socScore integers and quizVersion='v1'." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const ipHash = hashIp(ip, ipHashSalt);
  const ipCountry = request.headers.get("x-vercel-ip-country") ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  const since = new Date(Date.now() - DAY_MS).toISOString();
  const query = new URL(`${supabaseUrl}/rest/v1/attempts`);
  query.searchParams.set("select", "id,created_at");
  query.searchParams.set("ip_hash", `eq.${ipHash}`);
  query.searchParams.set("created_at", `gte.${since}`);
  query.searchParams.set("order", "created_at.desc");
  query.searchParams.set("limit", "1");

  const recentRes = await fetch(query.toString(), {
    headers: getSupabaseHeaders(serviceRoleKey),
    cache: "no-store"
  });

  if (!recentRes.ok) {
    return NextResponse.json({ error: "Failed to check cooldown." }, { status: 500 });
  }

  const recentAttempt = (await recentRes.json()) as Array<{ id: number }>;
  if (recentAttempt.length > 0) {
    return NextResponse.json(
      { error: "You can only complete the quiz once every 24 hours from this connection." },
      { status: 429 }
    );
  }

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/attempts`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(serviceRoleKey),
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      ip_hash: ipHash,
      ip_country: ipCountry,
      user_agent: userAgent,
      econ_score: econScore,
      soc_score: socScore,
      quiz_version: quizVersion
    })
  });

  if (!insertRes.ok) {
    return NextResponse.json({ error: "Failed to save attempt." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
