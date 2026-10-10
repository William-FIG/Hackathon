---
inclusion: fileMatch
fileMatchPattern:
  - "src/features/virtual-character/**/*.ts"
  - "src/features/virtual-character/**/*.tsx"
  - "src/components/Story.tsx"
  - "src/App.tsx"
  - "src/types.ts"
  - "src/logic.ts"
  - "server/routes/character-chat.ts"
  - "server/providers/deepseek.ts"
---
# AI Virtual Character Engineering Rules

## Domain boundaries
- Model `VirtualCharacterDefinition`, `CharacterCue`, `CharacterEvent`, `CharacterProgress`, and `CharacterSession` explicitly. Do not overload the existing open-ended `BookProgress.choices` object for all character state.
- Persist only the selected character, enabled state, consent version, seen cue IDs, and learner-selected choices when required. Do not persist raw prompts, full conversations, generated free text, or precise behavioral timelines by default.
- Use stable, namespaced IDs such as `character.guide.intro.word-wrong`. Validate that cue IDs are unique and referenced words and chapter/segment positions exist.
- Effects may change only character-domain state. Do not allow cue configuration or LLM output to mutate `xp`, `unlocked`, `completed`, `mastered`, `missed`, or answer correctness.

## UX, language, accessibility
- Supply complete `Record<Lang, string>` content for character dialogue and character identity fields. Use `translator` for short shared UI labels and `wordMeaning` for vocabulary meanings; do not duplicate language-selection logic.
- Mark the UI as a virtual learning character. Show a visible loading, cancellation, failure, retry, and local-fallback state for optional generated mode.
- Use native buttons and a labelled `aside` or `region` for a persistent panel. A blocking choice needs a fully accessible dialog: named label, described content, initial focus, Escape close, focus trap, and focus restoration.
- Use a single focused `aria-live="polite"` status for newly completed assistant messages. Do not announce entire transcripts or auto-open the chat panel.
- Never auto-play speech. Respect existing audio controls and `prefers-reduced-motion`; provide text equivalents for every character message.

## Remote DeepSeek mode
- Use remote mode only after explicit, revocable consent. Disclose the provider and the exact minimal fields transmitted.
- The server validates message count and length, removes unsupported content, imposes timeouts and rate limits, and maps upstream errors to safe user-facing codes.
- On offline, timeout, rate-limit, cancellation, malformed output, or safety rejection, retain completed turns and immediately use a relevant local cue without blocking study.
