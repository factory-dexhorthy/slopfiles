# Ship in Slices

How to get each slice merged and reviewed. Plan the slices with `slicing.md` first: every slice makes tangible progress, on the fewest lines and PRs to the next thing the user can test or demo. For where the workflow documents live and how the user reviews them, read `planning-infra.md`. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Keep Changes Small

- Within a slice, design each PR so an automated risk reviewer can approve it alone: small, well tested, and away from startup and hot paths.
- When a phase comes out too big, split it into numbered sub-PRs: 4.2.1, 4.2.2.
- aim for <300 lines of production code changed per PR, but this is a loose ceiling. some may be much smaller, and splitting may be so inconvenient as to justify going over.
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
- Once a PR is open, shepherd it to merge with `shepherding-prs.md`: fix CI and P1s, reply to P2s, and draft the Slack review request when it's ready.

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

- If you are an orchestrator over SpawnAgents, use roughly one agent per PR, and ensure it reads all RPI docs before starting work (you should be launching them with instructions akin to ~`/rpi implement-outline` which should steer them to review all RPI docs already).
- It is acceptable to have multiple PRs from a single agent roughly only if an agent makes one PR and then later decides to break that PR up (other such exceptions may arise, use your judgement, but lean mildly toward new agent if unsure)


## Polish Pass

Keep the polish pass out of the implementation prompt. When the owning agent reports that its draft PR is pushed, send it this as a separate message:

```text
Polish the draft before it goes ready:
- Simplify: review your complete body of work and try to simplify it. Remove code that is now dead, simplify code that can now be simpler, reuse code that makes sense to share, and find leftovers from earlier attempts. Never change code that has already merged.
- Make every new or changed comment follow prose.md.
- Read the oxlint rules in a local clone of K-Mistele/anti-slop and apply them to the code you just wrote.
- Check test clarity: no unexplained numbers or strings, helpers take named fields, each test reads top to bottom as "given X, expect Y", and expected values are written out, never computed with the code under test.
Push once, then report back with the new head SHA.
```

Send the simplify step again after each round of review fixes.

After the polish pass, mark the PR ready if a slot is open. Otherwise it waits as a draft, and the risk check below applies.
## Risk check

The local risk check is optional. It only front-runs the repo's risk review for a PR that has to wait.

- **A ready slot is open:** skip the local risk check. Mark the PR ready and let the repo's own risk review and review bot run on it.
- **Every ready slot is taken and the PR waits as a draft in the queue:** run the local risk check while it waits, so it comes out of the queue with the findings already fixed. A clean risk check makes it more likely the PR merges without a human.
- **The repo has no risk review:** skip it.

To run it:

1. The owning agent finishes the polish pass, with the PR still a draft.
2. A fresh, read-only agent runs the risk assessment and code review without posting anything, then reports back.
3. The owning agent fixes P0 and P1 findings. P2 and lower findings, and edge cases, go to the user before any fix, written as in Reply on P2 Threads in `review-comments.md`.

When a slot opens, mark the PR ready whether or not the local risk check has finished.

## Conversing Effectively with the user

When referencing PRs in chat, always use as much context as you have, including review site links, slice numbering, pr number/link, and changed lines:

[slice number](link to prd/tdd review site header) - [#....](github url) (+N / -M)

## Helping the user get PR reviews

Follow Ready for Review in `shepherding-prs.md`.
