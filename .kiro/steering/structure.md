---
inclusion: always
---
# PlotTwist Structure and Ownership

## Live source layout
#[[folder:src]]

## Existing ownership
- `src/App.tsx` owns page navigation, global preferences, current book, persistence orchestration, and the story/challenge composition boundary.
- `src/components/Story.tsx` owns deterministic segment and challenge interactions.
- `src/data.ts`, `src/storyLocale.ts`, and `src/i18n.ts` provide story, locale, and translation data.
- `src/logic.ts` owns persistence migration and deterministic question generation.
- `src/types.ts` defines the domain contracts.

## Virtual character layout
- Keep provider-independent character contracts in `src/features/virtual-character/types.ts` or a coherent extension of `src/types.ts`.
- Place static local personas and cue data in `src/features/virtual-character/data.ts`.
- Place UI in `src/features/virtual-character/components/`; state/event orchestration in `hooks/`; and browser API calls in `services/`.
- A future trusted backend owns `server/routes/character-chat.ts`, `server/providers/deepseek.ts`, and server-only prompt templates. No client component imports provider SDK code.
- `App.tsx` or a character context owns ephemeral session state so it survives the keyed remounts of `StoryReader` between segments and language changes.
- The StoryReader and ChapterChallenge emit typed learning events; the character controller may select and display cues but cannot receive `updateBook` or `setProgress` mutation access.
- Keep feature-specific decisions in `.kiro/specs/ai-virtual-character/`; promote only stable, multi-feature rules to steering.
