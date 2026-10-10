# PlotTwist — Judging Q&A Script

## 1. How original and creative is your idea?

**Answer:** PlotTwist turns vocabulary practice into a six-chapter mystery story: learners unlock the next plot point by understanding and using English words, rather than by completing isolated flashcards. The experience is available in Simplified Chinese, written Hong Kong Cantonese, and English. We also added **Notes to Game**, which turns a learner’s own structured notes into a local mini-game. The creativity is in combining narrative motivation, multilingual support, and learner-owned study material in one browser-first experience—not in relying on AI to generate the learning outcome.

## 2. How well did you use Kiro to bring the concept to life?

**Answer:** We used Kiro as a development-governance system, not just as a code generator. Layered Steering defined the product rules, module ownership, technology stack, security, and virtual-character constraints. Three Agent Hooks align character tasks with the spec before work starts, prompt spec updates after relevant saves, and run `npm test` after task completion. Our spec-driven flow links **requirements → design → tasks**, so privacy, cancellation, accessibility, and deterministic learning rules stay traceable. We should be transparent: the repository has **no configured MCP Server**; Kiro’s steering, hooks, specs, and built-in workflow were the configured practices used here.

## 3. How effectively does your project address the chosen goal?

**Answer:** The goal is practical vocabulary learning with strong learner control. PlotTwist provides a local, three-language core where story progress, XP, unlocking, and mastery are decided only by deterministic story and quiz logic. It also works without an account, network connection, or API key. The optional character review page prioritizes missed words, gives local feedback first, and requests DeepSeek feedback only after a learner has completed an answer and explicitly consented. The request is minimized, cancellable, server-protected, and has a local fallback. Vitest, API tests, and a Playwright smoke script are included as validation assets; we do not claim that they were run and passed during this review.

## 4. How clearly and persuasively did you pitch your vision?

**Answer:** Our vision is simple: make vocabulary practice feel like progress in a story, while keeping the learner—not the model—in control. Today, we have the local story game, Notes to Game, and an independent, read-only character review experience. Next, the existing specification can extend that review experience into a story-side study companion that reacts to deterministic learning events. It will remain optional, consent-gated, multilingual, and unable to change XP, mastery, chapter completion, or unlocks. DeepSeek credentials stay server-only. This roadmap is persuasive because it grows from a working local-first foundation instead of promising that AI will replace the learning design.

---

**Evidence base:** `summary.md`  
**Scope note:** The delivered character capability is the independent, consent-gated review page. A story-wide virtual companion remains planned spec work, not a completed feature.
