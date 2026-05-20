import { NextResponse } from "next/server";

type NagerHoliday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  types: string[];
};

export const revalidate = 86400;

async function fetchHolidays(year: number): Promise<NagerHoliday[]> {
  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/CO`,
    { next: { revalidate } },
  );

  if (!response.ok) {
    throw new Error(`Nager.Date responded with ${response.status}`);
  }

  return response.json() as Promise<NagerHoliday[]>;
}

export async function GET() {
  const currentYear = new Date().getFullYear();

  try {
    const [current, next] = await Promise.all([
      fetchHolidays(currentYear),
      fetchHolidays(currentYear + 1),
    ]);

    return NextResponse.json({
      data: [...current, ...next].map((holiday) => ({
        date: holiday.date,
        localName: holiday.localName,
        name: holiday.name,
        countryCode: holiday.countryCode,
        global: holiday.global,
        types: holiday.types,
      })),
      source: "Nager.Date",
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo consultar el calendario de festivos." },
      { status: 502 },
    );
  }
}
