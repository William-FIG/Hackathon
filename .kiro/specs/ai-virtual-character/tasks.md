# Implementation Plan — AI Virtual Character

- [ ] 1. Establish character domain contracts and persisted defaults
  - Add provider-neutral character, cue, event, runtime-context, session, and error contracts.
  - Add minimal `CharacterProgress` defaults and backward-compatible migration under the existing `plottwist-progress-v1` key.
  - Keep session transcript and generated text ephemeral by default.
  - Add unit tests for migration and domain invariants.
  - Dependencies: none
  - Requirements: 1.1, 1.3, 2.1, 4.3

- [ ] 2. Implement and validate the local scripted cue provider
  - Add one or more locally bundled virtual character definitions with complete `zh-CN`, `zh-HK`, and `en` identity and cue content.
  - Implement event matching, priority, one-time display, and safe vocabulary-context interpolation.
  - Validate unique IDs, known word references, valid chapter/segment bounds, complete locales, and prohibited mutation effects.
  - Add focused Vitest coverage.
  - Dependencies: 1
  - Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.3, 5.1

- [ ] 3. Create the sidecar character controller and accessible panel
  - Compose the controller above keyed StoryReader and ChapterChallenge instances so ephemeral session state survives a segment remount.
  - Emit typed events only after existing deterministic logic resolves a result.
  - Build a keyboard-operable labelled panel with expand/collapse, visible text, polite status announcements, no autoplay, and reduced-motion-safe behavior.
  - Add all new shared character UI labels to the three-language translation data.
  - Dependencies: 1, 2
  - Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 5.1, 5.2, 5.4

- [ ] 4. Add consent, character-data controls, and local fallback UX
  - Implement explicit remote-chat disclosure and consent/revocation controls.
  - Implement clearing of minimal persisted character progress without resetting unrelated story progress unless the user explicitly requests it.
  - Add loading, cancellation, failure, retry, and local fallback states while preserving completed turns.
  - Dependencies: 1, 3
  - Requirements: 3.1, 3.4, 3.5, 4.1, 4.3, 5.2, 5.3

- [ ] 5. Implement the trusted DeepSeek server adapter
  - Add the Vercel Serverless route `api/character-chat.ts` for `/api/character-chat`; it reads only unprefixed server environment variables and is verified separately by `tsconfig.api.json`.
  - Enforce request allowlists, bounded input/history, AbortSignal cancellation, server timeouts, provider-neutral response mapping, per-instance rate limiting, and safe plain-text output validation.
  - Do not add a client-side DeepSeek SDK or expose any `DEEPSEEK_*` values to Vite.
  - Add tests with mocked provider calls, including timeout, cancellation, and unsafe response fallback.
  - Status: core route, allowlist, timeout, rate-limit, and reply-safety implementation added; mark complete only after server-response tests and deployment smoke validation.
  - Dependencies: 3, 4
  - Requirements: 3.2, 3.3, 3.4, 3.5, 3.6, 4.2, 4.4

- [ ] 6. Validate the complete character flow
  - Run `npm test`, `npm run build`, and `npm run test:e2e`.
  - Extend E2E coverage for local-only behavior, no external request without consent, remote loading/cancel/error fallback with a mocked endpoint, language switch, keyboard access, and no-audio operation.
  - Manually verify that the character cannot reveal an answer before selection or change XP, mastered words, completion, or unlocks.
  - Dependencies: 1, 2, 3, 4, 5
  - Requirements: 1.1–1.4, 2.1–2.3, 3.1–3.6, 4.1–4.4, 5.1–5.4

- [x] 7. Add the standalone story-character review page
  - Add stable, fully localized character definitions for Lin Zhi, Zhou, Xu Yao, and Shen Ye.
  - Add the `review` page route and main navigation entry.
  - Derive current-book review pools from canonical words and read-only `missed`/`learned`/`mastered` progress.
  - Implement local multiple-choice examination without a learning-progress mutation path.
  - Requirements: 6.1, 6.2, 6.3

- [x] 8. Connect consented review chat to the DeepSeek boundary
  - Add explicit consent, bounded learner input, request cancellation, loading/error/retry states, and local character fallback.
  - Send only post-answer word context to `/api/character-chat`; do not pass notes, full progress, credentials, or transcript history.
  - Requirements: 3.1–3.6, 4.1–4.4, 5.1–5.4, 6.4–6.6

- [ ] 9. Add stable browser coverage for the character review route
  - Extend the browser smoke flow after the entry-level workflow is stable, covering character selection, local answer feedback, consent gating, and unavailable-API fallback.
  - Requirements: 6.1–6.6

- [x] 10. Upgrade character review to a turn-based oral conversation
  - Add bundled local SVG portraits for each supported story examiner.
  - Replace local option selection with one text-answer turn at a time, local meaning evaluation, visible feedback, and learner-controlled next question.
  - Add text and browser-speech question output, voice replay/mute/stop controls, and transcript presentation.
  - Requirements: 7.1, 7.2, 7.3, 7.5, 7.6

- [x] 11. Add optional generated feedback to completed oral turns
  - Reuse the consent-gated `/api/character-chat` boundary only after a local answer is complete.
  - Keep local feedback and next-question controls available during cancellation, unavailable service, or unsafe output fallback.
  - Requirements: 7.4, 7.5, 7.6

- [ ] 12. Add stable browser coverage for oral review
  - Once concurrent HMR changes stop, add/execute browser coverage for a local spoken question, text answer, local feedback, next question, voice controls, consent gate, and API-failure fallback.
  - Requirements: 7.1–7.6

- [x] 13. Add a localized story-role prompt layer to oral review
  - Define character-specific scene templates and feedback styles for Lin Zhi, Zhou, Xu Yao, and Shen Ye.
  - Interpolate only canonical word/example data and keep optional generated feedback inside the selected fictional learning scene.
  - Requirements: 7.2, 7.3, 7.4, 7.7
