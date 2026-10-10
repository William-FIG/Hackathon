---
inclusion: always
---
# PlotTwist Technology Standards

## Live references
#[[file:package.json]]
#[[file:tsconfig.app.json]]
#[[file:vite.config.ts]]
#[[file:src/types.ts]]
#[[file:src/logic.ts]]

## Stack and validation
- Use the existing React 19, TypeScript, Vite, Vitest, and Playwright stack. Do not add a dependency without an explicit need and an exact version.
- Validate changed behavior with `npm test`; run `npm run build` for TypeScript and bundle verification; run `npm run test:e2e` for relevant browser flows.
- Preserve the localStorage migration path in `src/logic.ts`; existing `plottwist-progress-v1` records must remain readable.

## AI integration boundary
- Browser components call only a typed, provider-neutral `CharacterService` or the application's own `/api/character-chat` endpoint.
- DeepSeek credentials use unprefixed server-only variables: `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, and `DEEPSEEK_MODEL`. They belong in a Git-ignored `.env.local`, never source code, browser storage, console output, telemetry, or any `VITE_*` variable.
- Put DeepSeek request construction, timeout, retry policy, response mapping, and error sanitisation behind a server-side `DeepSeekCharacterProvider` adapter.
- Define cancellation with `AbortSignal`; ignore late responses after a component unmounts, a language changes, or a request is cancelled.
- Treat provider output as plain text. Never render it as HTML or execute it.
- Limit requests to the current language, target word, safe word meaning, current story position, and coarse answer event. Never transmit note text, whole progress objects, API keys, or unneeded identifiers.
