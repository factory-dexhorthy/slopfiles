---
name: eval-showme
description: Explain an eval to the user in short text blocks - either what one eval case tests, turn by turn, or the story of how a prompt was arrived at line by line against its evals, with results per model at each step. Use when the user invokes /eval-showme, asks to see or explain an eval case, behavioral scenario, or eval task, or asks how a prompt or reminder got its current wording.
---

Pick the view that matches what the user asked for, read its reference, and follow it.

- **What a case tests**: the human messages, the tool calls that matter, and the checks that grade each turn. Read `references/eval-showme.md`. This is the default.
- **How the prompt got here**: the current prompt text, the evals it has to pass, and each line that was added, tried, or dropped, with the results before and after it. Read `references/eval-story.md`. Use it when the user asks for the story, the history, or why the prompt says what it says.

If the user wants both, tell the story first and lay out the cases after it.
