# Tell how the prompt got here

Tell the story of how a prompt, reminder, or tool description reached its current wording: what the evals check, what failed without each line, what was tried and dropped, and what each line fixed. The reader should finish knowing why every line is there and what would break without it.

## Gather the record

Read the sources; don't rebuild results from memory:

- The PR description, if one exists. A 4.1.1-style description often already has the story; tighten it rather than rewriting it.
- `git log -p` on the file that holds the prompt text, for the order of changes and the commit that added each line.
- The eval runs: scores, trial counts, and per-trial transcripts or verifier output for each model (use the `eval-runs` skill for hosted runs).
- The eval source, for the cases and checks (see `eval-showme.md`).
- The session history, for wording that was tried and dropped and the reason.

Report only results you found. Mark a cell `not run` when a model wasn't run at that step, and `not recorded` when it was run but you can't find the result. If the record is too thin to tell the story, say what's missing and ask.

## Lay it out

Use these sections, in this order. Keep each one to a few lines plus its blocks.

### What the model sees

The current prompt text, in full, in a `text` block. Then one line on who gets it and when, if that isn't obvious.

### Evals

One table, one row per human turn:

```text
| Case | Human turn | Check |
```

Quote each human turn verbatim. Write each check in the same pseudocode as `eval-showme.md`, such as `CreateTask(*) never` or `judge: the link names a heading`. Follow the table with one line on how runs were done: where (local or CI, which backend), how many trials, whether a run stops at the first pass, and which models.

### Baseline

Results with none of the new text, one line per model or a table. Say what the agent did instead of passing, such as "every trial starts an agent with SpawnAgent and never calls CreateTask".

### One section per change, in the order it was made

Title each section `### Line N, for <case it fixes> ([<short sha>](<commit url>))`. A section for a change to the eval itself, such as rewording a human turn or changing the judge, is titled for that change instead. Cases that passed with no new text get a short section saying so.

In each section:

1. One line on what failed and why the new text targets it.
2. The change as a `diff` block, with the line before it as context. Use a `text` block for the first line.
3. Wording that was rejected or tried and dropped, quoted verbatim, each with one line on why: what it steered the model toward, or which results got worse.
4. A results table for the cases this change targets:

```text
| Model | Without the line | With the line |
| --- | --- | --- |
| Opus 5.5 | 0/2: no links | passed trial 1 |
| GPT-6.2 Sol | 0/2: it wrote links, but the judge failed its choice of heading | passed trial 1 |
| Auto | 0/2: no link, or no heading in the link | passed trial 1 after a judge change |
```

Write a failing cell as `<passes>/<trials>: <what the agent did>`, in a few words that name the behavior, not the check. Write a passing cell as `passed trial N`. Add a caveat when the pass depends on something other than the line, such as "after a judge change", and explain that change in its own section. When a change needs a whole-run rerun, add a row or a line for any earlier case that regressed.

Keep the tables to the results that bear on the line. When a later run on the same model is the "without" for the next line, reuse it rather than rerunning it.

### Where it stands

The final commit, linked, and a case-by-model table at that commit:

```text
| Case | Opus 5.5 | GPT-6.2 Sol | Auto |
| --- | --- | --- | --- |
| E1 | pass | pass | pass |
| E4 | pass | pass | fail 2/2 (one task for both deliverables) |
| Run | pass, trial 1 | pass, trial 1 | fail, 0/2 |
```

Then known gaps, one line each: which models are the target, which aren't and why, and any failure no wording has fixed yet. End with what comes next, if it's known.

## Example

A section from the 4.1.1 handoff story, after line 1 was in place:

### Line 2, for E4 ([`eda01ddfa02`](https://github.com/Factory-AI/factory-mono/commit/eda01ddfa0241e885293859773aa0bb5e9d3ce2f))

E4 asks for two deliverables and a test run that checks both. Without line 2, the orchestrator made one task for both deliverables.

```diff
 Before you hand work the human asked for to an agent, create a workstream task for it with CreateTask.
+Create one task for each deliverable the human will see, regardless of how the work is delegated.
```

Rejected first: `Create one task for each deliverable the human will see, even when one agent does several.` It steers the orchestrator toward reusing agents, and whether to reuse an agent or start a new one is still open, so the line stays neutral on it.

| Model | Without line 2 | With line 2 |
| --- | --- | --- |
| Opus 5.5 | fail: one task for both deliverables, and E3's work folded into the E1 task | passed trial 1: two tasks, one agent |
| GPT-6.2 Sol | not run | 0/2: the test run got a third task, and once a third agent |
| Auto | not run | 0/2: one task for both deliverables |

Sol's third task is what line 3 fixes.
