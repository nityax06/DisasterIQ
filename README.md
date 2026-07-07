# DisasterIQ

DisasterIQ is a Next.js emergency-response decision-support dashboard for incident prioritization, resource planning, relief-center coordination, route guidance, live weather context, public advisories, AI predictions, and disaster-focused conversational assistance.

## Stack
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Supabase for authentication/data/realtime
- Gemini API through a server-only Next.js route
- Open-Meteo for weather context
- Recharts and jsPDF

## Local setup
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add your own Supabase values and a fresh Gemini API key
4. Run: `npm run dev`
5. Production check: `npm run build`

## Security
- Never commit `.env.local`.
- Keep `GEMINI_API_KEY` server-side; never prefix it with `NEXT_PUBLIC_`.
- Rotate any key that has been pasted into chat, screenshots, commits, or shared files.
- The Supabase anon key is intended for client use, but database security must still be enforced with Row Level Security policies.

## AI behavior
The assistant route is mode-aware: `assistant`, `chat`, `prediction`, `advisory`, `voice`, `routing`, and `resources`. It uses short-lived weather caching, skips live weather for unrelated requests, preserves recent chat context, retries transient Gemini failures, hides raw provider errors, and applies a lightweight request limit.

## Deployment
Deploy on Vercel, add the four environment variables from `.env.example` in Project Settings, then redeploy. Do not upload `.env.local`.

## Demo flow
1. Sign in.
2. Show active incidents and priority focus.
3. Open the interactive incident map and an incident detail.
4. Demonstrate resource requirement calculation and routing.
5. Ask AI Chat a context follow-up (for example: `What about Chennai?`).
6. Run AI Prediction.
7. Generate a Public Advisory.
8. Demonstrate Voice Command Center where browser speech recognition is supported.
9. Export a report.

## Limitations
AI outputs are decision-support suggestions, not authoritative emergency instructions. Route data in the current UI includes modeled/static routing values rather than a live traffic-routing provider. Weather availability depends on the external weather service.
