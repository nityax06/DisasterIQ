import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type Incident = {
  id: number;
  type: string;
  location: string;
  severity: string;
  population: number;
  casualties: number;
};

type Mode =
  | "assistant"
  | "chat"
  | "prediction"
  | "advisory"
  | "voice"
  | "routing"
  | "resources";

type WeatherResult = {
  location: string;
  summary: string;
};

const REFUSAL =
  "I can only help with DisasterIQ disaster response, incident analysis, emergency planning, weather impact, resource allocation, relief-center coordination, route planning, public safety, and dashboard-related questions.";

const cityCoords: Record<string, { lat: number; lon: number }> = {
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Gurgaon: { lat: 28.4595, lon: 77.0266 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Bhubaneshwar: { lat: 20.2961, lon: 85.8245 },
  Guwahati: { lat: 26.1445, lon: 91.7362 },
  Chandigarh: { lat: 30.7333, lon: 76.7794 },
};

const severityWeight: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const weatherCache = new Map<string, { value: WeatherResult; expires: number }>();
const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 20;
}

function needsLiveWeather(mode: Mode, question: string) {
  if (mode === "prediction" || mode === "routing") return true;
  const text = question.toLowerCase();
  return ["weather", "rain", "wind", "temperature", "heat", "storm", "cyclone", "flood", "route", "road"].some((term) => text.includes(term));
}

function scoreIncident(incident: Incident) {
  const severityScore = severityWeight[incident.severity.toLowerCase()] || 0;
  return severityScore * 100000 + incident.casualties * 50 + incident.population;
}

function getTopIncident(incidents: Incident[]) {
  return [...incidents].sort((a, b) => scoreIncident(b) - scoreIncident(a))[0];
}

function timeoutSignal(ms: number) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

function weatherRiskText(data: {
  temperature: number;
  humidity: number;
  precipitation: number;
  rain: number;
  wind: number;
}) {
  const risks: string[] = [];

  if (data.temperature >= 38) {
    risks.push("extreme heat may increase responder fatigue and medical risk");
  } else if (data.temperature >= 34) {
    risks.push("high heat may require hydration breaks for field teams");
  }

  if (data.rain > 0 || data.precipitation > 0) {
    risks.push("rainfall may worsen mobility, drainage, and flood response conditions");
  }

  if (data.wind >= 35) {
    risks.push("strong wind may affect rescue movement, temporary shelters, and route safety");
  } else if (data.wind >= 20) {
    risks.push("moderate wind may affect exposed field operations");
  }

  if (data.humidity >= 75 && data.temperature >= 32) {
    risks.push("humidity and heat may increase exhaustion risk for responders");
  }

  return risks.length > 0 ? risks.join("; ") : "no major weather constraint detected";
}

