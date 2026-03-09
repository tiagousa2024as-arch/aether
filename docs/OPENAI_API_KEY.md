# OpenAI API key setup

**Never commit or paste your API key in code or chat.** If you already did, revoke that key at [OpenAI API keys](https://platform.openai.com/api-keys) and create a new one.

## 1. Put the key in environment only

In the project root, add the key to **`.env`** (or `.env.local`; both work; `.env.local` is git-ignored):

```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

Use a **new** key if you ever pasted the old one anywhere.

## 2. Restart the dev server

After changing `.env` or `.env.local`, restart Next.js:

```bash
npm run dev
```

## 3. How the app uses it

All OpenAI calls in Aether use the key from env via `getOpenAIConfig()` in `src/modules/integrations/connectors/openai/config.ts`. No code should reference the key directly.

- **Commands (MVP)** — `POST /api/commands` uses it to interpret natural language.
- **Responses API (gpt-5-nano)** — use the helper below server-side.

## 4. Safe code example (Responses API)

Use the existing client so the key stays in env:

```ts
import { createResponseText } from "@/modules/integrations/connectors/openai/client";

// Server-side only (e.g. API route, server action)
const text = await createResponseText({
  input: "write a haiku about ai",
  model: "gpt-5-nano",
  store: true,
});
console.log(text);
```

Do **not** do this:

```ts
// ❌ Never hardcode the key
const openai = new OpenAI({ apiKey: "sk-proj-..." });
```

Do this instead (key from env):

```ts
// ✅ Key from OPENAI_API_KEY in .env.local
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```
