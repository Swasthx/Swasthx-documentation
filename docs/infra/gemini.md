---
layout: default
title: Google Gemini
parent: Infrastructure
---

# Google Gemini

We leverage Google's Gemini models for advanced AI capabilities within the PHR application.

## AI/ML Models

### Primary Model
- **gemini-2.5-flash**
  - Used for interactive Q&A doctor recommendation chatbot (`POST /chatSearch/sendMessageToLLM`)
  - Used for multimodal health record summarization (`POST /phr/ai-summary`) with SHA-256 result caching in `aisummaries` collection
  - Optimized for healthcare domain and structured JSON output

## Integration
- Secure API key authentication via `GOOGLE_API_KEY` environment variable
