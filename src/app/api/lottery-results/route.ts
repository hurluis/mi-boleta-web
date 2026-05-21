import { NextResponse, type NextRequest } from "next/server";
import type { LotteryDraw } from "@/presentation/lib/lotteryVerifier";

type ExternalLotteryDraw = {
  lottery?: string;
  slug?: string;
  date?: string;
  result?: string;
  series?: string | null;
};

type ExternalLotteryResponse = {
  status?: string;
  data?: ExternalLotteryDraw[];
};

export const revalidate = 900;

function normalizeSeries(value: string | null | undefined): string | null {
  if (!value || value === "null") return null;
  return value;
}

function mapDraw(draw: ExternalLotteryDraw, fallbackDate: string): LotteryDraw | null {
  if (!draw.lottery || !draw.result) return null;

  return {
    lottery: draw.lottery,
    slug: draw.slug ?? draw.lottery.toLowerCase().replace(/\s+/g, "-"),
    date: draw.date ?? fallbackDate,
    result: draw.result,
    series: normalizeSeries(draw.series),
  };
}

async function fetchResultsByDate(date: string): Promise<LotteryDraw[]> {
  const response = await fetch(
    `https://api-resultadosloterias.com/api/results/${date}`,
    { next: { revalidate } },
  );

  if (!response.ok) {
    throw new Error(`Lottery results API responded with ${response.status}`);
  }

  const payload = (await response.json()) as ExternalLotteryResponse;
  const rawResults = payload.data ?? [];
  const seen = new Set<string>();
  const results: LotteryDraw[] = [];

  for (const draw of rawResults) {
    const mapped = mapDraw(draw, date);
    if (!mapped) continue;

    const key = `${mapped.slug}:${mapped.date}:${mapped.result}:${mapped.series ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(mapped);
  }

  return results;
}

export async function GET(request: NextRequest) {
  const dates = (request.nextUrl.searchParams.get("dates") ?? "")
    .split(",")
    .map((date) => date.trim())
    .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
    .slice(0, 7);

  if (dates.length === 0) {
    return NextResponse.json(
      { error: "Debes enviar al menos una fecha válida en dates=YYYY-MM-DD." },
      { status: 400 },
    );
  }

  try {
    const data = await Promise.all(
      dates.map(async (date) => ({
        date,
        results: await fetchResultsByDate(date),
      })),
    );

    return NextResponse.json({
      source: "api-resultadosloterias.com",
      data,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron consultar los resultados de loterías." },
      { status: 502 },
    );
  }
}
