import { NextRequest, NextResponse } from "next/server";

function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return null;
  }
}

function suggestSource(url: string): string {
  const domain = extractDomain(url);
  if (!domain) return "";
  const parts = domain.replace(/^www\./, "").split(".");
  if (parts.length >= 2) {
    return parts[0];
  }
  return domain;
}

function suggestMedium(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes("/blog/") || parsed.pathname.includes("/news/")) {
      return "organic";
    }
    if (parsed.searchParams.has("ref") || parsed.searchParams.has("source")) {
      return "referral";
    }
    if (parsed.pathname.includes("/ad/") || parsed.pathname.includes("/ads/")) {
      return "cpc";
    }
    const hostname = parsed.hostname;
    if (hostname.includes("mail.") || hostname.includes("newsletter")) {
      return "email";
    }
    if (hostname.includes("facebook") || hostname.includes("twitter") || hostname.includes("linkedin") || hostname.includes("instagram")) {
      return "social";
    }
    return "organic";
  } catch {
    return "organic";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, source, medium, campaignName, content, term } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { data: null, error: "URL is required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { data: null, error: "Invalid URL" },
        { status: 400 }
      );
    }

    if (!source && !medium && !campaignName && !content && !term) {
      const suggestedSource = suggestSource(url);
      const suggestedMedium = suggestMedium(url);
      const suggestedParams = {
        utm_source: suggestedSource,
        utm_medium: suggestedMedium,
        utm_campaign: "",
        utm_content: "",
        utm_term: "",
      };
      const generatedUrl = appendUtmParams(parsedUrl, suggestedParams);
      return NextResponse.json({
        data: {
          suggestedParams,
          generatedUrl,
        },
        error: null,
      });
    }

    const params = {
      utm_source: source || "",
      utm_medium: medium || "",
      utm_campaign: campaignName || "",
      utm_content: content || "",
      utm_term: term || "",
    };
    const generatedUrl = appendUtmParams(parsedUrl, params);

    return NextResponse.json({
      data: {
        suggestedParams: params,
        generatedUrl,
      },
      error: null,
    });
  } catch (error) {
    return NextResponse.json(
      { data: null, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

function appendUtmParams(url: URL, params: Record<string, string>): string {
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
