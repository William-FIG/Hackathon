# Requirements Document — AI Virtual Character

## Introduction
Add an optional AI virtual learning character to PlotTwist's vocabulary story. The character provides context-sensitive coaching while preserving the project's deterministic learning rules, local-first baseline, three-language experience, and privacy commitments. A scripted local character is always available; generated DeepSeek chat is a consented optional enhancement through a trusted server boundary.

## Requirement 1: Provide a local study companion

**User Story:** As a learner, I want a virtual character to react to my study activity, so that I receive timely encouragement and vocabulary guidance without relying on an internet connection.

### Acceptance Criteria
1. WHEN a learner enters a story segment, answers a vocabulary interaction, completes a chapter question, retries a chapter, or passes a chapter, THE SYSTEM SHALL select at most one relevant local character cue using the current language, word, and learning event.
2. WHEN the character displays a vocabulary explanation, THE SYSTEM SHALL use the same target word and localized meaning as the current vocabulary activity.
3. WHEN a relevant local cue has already been displayed and is configured as one-time, THE SYSTEM SHALL not display it again for the same persisted character progress.
4. WHEN no cue matches an event, THE SYSTEM SHALL leave the learning flow uninterrupted.

## Requirement 2: Preserve learning authority

**User Story:** As a learner, I want the character to support rather than alter my learning outcomes, so that my progress remains fair and predictable.

### Acceptance Criteria
1. WHEN a character cue, chat response, or character choice is processed, THE SYSTEM SHALL not change answer correctness, XP, word mastery, chapter completion, or chapter unlock state.
2. WHEN the character is unavailable, disabled, collapsed, or fails to respond, THE SYSTEM SHALL preserve the existing vocabulary, story, quiz, and progression behaviors.
3. WHEN a learner has not answered the current question, THE SYSTEM SHALL not reveal the correct option through the character.

## Requirement 3: Offer optional generated DeepSeek chat safely

**User Story:** As a learner, I want to ask the virtual character a study question, so that I can receive tailored assistance while controlling whether any data is sent to an AI provider.

### Acceptance Criteria
1. WHEN generated chat has not received explicit consent, THE SYSTEM SHALL use local scripted guidance and SHALL not send a request to an external AI provider.
2. WHEN a learner explicitly opts into generated chat and submits a non-empty message, THE SYSTEM SHALL send only the allowed minimal context through the application's trusted `/api/character-chat` server boundary and SHALL present an in-progress state.
3. WHEN generated chat completes successfully, THE SYSTEM SHALL append a plain-text response in display order, visibly label it as AI-generated, and keep it separate from deterministic character cues.
4. WHEN a learner cancels a generated request, changes language, leaves the relevant view, or the component unmounts, THE SYSTEM SHALL abort the request and SHALL not append a late response.
5. WHEN the server, network, provider, or response validation fails, THE SYSTEM SHALL show a recoverable safe error, preserve completed messages, and offer an applicable local scripted fallback.
6. WHEN DeepSeek credentials are configured, THE SYSTEM SHALL access them only from a trusted server runtime and SHALL never expose them in browser code, client storage, rendered markup, logs, or `VITE_*` environment variables.

## Requirement 4: Protect privacy and learner safety

**User Story:** As a learner, I want transparent control over AI chat, so that I understand and can limit what leaves my device.

### Acceptance Criteria
1. WHEN generated chat is enabled, THE SYSTEM SHALL disclose the provider, purpose, minimal data fields sent, and a way to revoke consent before the first external request.
2. WHEN composing a generated request, THE SYSTEM SHALL include only the active language, current target word and localized meaning, current story position, coarse learning event, and learner-provided chat message; it SHALL exclude notes text, complete progress data, persistent identifiers, API credentials, and unrelated device data.
3. WHEN the learner revokes consent or clears character data, THE SYSTEM SHALL stop generated requests and remove locally persisted character consent, selection, seen-cue, and choice data.
4. WHEN displaying remote output, THE SYSTEM SHALL render it as text and SHALL reject or replace responses that attempt to reveal answers before submission, request sensitive personal information, claim human identity, or encourage secrecy or dependency.

