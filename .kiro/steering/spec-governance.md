---
inclusion: auto
name: spec-governance
description: Use when creating, reviewing, implementing, or synchronizing Kiro specifications, requirements, designs, and tasks.
---
# Spec Governance

1. This repository uses Requirements-First feature specifications unless the user explicitly approves a design-first workflow.
2. Keep `.kiro/specs/<feature>/requirements.md`, `design.md`, and `tasks.md` synchronized in that order: user-visible behavior first, technical design second, executable work third.
3. Every functional requirement uses EARS-style acceptance criteria: `WHEN <condition>, THE SYSTEM SHALL <observable behavior>`.
4. Every design component and implementation task must cite the relevant requirement IDs. Every completed task needs a concrete verification result.
5. Update requirements for changed behavior; update design for changed interfaces, data models, architecture, error handling, privacy, or data flow; update tasks for changed scope, dependency, or completion state.
6. Before implementation, inspect the related spec and applicable steering. Do not silently broaden feature scope or convert one-off feature details into workspace-wide steering.
7. Treat tests, build output, and acceptance checks as evidence. Do not mark work complete merely because code or documentation exists.
