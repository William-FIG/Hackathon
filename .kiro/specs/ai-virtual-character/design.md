# Design Document — AI Virtual Character

## Overview
The AI virtual character is a sidecar learning coach. It consumes typed learning events after existing StoryReader and ChapterChallenge logic has determined the outcome. It may select a local cue or ask an optional remote provider for a learner-initiated chat reply, but it cannot mutate game progress. This satisfies Requirements 1–5 while retaining PlotTwist's offline, local-first baseline.

## Scope and non-goals
- In scope: one or more static characters, local event-driven cues, optional consented DeepSeek chat, persistence migration, three-language UI, accessibility, cancellation, error recovery, and local fallback.
- Out of scope: changing story content, scoring, XP, unlock rules, using notes as model context, automatic voice playback, credentials in browser code, or a model-controlled game master.

## Architecture
```mermaid
flowchart LR
  SR[StoryReader] -->|CharacterEvent after deterministic result| CC[CharacterController]
  CQ[ChapterChallenge] -->|CharacterEvent after deterministic result| CC
  CC --> LC[LocalCueProvider]
  CC --> CP[CharacterPanel]
  CP -->|learner-initiated, consented chat| API[/api/character-chat]
  API --> DP[DeepSeekCharacterProvider]
  DP --> DS[DeepSeek API]
  LC --> CP
  CC --> CS[CharacterSession]
  CS --> CP
  PG[AppProgress] -->|minimal CharacterProgress| CC
```

## Components and interfaces

### CharacterController
**Responsibilities:** Receive typed events, build a read-only runtime context, select one local cue, coordinate ephemeral UI state, and delegate learner-initiated generated chat. It is composed above keyed StoryReader/ChapterChallenge instances, preferably in `App.tsx` or a dedicated context.

**Requirements:** 1.1–1.4, 2.1–2.3, 3.1–3.5, 5.1–5.4.

```ts
export type CharacterEventType =
  | 'segmentEnter' | 'answerWrong' | 'answerCorrect' | 'wordMastered'
  | 'quizCorrect' | 'quizWrong' | 'chapterPassed' | 'chapterRetry'

export interface CharacterRuntimeContext {
  lang: Lang
  bookId: BookId
  chapter: number
  segment?: number
  targetWord?: string
  targetMeaning?: string
  event: CharacterEventType
}

export interface CharacterService {
  respond(request: CharacterChatRequest, signal: AbortSignal): Promise<CharacterChatResponse>
}
```

### LocalCueProvider
**Responsibilities:** Read static `CharacterCue` data, validate cue configuration in tests, choose the highest-priority applicable cue, obey `once` and cooldown rules, and return a fully localized plain-text cue. It is the default path and fallback for every error state.

**Requirements:** 1.1–1.4, 3.1, 3.5, 5.1.

### CharacterPanel
**Responsibilities:** Render virtual-character identity, cue/message content, consent disclosure, a collapsible transcript, idle/loading/error/cancelled/fallback states, retry/cancel actions, and a learner-controlled chat input. It uses a labelled non-modal `aside`/`region`; only an explicit character choice uses an accessible modal.

**Requirements:** 3.2–3.5, 4.1–4.4, 5.1–5.4.

### Trusted server boundary
**Responsibilities:** Implement Vercel's root-level `api/character-chat.ts` route for `/api/character-chat`, validate the request allowlist and message limits, build a safe server-only system prompt, call the DeepSeek adapter with a timeout, sanitise response text, and return a provider-neutral result code. Browser code cannot import this module. The route is intentionally outside Vite's `src/` build and has its own `tsconfig.api.json` type check.

**Requirements:** 3.2–3.6, 4.1–4.4.

```ts
export interface CharacterChatRequest {
  message: string
  lang: Lang
  context: Pick<CharacterRuntimeContext, 'bookId' | 'chapter' | 'segment' | 'targetWord' | 'targetMeaning' | 'event'>
}
export interface CharacterChatResponse {
  text: string
  source: 'deepseek'
}
export type CharacterChatErrorCode = 'cancelled' | 'offline' | 'timeout' | 'rate_limited' | 'unavailable' | 'unsafe_output'
```

