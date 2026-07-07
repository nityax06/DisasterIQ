"use client";

import { useEffect, useMemo, useState } from "react";
import { CloudRain, Thermometer, Wind, Droplets } from "lucide-react";

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type WeatherData = {
  city: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  rainChance: number;
  wind: number;
  summary: string;
  source: string;
};

export default function WeatherPanel({ incidents }: { incidents: Incident[] }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const targetCity = useMemo(() => {
    const severityRank = { critical: 4, high: 3, medium: 2, low: 1 } as Record<string, number>;
    return (
      [...incidents].sort(
        (a, b) =>
          (severityRank[b.severity.toLowerCase()] || 0) -
          (severityRank[a.severity.toLowerCase()] || 0)
      )[0]?.location || "Delhi"
    );
  }, [incidents]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch(`/api/weather?city=${encodeURIComponent(targetCity)}`)
      .then((response) => response.json())
      .then((data: WeatherData) => {
        if (active) setWeather(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [targetCity]);

  const riskColor = weather?.summary.toLowerCase().includes("high")
    ? "border-red-500/30 bg-red-500/10 text-red-300"
    : weather?.summary.toLowerCase().includes("moderate")
    ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
    : "border-green-500/30 bg-green-500/10 text-green-300";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-cyan-300" />
          <div>
            <h2 className="text-sm font-semibold">Weather Intelligence</h2>
            <p className="text-xs text-slate-500">Live conditions for {targetCity}.</p>
          </div>
        </div>

        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${riskColor}`}>
          {loading ? "syncing" : weather?.source || "weather"}
        </span>
      </div>

      {loading || !weather ? (
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-lg bg-white/[0.05]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <Thermometer className="mb-2 h-4 w-4 text-orange-300" />
              <p className="text-slate-500">Temp</p>
              <p className="mt-1 text-lg font-bold">{weather.temperature}°C</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <CloudRain className="mb-2 h-4 w-4 text-cyan-300" />
              <p className="text-slate-500">Rain</p>
              <p className="mt-1 text-lg font-bold">{weather.rainChance}%</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <Wind className="mb-2 h-4 w-4 text-slate-300" />
              <p className="text-slate-500">Wind</p>
              <p className="mt-1 text-lg font-bold">{weather.wind} km/h</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/30 p-3">
              <Droplets className="mb-2 h-4 w-4 text-blue-300" />
              <p className="text-slate-500">Humidity</p>
              <p className="mt-1 text-lg font-bold">{weather.humidity}%</p>
            </div>
          </div>

          <div className={`mt-3 rounded-lg border px-3 py-2 text-xs ${riskColor}`}>
            {weather.summary}
          </div>
        </>
      )}
    </div>
  );
}
