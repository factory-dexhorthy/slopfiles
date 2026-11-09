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
