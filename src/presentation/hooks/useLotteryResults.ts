"use client";

import { useQuery } from "@tanstack/react-query";
import type { Ticket } from "@/domain/entities/Ticket";
import {
  selectLotteryResultDates,
  type LotteryResultDay,
} from "@/presentation/lib/lotteryVerifier";

type LotteryResultsResponse = {
  source: string;
  data: LotteryResultDay[];
};

async function getLotteryResults(dates: string[]): Promise<LotteryResultsResponse> {
  const params = new URLSearchParams({ dates: dates.join(",") });
  const response = await fetch(`/api/lottery-results?${params.toString()}`);

  if (!response.ok) {
    throw new Error("No se pudieron consultar los resultados oficiales.");
  }

  return response.json() as Promise<LotteryResultsResponse>;
}

export function useLotteryResultsQuery(tickets: Ticket[]) {
  const dates = selectLotteryResultDates(tickets);

  return useQuery({
    queryKey: ["external", "lottery-results", dates],
    queryFn: () => getLotteryResults(dates),
    enabled: dates.length > 0,
    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });
}
