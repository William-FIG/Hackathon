# Bugfix Requirements Document

## Introduction

本修复处理项目答辩材料缺少一份精炼中文问答讲稿的文档缺口。讲稿须以 `summary.md` 已核查的事实为依据，清楚说明 PlotTwist 的创意、Kiro 开发治理、目标成效与愿景，且不得把未配置或尚未完成的能力表述为既成事实。

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN 评审需要了解 PlotTwist 的创意原创性、Kiro 如何推动实现、目标成效和愿景 THEN the system does not provide a single concise Chinese question-and-answer pitch script that addresses all four topics.
1.2 WHEN 评审需要了解 Steering、MCP Server、Agent Hooks 和 spec-driven development 的实际作用 THEN the system does not provide a source-grounded explanation that distinguishes configured project practices from unavailable or planned capabilities.
1.3 WHEN 评审根据现有材料判断项目交付范围 THEN the system requires them to synthesize evidence across the summary rather than receiving a persuasive, bounded statement of the implemented local learning core and optional AI role feedback.

### Expected Behavior (Correct)

2.1 WHEN 评审需要了解 PlotTwist 的创意原创性、Kiro 如何推动实现、目标成效和愿景 THEN the system SHALL provide a concise Chinese question-and-answer pitch script with a distinct answer for each of the four topics.
2.2 WHEN 评审需要了解 Steering、MCP Server、Agent Hooks 和 spec-driven development 的实际作用 THEN the system SHALL explain, using only summary-supported claims, the layered Steering constraints, the three configured character hooks, the requirements-to-design-to-tasks specification flow, and that no repository-configured MCP Server currently exists.
2.3 WHEN 评审根据答辩稿判断项目交付范围 THEN the system SHALL state that the delivered core is a local, three-language, deterministic vocabulary-story and notes game, describe the implemented optional consent-gated read-only character review feedback accurately, and distinguish the planned story-wide character system from the current implementation.
2.4 WHEN the pitch script asserts effectiveness or vision THEN the system SHALL connect the stated value to observable summary-supported mechanisms, including deterministic progress rules, offline usability, local fallback, privacy-minimized optional feedback, and existing validation assets without claiming unrun validation results.

### Unchanged Behavior (Regression Prevention)

3.1 WHEN project documentation describes provider integration THEN the system SHALL CONTINUE TO state that DeepSeek credentials remain server-only, are not exposed to the browser, and optional feedback is requested only after explicit consent and local answer completion.
3.2 WHEN project documentation describes learning outcomes THEN the system SHALL CONTINUE TO state that only the established deterministic story and quiz logic may change XP, chapter completion, unlocking, or mastery.
3.3 WHEN the pitch mentions MCP Server or virtual-character functionality THEN the system SHALL CONTINUE TO avoid claiming that a repository MCP configuration exists or that the planned story-wide companion system has already been implemented.