async function getWeatherForLocation(location: string): Promise<WeatherResult> {
  const cached = weatherCache.get(location);
  if (cached && cached.expires > Date.now()) return cached.value;

  const coords = cityCoords[location];

  if (!coords) {
    return {
      location,
      summary: `${location}: weather unavailable because coordinates are not configured.`,
    };
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m` +
    `&timezone=auto&forecast_days=1`;

  const response = await fetch(url, {
    cache: "no-store",
    signal: timeoutSignal(5000),
  });

  if (!response.ok) {
    return {
      location,
      summary: `${location}: weather could not be fetched.`,
    };
  }

  const data = await response.json();
  const current = data.current;

  const weather = {
    temperature: Number(current.temperature_2m ?? 0),
    humidity: Number(current.relative_humidity_2m ?? 0),
    precipitation: Number(current.precipitation ?? 0),
    rain: Number(current.rain ?? 0),
    wind: Number(current.wind_speed_10m ?? 0),
  };

  const value = {
    location,
    summary:
      `${location}: ${weather.temperature}°C, humidity ${weather.humidity}%, ` +
      `precipitation ${weather.precipitation} mm, rain ${weather.rain} mm, ` +
      `wind ${weather.wind} km/h. Weather risk: ${weatherRiskText(weather)}.`,
  };

  weatherCache.set(location, {
    value,
    expires: Date.now() + 1000 * 60 * 10,
  });

  return value;
}

async function getWeatherContext(incidents: Incident[]) {
  const uniqueLocations = Array.from(
    new Set(incidents.map((item) => item.location).filter(Boolean))
  );

  if (uniqueLocations.length === 0) {
    return "No incident locations available for weather lookup.";
  }

  const results = await Promise.all(
    uniqueLocations.map((location) =>
      getWeatherForLocation(location).catch(() => ({
        location,
        summary: `${location}: weather data unavailable.`,
      }))
    )
  );

  return results.map((item) => item.summary).join("\n");
}

function buildSmsAlert(focus: string) {
  return `## SMS Alert

EMERGENCY ALERT: ${focus} requires public caution. Avoid unsafe routes, follow official instructions, keep emergency contacts available, and move toward designated relief points only if advised by authorities. - DisasterIQ`;
}

function buildVoiceFallback(
  question: string,
  focus: string,
  weatherContext: string,
  incidents: Incident[]
) {
  const text = question.toLowerCase().trim();
  const activeCount = incidents.length;
  const criticalCount = incidents.filter(
    (item) => item.severity.toLowerCase() === "critical"
  ).length;
  const totalPopulation = incidents.reduce((sum, item) => sum + item.population, 0);
  const totalCasualties = incidents.reduce((sum, item) => sum + item.casualties, 0);
  const topIncident = getTopIncident(incidents);

  // Exact dashboard-data questions should work even when Gemini is unavailable.
  if (
    /(how many|number of|count|total).*(incident|disaster)|(?:incident|disaster).*(how many|number of|count|total)/i.test(text)
  ) {
    return `## Incident Count\n\nThere are **${activeCount} active incidents** in the current DisasterIQ dashboard${criticalCount ? `, including **${criticalCount} critical** incident${criticalCount === 1 ? "" : "s"}` : ""}.`;
  }

  if (/(how many|number of|count|total).*(critical)/i.test(text)) {
    return `## Critical Incident Count\n\nThere are **${criticalCount} critical incidents** in the current dashboard.`;
  }

  if (/affected population|people affected|population affected|total population/i.test(text)) {
    return `## Affected Population\n\nThe incidents currently shown affect **${totalPopulation.toLocaleString()} people** in total.`;
  }

  if (/casualt|injur|fatalit/i.test(text) && /(how many|number|count|total)/i.test(text)) {
    return `## Casualty Count\n\nThe current dashboard records **${totalCasualties} casualties** across **${activeCount} incidents**.`;
  }

  if (/highest|top|most urgent|priority incident|priority location/i.test(text)) {
    return topIncident
      ? `## Highest Priority Incident\n\n**${topIncident.type} in ${topIncident.location}** is the current highest-priority incident: severity **${topIncident.severity}**, affected population **${topIncident.population.toLocaleString()}**, casualties **${topIncident.casualties}**.`
      : "No active incidents are available.";
  }

  if (text.includes("sms") || text.includes("text alert") || text.includes("message alert")) {
    return buildSmsAlert(focus);
  }

  if (text.includes("public advisory") || text.includes("advisory") || text.includes("announcement")) {
    return `## Public Advisory\n\nResidents near ${focus} should remain alert, avoid unsafe routes, follow local authority instructions, keep emergency contacts accessible, and move vulnerable people toward safe relief points if advised. Do not spread unverified information.`;
  }

  if (/summari[sz]e|summary|brief me|briefing|overview/i.test(text)) {
    const rows = incidents
      .slice()
      .sort((a, b) => scoreIncident(b) - scoreIncident(a))
      .slice(0, 5)
      .map((item, index) => `${index + 1}. ${item.type} in ${item.location} — ${item.severity}, ${item.population.toLocaleString()} affected, ${item.casualties} casualties`)
      .join("\n");
    return `## Incident Summary\n\n**${activeCount} active incidents** are visible. Current priority: **${focus}**.\n\n${rows || "No incident records available."}`;
  }

  if (/predict|forecast|next \d+|next few|what.*happen|risk.*hours?/i.test(text)) {
    return `## Operational Prediction\n\nPriority focus: ${focus}. Over the next response window, monitor resource pressure, evacuation needs, route safety, and weather-sensitive operations.\n\n${weatherContext}`;
  }

  if (/weather|rain|wind|temperature|humidity|storm|heat/i.test(text)) {
    return `## Weather Impact\n\n${weatherContext}`;
  }

  if (/boat|ambulance|volunteer|medical|resource|allocate|shortage|supply|supplies|shelter|team|vehicle|helicopter|drone|food|water|fuel/i.test(text)) {
    return `## Resource Assessment\n\nPriority focus: ${focus}. The current incident data can guide severity-based allocation, but an exact \"how many more\" shortage requires current inventory/capacity data. Prioritize life-safety resources first and compare available stock against the affected population and casualty load.`;
  }

  if (/route|road|path|reach|travel|dispatch|nearest|relief center|relief centre/i.test(text)) {
    return `## Routing Assessment\n\nUse **${focus}** as the current priority unless another location was named. Check the nearest active relief center, route safety, weather constraints, vehicle suitability, and at least one backup route before dispatch.`;
  }

  if (/evacuat|move people|safe zone|shelter/i.test(text)) {
    return `## Evacuation Assessment\n\nFor ${focus}, verify field conditions, identify vulnerable populations first, confirm safe routes and shelter capacity, and issue evacuation instructions only through authorized channels.`;
  }

  // Never pretend an unknown command was "executed". Give a useful, honest fallback.
  return `I understood the transcript **“${question}”**, but the AI service did not return a usable answer. I can still answer exact dashboard-data questions from the current ${activeCount} incidents, while open-ended analysis needs the AI service to respond successfully.`;
}
function getFallbackByMode(
  mode: Mode,
  question: string,
  incidents: Incident[],
  weatherContext: string
) {
  const topIncident = getTopIncident(incidents);
  const focus = topIncident
    ? `${topIncident.type} in ${topIncident.location}`
    : "No active priority incident";

  if (mode === "prediction") {
    return `## 24-Hour Operational Risk Prediction

**Priority Focus:** ${focus}

**Main Risks**
1. Response pressure may rise if the highest-priority incident remains unresolved.
2. Medical and volunteer demand should be monitored closely.
3. Weather-sensitive locations should be checked before dispatch.

**Command Actions**
1. Pre-position rescue teams near the highest-risk incident.
2. Verify medical kits, boats, ambulances, and volunteer availability.
3. Review evacuation routes and backup routes.
4. Reassess incident priority every 2–4 hours.

**Weather Context**
${weatherContext}`;
  }

  if (mode === "advisory") {
    return `## Public Advisory

Residents near the affected priority area should stay alert, avoid unsafe routes, and follow official emergency instructions.

**Priority Area:** ${focus}

**Public Instructions**
1. Avoid flooded, damaged, blocked, or unsafe routes.
2. Keep emergency contacts accessible.
3. Move vulnerable people toward safer relief points if advised by officials.
4. Do not spread unverified information.

**Authority Note**
This advisory is based on current DisasterIQ incident information and should be verified by local authorities before public broadcast.`;
  }

  if (mode === "voice") {
    return buildVoiceFallback(question, focus, weatherContext, incidents);
  }

  if (mode === "routing") {
    return `## Dynamic Routing Assessment

**Priority Route Focus:** ${focus}

**Routing Actions**
1. Select the nearest active relief center.
2. Check backup routes before dispatch.
3. Avoid weather-affected or blocked roads.
4. Assign vehicle type based on incident type.

**Weather Context**
${weatherContext}`;
  }

  if (mode === "resources") {
    return `## Resource Requirement Estimate

**Priority Focus:** ${focus}

**Estimated Needs**
- Medical kits: High priority
- Rescue teams: High priority
- Volunteers: Medium to high priority
- Boats: Required if flood/water impact is present
- Ambulances: Required if casualties are present

Exact shortage cannot be calculated unless current inventory is supplied.`;
  }

  return `## DisasterIQ Assistant Response

**Priority Focus:** ${focus}

I can help analyze incidents, weather impact, resource needs, evacuation planning, routing, and response priorities.

**Weather Context**
${weatherContext}

**Your Request**
${question}`;
}

