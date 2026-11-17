# Ship in Slices

How to turn an agreed design into small PRs and get them reviewed. A slice is one PR-sized piece of the change that works end to end. For where the workflow documents live and how the user reviews them, read `planning-infra.md`. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Keep Changes Small

- Design each PR so an automated risk reviewer can approve it alone: small, well tested, and away from startup and hot paths.
- When a phase comes out too big, split it into numbered sub-PRs: 4.2.1, 4.2.2.
- Each PR carries its own tests for what it adds, so tests land with their code.

## Navigate Code Owners

- Before opening each PR, check its files against `CODEOWNERS` on the base branch.
- Put any code-owned change in its own smallest PR, before or after the main change, so the owner reviews only that piece.

## Keep Two Live PRs

- Have at most two PRs ready for review at once across all agents on the task.
- A PR that depends on another stays a draft until its parent merges.
- Merge the base branch into a PR branch only when the parent merged, when there is a conflict, or right before merging. Batch pushes.
- Update shared branches with `git merge --no-ff`, keeping their pushed history.
- Prefer a few independent PRs over a long stack, and mark what each PR truly depends on.
- Before asking anyone for review, get the PR as green as it can be: every pre-approval check passing, automated review findings resolved, and PR description checks passing.

## Name Slices

- Name each slice by what it does.

## Track Slices in the Issue Tracker

- Track the slice plan as an issue tree in the team's tracker, such as Linear.
- Put everything under one parent issue for the slice plan. Before shipping starts, ask the user for that issue's number, or offer to create one: propose a title and the project (and parent epic, if any) to file it in, and wait for their answer.
- Follow the slice numbering level by level, titling each issue with its number and name: one issue per phase under the parent ("Slice 1", "Slice 2"), one child per slice under its phase (1.1, 1.2), and one child per PR under a slice that ships as several PRs (1.3.1, 1.3.2).

  ```text
  Slice plan
  ├── Slice 1
  │   ├── 1.1
  │   ├── 1.2
  │   └── 1.3
  │       ├── 1.3.1
  │       └── 1.3.2
  └── Slice 2
  ```

- Mirror the plan's dependencies as "blocked by" relations.
- Each PR names the issue it closes (for example "Closes ABC-123"), so merging closes it.
- Keep each issue's state in step with its PR: no PR, draft, in review, merged.
- Update the tree when a slice is split, merged, or dropped.
