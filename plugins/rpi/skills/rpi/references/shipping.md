# Ship in Slices

How to get each slice merged and reviewed. Plan the slices with `slicing.md` first: every slice makes tangible progress, on the fewest lines and PRs to the next thing the user can test or demo. For where the workflow documents live and how the user reviews them, read `planning-infra.md`. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Keep Changes Small

- Within a slice, design each PR so an automated risk reviewer can approve it alone: small, well tested, and away from startup and hot paths.
- When a phase comes out too big, split it into numbered sub-PRs: 4.2.1, 4.2.2.
- Each PR carries its own tests for what it adds, so tests land with their code.
- PR titles should include the slice number, if applicable, e.g. feat(cli): 4.2.1: ...

## Navigate Code Owners

- Before opening each PR, check its files against `CODEOWNERS` on the base branch.
- Put any code-owned change in its own smallest PR, before or after the main change, so the owner reviews only that piece.

## Keep N Live PRs

The user will tell you how many ready slots to keep. Default to 2.

- Have at most N PRs ready for review at once across all agents on the task.
- A PR that depends on another stays a draft until its parent merges.
- Merge the base branch into a PR branch only when the parent merged, when there is a conflict, or right before merging. Batch pushes.
- Update shared branches with `git merge --no-ff`, keeping their pushed history.
- Prefer a few independent PRs over a long stack, and mark what each PR truly depends on.
- Before asking anyone for review, get the PR as green as it can be: every pre-approval check passing, automated review findings resolved, and PR description checks passing.
- if a review bot finds a p0 or p1 finding, fix it. for p2 findings, the agent watching the PR first replies on each thread with a `show-me.md` outline of what the fix would look like, then hands it to the user to choose: address+resolve, defer to a later cleanup slice in tdd+tracker (comment w/ link or number + resolve), or comment+drop+resolve
- When the user asks which prs need review, format as a short markdown-compatible list in a ```text block:

```text
- [slice number] SHORT_DESCRIPTION - +N / -M - [#....](...link...)
- ...
```

## PR Format

- PRs should follow references/prose.md and references/show-me.md closely - tight and concise, while following repo conventions for PR format
- Include links on the first line `[TICKETID](link to ticket) | [PRD](...) | ...so on for tdd, slices, etc if linkable`
- For PRs that are part of a large slice plan, include the slices outline near the top, with this slice in bold.
- Unfurl this slice's siblings, root parent and all the root parent's children - do not unfurl every grandchild of the slice

```
* Slice 1: ...description, merged or open PRs...
* Slice 2: ...
* Slice 3: ...
    * 3.1: ...
        * 3.1.1: ...
        * **3.1.2: this pr, ...other description**
        * 3.1.3: ...
    * 3.2: ...
    * 3.3: ...
* Slice 4: ...
* Slice 5: ...
```

## Name Slices

- Name each slice by what it does.

## Track Slices in the Issue Tracker

- Track the slice plan as an issue tree in the team's tracker, such as Linear.
- Put everything under one parent issue for the slice plan. Before shipping starts, ask the user for that issue's number, or offer to create one: propose a title and the project (and parent epic, if any) to file it in, and wait for their answer.
- Follow the slice numbering level by level, titling each issue with its number and name: one issue per phase under the parent ("Slice 1", "Slice 2"), one child per slice under its phase (1.1, 1.2), and one child per PR under a slice that ships as several PRs (1.3.1, 1.3.2), with short few-word title

  ```text
  Feature
  ├── Slice 1: ...
  │   ├── 1.1: ...
  │   ├── 1.2: ...
  │   └── 1.3: ...
  │       ├── 1.3.1: ...
  │       └── 1.3.2: ...
  └── Slice 2: ...
  ```

- Mirror the plan's dependencies as "blocked by" relations.
- Each PR names the issue it closes (for example "Closes ABC-123"), so merging closes it.
- Keep each issue's state in step with its PR: no PR, draft, in review, merged.
- Update the tree when a slice is split, merged, or dropped.

## Shipping with agents 

- If you are an orchestrator over SpawnAgents, use roughly one agent per PR, and ensure it reads all RPI docs before starting work (`/rpi implement-outline` should do this already).
- It is acceptable to have multiple PRs from a single agent roughly only if an agent makes one PR and then later decides to break that PR up (other such exceptions may arise, use your judgement, but lean mildly toward new agent if unsure)


## Autonomous first-pass polish

When an agent reports finished work or. a draft PR is ready: ensure it has done the following

- simplify:
    - "Review your complete body of work, and try to simplify it. Remove code that is now dead. Simplify code that can now be simpler. Reuse code that makes sense to be shared. Find leftovers from previous attempts." Do it again after each round of review fixes. Never change code that has already merged.
- review any new or changed comments follow prose.md
- use a local clone of K-Mistele/anti-slop - read the oxlint rules and apply them to the code that was just written
- check for test clarity: No unexplained numbers or strings, helpers take named fields, test read top to bottom as "given X, expect Y", and expected values are written out, never computed with the code under test.

## Risk check

If your PR process includes a risk review, AND all human-review slots are taken, then follow the risk check procedure to front-run any risk-check findings.

A clean risk check increases the chance that a PR can be merged without a human.

<risk-check-procedue>
When the work is done, agents should: 

Open as a draft right away and report "draft ready for risk check".

After the agent reports its done:

Create A fresh, read-only agent runs the risk assessment and code review without posting anything, then reports back.
Findings. P0 and P1 get fixed. P2 or lower, and edge cases, go to you before any fix.
</risk-check-procedure>

## Comment review 

If a PR ends with comments / feedback from a review bot, follow review-comments.md to work through them with the user.

Do not blindly accept p2 findings, and since we split work over many small PRs, be ESPECIALLY skeptical of "function has no production caller" findings.

