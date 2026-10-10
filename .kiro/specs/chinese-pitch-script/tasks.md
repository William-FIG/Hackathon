# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - 中文四问四答讲稿完整且有事实依据
  - **CRITICAL**: This test MUST FAIL on unfixed materials; the failure confirms the documentation gap.
  - **IMPORTANT**: Write and run this structured content test BEFORE creating `docs/CHINESE_PITCH_SCRIPT.md`; do not change the source material when it fails.
  - **GOAL**: Surface the absence of one concise, source-grounded `zh-CN` script that answers originality, Kiro practices, goal effectiveness, and vision.
  - **Scoped PBT Approach**: Treat every permutation of `{原创性, Kiro 实践, 目标成效, 愿景}` in a `zh-CN` pitch request as an input satisfying `isBugCondition(request)` when no qualifying script exists. Assert `expectedBehavior(script, summaryFacts)`: exactly four distinct questions, one answer per topic, and every claim traceable to `summary.md`.
  - Inspect the unfixed document set and record the expected counterexamples: no unified four-question script; a generic Kiro answer could wrongly imply a configured MCP Server; a role description could conflate the delivered review page with the planned story companion; validation assets could be mistaken for passing results.
  - Run the check on the unfixed materials; **EXPECTED OUTCOME**: failure because `docs/CHINESE_PITCH_SCRIPT.md` is absent.
  - Document the concrete counterexample and preserve it for the implementation review.
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.4_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - 安全、学习结果与交付范围的事实边界
  - **IMPORTANT**: Follow observation-first methodology using only the existing `summary.md` and `bugfix.md`.
  - Observe and record the unfixed factual baselines for all inputs where `isBugCondition` is false: no repository-configured MCP Server; the delivered character capability is independent, read-only, consent-gated review feedback; the story-wide companion remains planned; tests/build/deployment were not run during the summary review.
  - Write property-based content checks that generate combinations of provider, learning-result, role-scope, MCP-status, and validation-status claims. For every non-bug-condition claim, assert the preserved rendering never exposes `DEEPSEEK_*` credentials, never removes the explicit-consent plus completed-local-answer condition, never authorizes the role to change XP/completion/unlocking/mastery, never says MCP is configured, never says the planned companion is delivered, and never says unrun validation passed.
  - Verify these checks pass against the unfixed factual sources before writing the pitch script.
  - **EXPECTED OUTCOME**: passing baseline checks that capture the observed facts to preserve.
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Fix the Chinese four-question Q&A pitch-script documentation gap
  - [ ] 3.1 Create `docs/CHINESE_PITCH_SCRIPT.md` as a concise, directly readable `zh-CN` four-question script
    - Use exactly four question-and-answer sections in this order: 创意原创性、Kiro 实践、目标成效、愿景.
    - Base every implementation, configuration, validation, and roadmap statement exclusively on `summary.md`; add a final `事实依据：summary.md` traceability note and a compact scope statement.
    - In the originality answer, connect the original six-chapter vocabulary story, three-language experience, and local Notes to Game without claiming unrecorded external content or an already-delivered story-wide AI companion.
    - In the Kiro answer, accurately cover layered Steering (`product`/`structure`/`tech`/character detail/`spec-governance`), the three character hooks and their trigger/value, and the requirements → design → tasks workflow. Explicitly state that no repository-configured MCP Server exists.
    - In the effectiveness answer, tie the local three-language deterministic learning core, offline usability, local fallback, consent-gated privacy-minimized optional feedback, and validation assets to observable evidence; describe tests only as existing assets or executable checks, never as unrun passing results.
    - In the vision answer, present a future story-side companion as pending spec work that may extend the current independent, read-only review experience; retain that only deterministic story/quiz logic changes XP, chapter completion, unlocking, and mastery, and that DeepSeek credentials remain server-only.
    - _Bug_Condition: `isBugCondition(request)` where `request.language = 'zh-CN'`, `request.requiredTopics = {originality, kiroPractices, goalEffectiveness, vision}`, and no concise source-grounded script exists._
    - _Expected_Behavior: `expectedBehavior(script, summaryFacts)` returns true: four Chinese Q&As cover exactly the required topics; all claims are summary-supported; MCP absence, delivered-review/planned-companion distinction, and unrun-validation boundary are explicit._
    - _Preservation: Preserve server-only credentials, explicit consent after local answer completion, deterministic-only learning mutations, absent repository MCP configuration, and the planned status of the story-wide companion._
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - 中文四问四答讲稿完整且有事实依据
    - **IMPORTANT**: Re-run the same check from task 1; do not write a replacement test.
    - Check every generated ordering of the four required topics resolves to the one fixed four-section script, with all content in `zh-CN`, exactly one answer per topic, and claims traceable to `summary.md`.
    - **EXPECTED OUTCOME**: pass, confirming the document repairs the bug condition.
    - _Requirements: 2.1, 2.4_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - 安全、学习结果与交付范围的事实边界
    - **IMPORTANT**: Re-run the same checks from task 2; do not write new preservation tests.
    - Confirm the finished script retains every observed safety, consent, deterministic-learning, MCP-status, implementation-scope, and unrun-validation boundary.
    - **EXPECTED OUTCOME**: pass, confirming no factual or product-boundary regressions.
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Checkpoint - Validate the documentation deliverable
  - Review `docs/CHINESE_PITCH_SCRIPT.md` against `summary.md`, `bugfix.md`, and this design for exact four-topic coverage, concise oral-readability, source grounding, and all factual safeguards.
  - Confirm the change is documentation-only and has not modified application code, existing specs, or validation-status claims.
  - Record the exploration counterexample, preservation baseline, and final content-check results as completion evidence. Do not report `npm test`, build, or browser checks as passing unless they are actually run in the implementation phase.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_