## Requirement 5: Maintain inclusive three-language interaction

**User Story:** As a learner, I want the character to work in my selected language and with assistive technology, so that coaching is usable throughout the game.

### Acceptance Criteria
1. WHEN the learner uses `zh-CN`, `zh-HK`, or `en`, THE SYSTEM SHALL provide all character identity, local cue, state, consent, error, fallback, and action text in that language without falling back to an unintended language.
2. WHEN a completed character message appears after a user-initiated action, THE SYSTEM SHALL announce a concise status through a polite live region without moving keyboard focus or repeatedly announcing the full transcript.
3. WHEN a learner operates character controls by keyboard, THE SYSTEM SHALL expose native labelled controls and, for a modal choice flow, Escape close, focus containment, and focus restoration.
4. WHEN audio is disabled, unavailable, or reduced motion is preferred, THE SYSTEM SHALL keep the entire character experience usable through text without autoplaying speech or mandatory animation.

## Requirement 6: Provide a dedicated character-led vocabulary review page

**User Story:** As a learner, I want to visit a separate review page and choose a story character as my vocabulary examiner, so that I can revisit words without interrupting or changing my story progress.

### Acceptance Criteria
1. WHEN a learner opens the character review page, THE SYSTEM SHALL show the current word book and allow the learner to choose from named story-character examiners with complete `zh-CN`, `zh-HK`, and `en` identities and coaching styles.
2. WHEN a learner selects a review category, THE SYSTEM SHALL derive review words only from the canonical current word book and the current book's `missed`, `learned`, and `mastered` progress fields; it SHALL prioritize missed words without duplicating overlapping progress entries.
3. WHEN a learner answers a local review question, THE SYSTEM SHALL provide local character feedback and SHALL not change XP, word mastery, completion, unlock state, chapter, or segment.
4. WHEN a learner has not consented to generated chat, THE SYSTEM SHALL keep the local review examiner fully usable and SHALL not send an external request.
5. WHEN a learner consents and asks about a completed review question, THE SYSTEM SHALL send only the current language, selected current-book word and localized meaning, current story position, coarse answer result, and question through `/api/character-chat`.
6. WHEN generated review chat is loading, cancelled, unavailable, rate-limited, times out, or returns unsafe output, THE SYSTEM SHALL preserve existing local review content, show a recoverable state, and display a relevant local character fallback.

## Requirement 7: Conduct an interactive oral review conversation

**User Story:** As a learner, I want a visible story character to ask one vocabulary question at a time with text and optional voice, so that I can type an answer, receive an evaluation, and continue as in a focused study conversation.

### Acceptance Criteria
1. WHEN a learner selects an examiner, THE SYSTEM SHALL display that character's bundled virtual portrait, localized name, role, and coaching style without fetching a remote avatar.
2. WHEN a learner starts the oral review or explicitly advances to the next question, THE SYSTEM SHALL display a single word-meaning question and, when browser speech is available and enabled, speak that question using the selected interface language.
3. WHEN a learner submits a non-empty text answer, THE SYSTEM SHALL append the learner answer to the conversation, give a local evaluation against the canonical current-book meaning, show the correct meaning, and preserve all learning-progress fields.
4. WHEN a learner has consented to optional generated feedback, THE SYSTEM SHALL send only the completed-answer minimal context to `/api/character-chat` and append the plain-text reply as supplementary character feedback.
5. WHEN speech is unavailable, muted, stopped, generated feedback is cancelled, or generated feedback fails, THE SYSTEM SHALL continue the text-based question, local evaluation, and next-question flow without interruption.
6. WHEN a learner changes character, language, or review category, THE SYSTEM SHALL cancel in-flight generated feedback, stop active speech, clear the transient answer state, and begin a new conversation context without retaining generated transcript content beyond the current page session.

7. WHEN the examiner poses or evaluates a review turn, THE SYSTEM SHALL use that character's localized story-role template and feedback style, placing the target word in a relevant fictional evidence, relationship, security, or boardroom scenario rather than presenting a generic dictionary prompt.
