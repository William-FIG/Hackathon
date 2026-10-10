---
inclusion: always
---
# PlotTwist Product Context

## Product
PlotTwist is a browser-first interactive vocabulary game for university learners. English vocabulary advances an original six-chapter story, while user-provided notes can become local knowledge games. It supports Simplified Chinese (`zh-CN`), written Hong Kong Cantonese (`zh-HK`), and English (`en`).

## AI virtual character goal
The virtual character is an optional study companion inside the vocabulary story. It gives concise, encouraging, word-focused guidance when learners enter a segment, answer correctly or incorrectly, master a word, retry a chapter, or pass a chapter.

## Product invariants
- Learning outcomes remain deterministic: only the established story and quiz logic may update XP, chapter completion, unlocking, or mastery.
- The character is an observer and coach. It must not provide answers before a learner responds, bypass a vocabulary check, or manipulate scores and progress.
- The default experience is local, scripted, and usable without an account, network connection, or API key.
- Generated mode is optional. It must be clearly labelled as AI-generated, require explicit user consent before data leaves the device, and provide a local scripted fallback.
- Never claim that the character is a person, encourage emotional dependency, ask users to keep secrets, or request personal, school, location, contact, health, or financial information.
- Existing story, Notes to Game, local PDF processing, audio, persistence, and three-language flows must keep working.