## Data models and persistence

```ts
export interface CharacterProgress {
  selectedCharacterId: string
  enabled: boolean
  remoteConsentVersion?: string
  seenCueIds: string[]
  choiceIds: Record<string, string>
  personaVersion: number
}

export interface CharacterSession {
  expanded: boolean
  status: 'idle' | 'loading' | 'complete' | 'cancelled' | 'error'
  messages: Array<{ id: string; role: 'learner' | 'character'; text: string; source: 'local' | 'deepseek' }>
  errorCode?: CharacterChatErrorCode
}

export interface CharacterCue {
  id: string
  event: CharacterEventType
  priority: number
  once?: boolean
  text: Record<Lang, string>
  word?: string
  chapter?: number
  segment?: number
}
```

`CharacterProgress` is a minimal extension to `AppProgress` because the companion spans word books. `CharacterSession` is intentionally ephemeral and must not be written to localStorage. `loadProgress` merges an absent character field with defaults to preserve `plottwist-progress-v1` records.

## Data flow
1. Existing story or quiz code resolves the answer and calculates the next deterministic `BookProgress` exactly once.
2. After that resolution, it emits a `CharacterEvent` and safe runtime projection. The controller cannot access the progress setter.
3. The local provider selects at most one matching cue; the panel displays it and updates only `CharacterProgress.seenCueIds` when needed.
4. Remote chat begins only from user input after consent. The panel creates an `AbortController`, calls `/api/character-chat`, and maps response/error to a visible session state.
5. The server reads unprefixed `DEEPSEEK_*` variables from `.env.local`, validates and forwards allowed fields, then returns plain text or a safe error code.
6. Cancellation, language/view changes, unmount, provider failure, or unsafe output aborts/ends the request. The panel retains earlier turns and offers a local fallback cue.

## DeepSeek adapter safety contract
- Required server variables: `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`; use `.env.example` as the checked-in template and `.env.local` for actual values.
- The adapter sets an explicit server timeout (default 15 seconds) and response size limit, sends no notes or complete progress object, and never returns provider diagnostic details to the client.
- The system prompt identifies the assistant as a virtual vocabulary coach; requires the selected language, concise help, no answer revelation before submission, no sensitive-data requests, no human identity claims, and no dependency/secrecy language.
- Responses are validated as bounded plain text. Invalid output maps to `unsafe_output` and triggers the local fallback.

## Error handling
| Condition | UI behavior | Data behavior |
|---|---|---|
| Empty input | Disable/deny send with local validation message | No request |
| Cancel / view or language change | Stop loading and do not append late reply | Preserve completed session turns |
| Offline / timeout / rate limit / provider error | Safe recoverable error plus local cue | Do not modify learning progress |
| Malformed / unsafe output | Explain fallback without exposing provider details | Do not render output |
| Storage unavailable | Keep session functional for current view | Character persistence becomes optional |

## Accessibility and localization
All local cues use `Record<Lang, string>` rather than `Partial`; core control labels enter `src/i18n.ts` in all three languages. The panel has a concise `aria-live="polite"` status region for newly completed character responses. It must not take focus on background responses or autoplay sound. Dialog choices follow full keyboard and focus semantics.

## Testing strategy
- Unit: cue matching, priority, once behavior, locale completeness, request allowlist, sanitisation decision, cancellation, and migration from pre-character progress.
- Integration: event emission occurs after deterministic progress calculation; character effects cannot change learning fields; failed remote response produces a local fallback.
- E2E: local default flow; no request before consent; consented request loading/cancel/error states with a mocked server; language switch; keyboard/live-region basics; no-audio and reduced-motion paths.
- Validation: `npm test`, `npm run build`, and `npm run test:e2e` after implementation.

## Requirement traceability
| Requirement | Design element | Verification |
|---|---|---|
| 1.1–1.4 | CharacterController, LocalCueProvider | unit + integration |
| 2.1–2.3 | Read-only runtime context and event boundary | unit + integration |
| 3.1–3.6 | CharacterPanel, CharacterService, trusted server | integration + E2E |
| 4.1–4.4 | Consent UI, request allowlist, output validation | unit + E2E |
| 5.1–5.4 | localized cue data and accessible panel | unit + E2E |