function modeInstructions(mode: Mode) {
  if (mode === "prediction") {
    return `
You are generating a 24-hour operational prediction.

Do NOT produce a public advisory.
Do NOT produce a generic situation assessment.
Focus only on:
- next 24-hour operational risks
- resource pressure
- evacuation likelihood
- weather impact
- response priority shifts
- practical command-center actions

Use this structure:
## 24-Hour Risk Forecast
## Resource Pressure
## Evacuation Needs
## Weather Impact
## Response Priorities
## Command-Center Actions
`;
  }

  if (mode === "advisory") {
    return `
You are generating a public advisory.

Do NOT write internal command-center predictions.
Do NOT mention hidden reasoning.
Write for the public in clear, calm language.

Include:
## Public Advisory
## Affected Area
## What Residents Should Do
## What Residents Should Avoid
## Emergency Reminder

Keep it broadcast-ready.
`;
  }

  if (mode === "voice") {
    return `
You are executing a browser voice command inside DisasterIQ.

The user transcript is the direct command. Understand it semantically and answer it naturally using the supplied dashboard context. Do NOT merely say the command was received, processed, interpreted, or executed. Do NOT return a generic action template. Perform the requested DisasterIQ task in text form.

The examples below are categories, not a whitelist. Handle paraphrases, follow-up wording, counts, comparisons, named locations, incident questions, resource questions, weather questions, routing, evacuation, alerts, summaries, predictions, and other reasonable disaster-response requests.

Important behavior:
- If the command asks to "generate an SMS alert", output a ready-to-send SMS alert only, with a short heading.
- If it asks for a public advisory, generate the advisory itself.
- If it asks to summarize, produce the summary.
- If it asks to predict, produce the prediction.
- If it asks about boats/resources/ambulances/volunteers, estimate needs from incident context and clearly mention if exact inventory is missing.
- If it asks to compare incidents, compare them.
- If it asks about weather, use the supplied weather context.

Use the current priority incident unless the user names another location.
Keep voice-command outputs short, actionable, and command-center ready.
`;
  }

  if (mode === "routing") {
    return `
You are generating dynamic resource routing guidance.

Focus only on:
- nearest relief center logic
- route safety
- estimated response movement
- weather/road impact
- vehicle choice
- backup routing

Use:
## Route Assessment
## Suggested Vehicle Type
## Routing Risks
## Backup Plan
`;
  }

  if (mode === "resources") {
    return `
You are calculating resource requirements.

Focus only on:
- rescue teams
- boats
- ambulances
- medical kits
- volunteers
- shelters
- shortages
- estimated additional requirement

If exact inventory is missing, clearly say estimates are based on incident severity, population, casualties, and incident type.

Use:
## Resource Requirement Estimate
## Immediate Needs
## Additional Requirement
## Shortage Risk
## Allocation Priority
`;
  }

  return `
You are answering as a DisasterIQ operational assistant.

Answer naturally based on the user's request.
For short questions, answer directly first.
For complex questions, use short headings.
`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      question?: string;
      messages?: ChatMessage[];
      incidents?: Incident[];
      mode?: Mode;
    };

    const question =
      body.question ||
      body.messages?.at(-1)?.content ||
      "Analyze current incident situation.";

    const incidents = body.incidents || [];
    const mode: Mode = body.mode || "chat";

    if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
        { answer: "Too many AI requests were sent in a short time. Please wait a moment and try again.", fallback: true },
        { status: 429 }
      );
    }

    const weatherContext = needsLiveWeather(mode, question)
      ? await getWeatherContext(incidents)
      : "Live weather lookup skipped because this request does not require it.";

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        answer: getFallbackByMode(mode, question, incidents, weatherContext),
        fallback: true,
      });
    }

    const incidentContext = incidents
      .map(
        (item) =>
          `#${item.id}: ${item.type} in ${item.location}, severity ${item.severity}, population ${item.population}, casualties ${item.casualties}, computed priority score ${scoreIncident(item)}`
      )
      .join("\n");

    const topIncident = getTopIncident(incidents);

    const prompt = `
You are DisasterIQ Response Assistant.

You are not a general chatbot.

You must answer ANY question that reasonably helps with:
- disaster management
- emergency response
- public safety
- incident operations
- weather impact
- resource planning
- evacuation
- logistics
- rescue
- relief
- dashboard interpretation
- command decision-making
- public alerts, SMS alerts, advisories, broadcast messages

If the question is clearly unrelated to DisasterIQ, disasters, emergency response, public safety, weather impact, logistics, or dashboard data, answer exactly:
"${REFUSAL}"

Do not refuse disaster/resource questions just because they are phrased casually.

Global rules:
- Never invent missing inventory.
- If exact inventory is unavailable, say that exact stock data is not provided and give an operational estimate.
- Avoid raw JSON.
- Avoid saying you do not have weather data; live weather context is supplied below.
- Keep the answer practical, concise, and command-center focused.
- Do not reuse the same generic answer for different modes.
- Follow the selected feature mode strictly.

Selected feature mode:
${mode}

Mode-specific instruction:
${modeInstructions(mode)}

Current DisasterIQ incidents:
${incidentContext || "No active incidents available."}

Highest computed priority incident:
${topIncident ? `${topIncident.type} in ${topIncident.location}` : "None"}

Live weather by incident location:
${weatherContext}

Recent conversation:
${
  body.messages
    ?.slice(-6)
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n") || "No prior conversation."
}

User request:
${question}
`;

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const payload = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.25, maxOutputTokens: 900 },
    });

    let response: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: timeoutSignal(9000),
          body: payload,
        });
        if (response.ok || response.status < 500) break;
      } catch {
        response = null;
      }
    }

    if (!response?.ok) {
      return NextResponse.json({
        answer: getFallbackByMode(mode, question, incidents, weatherContext),
        fallback: true,
      });
    }

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text || "")
        .join("")
        .trim() || getFallbackByMode(mode, question, incidents, weatherContext);

    return NextResponse.json({ answer, fallback: false });
  } catch {
    return NextResponse.json({
      answer:
        "DisasterIQ AI is temporarily unavailable. Please retry in a few seconds.",
      fallback: true,
    });
  }
}