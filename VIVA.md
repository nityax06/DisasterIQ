# DisasterIQ Viva Notes

## One-line problem statement
Emergency dashboards often show data but do not combine incident priority, resources, weather, routing, and actionable decision support in one interface.

## Proposed solution
DisasterIQ integrates incident monitoring, priority scoring, resource estimation, relief coordination, weather context, and disaster-scoped AI assistance in a single command-center dashboard.

## Why AI is used
AI converts structured incident context into concise operational summaries, predictions, advisories, and follow-up answers. Deterministic calculations such as resource estimates remain rule-based where reproducibility matters.

## Why Supabase
It provides authentication, hosted data storage, and realtime change subscriptions with a simple web client.

## How priority is determined
The application combines severity with impact signals such as affected population and casualties. Higher-severity incidents dominate, while impact data refines ordering.

## How hallucination risk is reduced
The prompt supplies current incident context, forbids invented inventory, uses mode-specific instructions, and falls back to deterministic local responses when the AI provider is unavailable.

## Main limitation
The system is a decision-support prototype. Some routing values are modeled rather than sourced from a live traffic/navigation provider, and AI output requires human verification.

## Future scope
Live GIS feeds, verified authority alerts, real road closures, multilingual TTS, audited resource inventory, and calibrated predictive models trained on historical disaster data.
