import { NextResponse } from "next/server";

const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Gurgaon: { lat: 28.4595, lon: 77.0266 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Bhubaneshwar: { lat: 20.2961, lon: 85.8245 },
  Guwahati: { lat: 26.1445, lon: 91.7362 },
};

function riskFromWeather(rain: number, wind: number, temp: number) {
  if (rain >= 70 || wind >= 35) return "High operational weather risk";
  if (rain >= 40 || wind >= 22 || temp >= 38) return "Moderate operational weather risk";
  return "Weather conditions are manageable";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city") || "Delhi";
  const coords = cityCoordinates[city] || cityCoordinates.Delhi;

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(coords.lat));
    url.searchParams.set("longitude", String(coords.lon));
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m");
    url.searchParams.set("hourly", "precipitation_probability");
    url.searchParams.set("forecast_days", "1");
    url.searchParams.set("timezone", "auto");

    const response = await fetch(url, { next: { revalidate: 900 } });
    if (!response.ok) throw new Error("Weather provider failed");

    const data = await response.json();
    const current = data.current || {};
    const rainChance = data.hourly?.precipitation_probability?.[0] ?? 0;

    return NextResponse.json({
      city,
      temperature: Math.round(current.temperature_2m ?? 0),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      precipitation: Number(current.precipitation ?? 0),
      rainChance,
      wind: Math.round(current.wind_speed_10m ?? 0),
      summary: riskFromWeather(rainChance, Number(current.wind_speed_10m ?? 0), Number(current.temperature_2m ?? 0)),
      source: "Open-Meteo",
    });
  } catch {
    return NextResponse.json({
      city,
      temperature: 31,
      humidity: 62,
      precipitation: 0,
      rainChance: 28,
      wind: 12,
      summary: "Weather fallback active. Live provider unavailable.",
      source: "Local fallback",
    });
  }
}
