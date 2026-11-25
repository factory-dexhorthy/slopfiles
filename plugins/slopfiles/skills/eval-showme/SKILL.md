---
name: eval-showme
description: Show the user what an eval case tests, turn by turn - the human message, an outline of the transcript and tool calls that matter, and the checks that grade it - in short text blocks. Use when the user invokes /eval-showme, or asks to see or explain an eval case, behavioral scenario, or eval task.
---

Show the user what an eval case tests, so they can read it without opening the test code. Skip the preamble and keep prose to one short line before each block.

## Find the case

Use the case the user names, or the one under discussion. Read its source, not a summary:

- A behavioral scenario (`*.scenario.test.ts`): the human turn constants, `gates` (deterministic checks on the transcript), `verify` (checks on files or other state the run leaves), and `rubric` (LLM judge criteria).
- A Harbor or eval-dataset task: `instruction.md` for the human input, `tests/` or the verifier for the checks, and the judge rubric if the task has one.
- Anything else: whatever holds the inputs, the expected behavior, and the grading.

If you can't tell which case the user means, ask.

## Lay it out

Write one `### Turn N: <what the turn tests>` section per human message, in order. Each section has three labeled `text` blocks:

1. `Human message:` the exact text sent, verbatim.
2. `Trajectory outline:` one line saying what the agent should do, then a block with only the tool calls, arguments, and replies that the checks depend on. Use `...` for steps that don't matter. Show alternatives that also pass as `either` / `or`.
3. `Check that` one line saying what passing means, then a block with one line per check that grades this turn: its kind (`deterministic`, `state`, or `judge`) in the first column, padded so the second column lines up, then the expected behavior as pseudocode. Write tool calls as calls with the arguments that matter and a count, such as `CreateTask({title: matches(/^Fix/)}) at least once`, `SendMessage({sessionId: A1, taskId: T2}) once`, or `CreateTask(*) never`. Use `*` for any arguments, and name the turns a count covers when it isn't just this one. Leave out check names from the source.

Put a check under the turn whose behavior it grades. A check that spans several turns goes under the last of them, naming the earlier turns it reads. Checks that grade the whole run, such as "the session completed" or a judge rubric over every turn, go in a final `### Whole run` section with only the checks block.

When two human messages are graded as one unit, keep them as separate turns, and put the shared check under the second.

End with at most two lines on anything surprising: a check that is weaker or stricter than its name suggests, a turn with no check, or a pass condition that depends on a timeout or a cap.

## Example

### Turn 1: a fix request gets a task

Human message:

```text
importBoard in src/serialize.ts drops every note's tags when it imports a board. Please get that fixed.
```

Trajectory outline: the orchestrator records the fix as a task, then hands it to an agent.

```text
CreateTask(title: "Fix importBoard dropping note tags", ...)
  -> task.id = T1
SpawnAgent(taskId: T1, ...)
  -> sessionId = A1          # turn 3 checks the hand-off goes back to A1
...
```

Check that at least one task is created for the fix:

```text
deterministic  CreateTask(*) at least once
```

### Turn 2: a question gets an answer, not a task

Human message:

```text
Which agent owns serialize?
```

Trajectory outline: the orchestrator answers from what it already knows.

```text
(reply naming A1)
no CreateTask call
```

Check that answering creates no task (graded with turn 3):

```text
deterministic  CreateTask(*) never, in this turn or "Are its tests green?"
```

### Whole run

```text
deterministic  session ends without an error or a timeout
state          shared folder holds at least one task file
judge          every CreateTask({title}) and UpdateTask({title}):
                 starts with an imperative verb (Fix, Add, Investigate, ...)
                 names an outcome, not a step like "open a PR" or "run tests"
                 has no "Label:" prefix and is not a question
```
