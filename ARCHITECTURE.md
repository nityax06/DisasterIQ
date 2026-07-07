# DisasterIQ Architecture

```text
Browser / Next.js Client UI
  |-- AuthGate + Login
  |-- Dashboard / Incidents / Operations / Resources / Analytics
  |-- Map + Charts + Reports
  |-- AI Chat / Prediction / Advisory / Voice
  |
  +--> Supabase client --> Auth + incidents + realtime updates
  |
  +--> /api/weather --> Open-Meteo
  |
  +--> /api/assistant (server only)
         |-- mode-specific prompt policy
         |-- recent conversation context
         |-- conditional cached weather context
         |-- request limiting + timeout + retry
         +--> Gemini API
```

## Key design choices
- Provider secret stays in the server route.
- AI feature modes prevent prediction/advisory/voice from collapsing into one generic response.
- Weather is fetched only when useful, reducing chat latency.
- Rule-based resource calculation remains separate from generative AI.
- Supabase realtime keeps incident data synchronized.