## Dedicated character review page

`src/features/virtual-character/ReviewPage.tsx` is a standalone `Page = 'review'` route composed by `App.tsx`. It receives only `bookId`, `BookProgress`, and `lang`; it never receives `updateBook`, `setProgress`, or any mutable learning callback.

`reviewData.ts` provides explicit stable identities for Lin Zhi, Zhou, Xu Yao, and Shen Ye. Each definition includes a `Record<Lang, string>` name, role, coaching style, server-safe persona instruction, and local feedback/fallback copy. Story prose is not parsed to create identities.

The page derives a canonical word map from `books[bookId].words`, intersects it with progress string lists, then presents missed words before learned and mastered words. A word that appears in multiple lists is shown once. The local multiple-choice review is deterministic, local, and side-effect free.

Generated chat is user-initiated only. Before a learner answers the current local question, the UI does not request an explanation for that target word. After an answer and explicit consent, the browser sends the selected character's bounded persona instruction plus the learner's bounded question to `/api/character-chat`, with `answerCorrect` or `answerWrong` and the approved minimal context. `AbortController` cancels outstanding requests on examiner/language changes and component unmount. UI errors map to a local fallback; model responses remain plain text React content.

### Review-page traceability
| Requirement | Component | Verification |
|---|---|---|
| 6.1 | ReviewPage, reviewData | build + browser review |
| 6.2 | selectReviewWords | unit or browser review |
| 6.3 | local question state | build + manual review |
| 6.4–6.6 | ReviewPage chat service integration | build + mocked API/browser review |

## Oral-review conversation mode

The dedicated review route now implements a turn-based oral-study conversation rather than a free-form chat or multiple-choice-only card. Static SVG portraits in `public/characters/` represent the selected story examiner; `reviewAvatarSrc` maps stable role IDs to local assets. No remote image URL, biometric avatar, or user image is used.

`ReviewPage` maintains ephemeral `ready → answering → feedback` state. Starting or advancing a question adds one localized examiner turn; the learner submits one bounded text answer; `evaluateAnswer` compares normalized answer text with the canonical `Word` meaning and definition; a local examiner turn gives feedback and reveals the canonical meaning. The page then waits for a learner-controlled next-question action. This state is not written to `AppProgress` or `localStorage`.

`speakText` uses browser `SpeechSynthesis` only following an explicit start, replay, or next-question action. The page exposes mute/stop controls, visibly reflects active speech, stops speech on category, character, language, or unmount changes, and remains entirely text-operable if speech is unavailable.

With explicit consent, a completed answer triggers the existing trusted `/api/character-chat` boundary. The API receives only the current word/meaning, chapter/segment, coarse local result, selected persona instruction, and bounded answer; its reply is supplementary and cannot decide progression. Local evaluation, feedback, and next-question flow remain authoritative and available on every failure path.

### Oral-mode traceability
| Requirement | Component | Verification |
|---|---|---|
| 7.1 | reviewAvatarSrc, local SVG assets, ReviewPage | build |
| 7.2 | ReviewPage, speakText | build + manual browser check |
| 7.3 | evaluateAnswer, oral transcript state | build + manual browser check |
| 7.4 | ReviewPage consented feedback call | API typecheck + mocked/browser check |
| 7.5–7.6 | speech/cancellation effects and local fallback | build + manual browser check |

### Character role-play prompt layer

`characterQuestionTemplates` supplies at least two complete localized scenes per examiner. Lin Zhi frames words through evidence and conflicting logs; Zhou through security verification; Xu Yao through ledger and relationship tension; Shen Ye through strategic board review. Templates interpolate only the current canonical target word and its canonical example. The UI chooses templates deterministically by review round, so local spoken questions retain each character's voice without needing a remote model. Local correct/review feedback starts with each persona's character-specific feedback. Optional DeepSeek feedback is additionally instructed to remain in the selected fictional study-coach scene while never claiming to be a real person.
