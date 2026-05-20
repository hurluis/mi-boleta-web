"use client";

import { useQuery } from "@tanstack/react-query";

export type ColombiaHoliday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  types: string[];
};

type HolidaysResponse = {
  data: ColombiaHoliday[];
  source: string;
};

async function getColombiaHolidays(): Promise<HolidaysResponse> {
  const response = await fetch("/api/colombia-holidays");

  if (!response.ok) {
    throw new Error("No se pudo consultar el calendario de festivos.");
  }

  return response.json() as Promise<HolidaysResponse>;
}

export function useColombiaHolidaysQuery() {
  return useQuery({
    queryKey: ["external", "colombia-holidays"],
    queryFn: getColombiaHolidays,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
  });
}
