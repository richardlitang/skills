# Translation Philosophy & Language-Specific Rules

## Core Principles

**The "Café Test"**: If a user wouldn't say the phrase to a friend at a coffee shop, don't use it.

**Action over Grammar**: Prioritize short, punchy, active verbs (e.g., "Task added" not "The task has been added")

**The "Loanword Rule"**: If the local tech community uses the English word (e.g., "Streak", "Buffer", "Widget"), KEEP IT IN ENGLISH unless forcing a native translation sounds natural.

**Act as a native UI/UX Designer** from the target region building a productivity app for local peers. Avoid textbook language, formal vocabulary, or poetic phrasing. Use the language people actually speak in professional but casual settings.

---

## Group A: The "Code-Switchers" (Mix English tech terms fluidly)

### Tagalog/Filipino (tl)
- **Style**: Modern Manila professional
- **English terms**: Keep "Streak", "Buffer", "Widget", "Focus", "Task" in English if commonly used
- **Mixing**: English nouns with Filipino verbs naturally ("Mag-focus", "I-save ang task")
- **Tone**: Conversational Taglish, NOT formal Filipino
- **Example**: "Burahin" (Delete), but "Task added" stays as-is

### Hindi (hi) - Hinglish Style
- **Script**: Devanagari
- **English phonetics**: Use transliterated English for tech terms
- **Tech vocabulary**: Keep "Task", "Focus", "Streak", "Buffer" in transliterated English
- **NO pure Sanskrit**: Should sound like Bengaluru/Mumbai techie, not textbook Hindi
- **Tone**: Conversational, friendly with English tech vocabulary

---

## Group B: The "Katakana/Loanword" Adopters (Transliterate the sound)

### Japanese (ja)
- **UI nouns**: Use Katakana (Task → タスク, Buffer → バッファ, Theme → テーマ)
- **Avoid old Kanji**: Keep it modern and clean
- **Politeness**: です/ます usually dropped for labels, kept for dialogs
- **Example**: "保存" (Save) acceptable, but "Streak" → "ストリーク"
- **Keep it short**: Japanese text often longer - prioritize brevity

---

## Group C: The "Strict Translators" (Translate everything, avoid English)

### French (fr)
- **Rule**: Translate EVERYTHING - don't leave "Streak" or "Buffer" in English
- **Examples**: "Streak" → "Série", "Buffer" → "File d'attente" or "Zone tampon"
- **English = error**: English words in French UI look like translation mistakes
- **Exception**: "Widget" is now accepted tech terminology
- **Length**: Keep strings SHORT - French tends to be ~20% longer than English

### Spanish (es)
- **Rule**: Translate everything
- **Examples**: "Streak" → "Racha", "Buffer" → "Cola"
- **Neutral Spanish**: Use terms that work for LatAm and Spain ("Iniciar" not "Arrancar")
- **NO Spanglish**
- **Tone**: Natural and conversational, not stiff

### German (de)
- **Rule**: Translate most terms
- **Examples**: "Streak" → "Serie", "Buffer" → "Puffer"
- **English OK**: "Cockpit", "Widget", "Pro" are understood
- **CRITICAL**: Keep strings SHORT - German is ~30% longer than English
- **Compound words**: Use wisely, abbreviate if needed to save space
- **UI constraint**: If German text doesn't fit, rethink the phrase

---

## Group D: The "Flexible Translators"

### Portuguese (pt) - Brazilian Style
- **Brand terms**: Keep "App", "Widget", "Pro" in English
- **UI actions**: Translate ("Streak" → "Sequência", "Buffer" → "Fila")
- **Formality**: Use informal "você" style, not formal business Portuguese
- **Tone**: Conversational and friendly

---

## Quick Reference Table

| Language | Code-Switching? | "Streak/Buffer/Widget" | Length vs English |
|----------|-----------------|------------------------|-------------------|
| Filipino (tl) | ✅ YES | Keep English tech terms | Similar |
| Hindi (hi) | ✅ YES (Hinglish) | Keep English (transliterated) | Similar |
| Japanese (ja) | ❌ NO | Transliterate in Katakana | ~10% longer |
| French (fr) | ❌ HARD NO | Translate everything | ~20% longer |
| Spanish (es) | ❌ NO | Translate everything | ~10% longer |
| German (de) | ⚠️ MAYBE | Usually translate | ~30% longer |
| Portuguese (pt) | ⚠️ SOMETIMES | Translate actions, keep brands | ~10% longer |

---

## Translation Checklist

Before submitting translations:

1. **Café Test**: Would a local say this phrase naturally?
2. **Tech terms**: Did you follow the code-switching rules for this language?
3. **Length**: Does it fit in the UI? (Critical for German, French)
4. **Tone**: Professional but casual, not textbook formal
5. **Consistency**: Same term used across all strings?
