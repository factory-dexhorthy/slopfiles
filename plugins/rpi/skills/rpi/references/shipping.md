# Ship in Slices

How to turn an agreed design into small PRs and get them reviewed. A slice is one PR-sized piece of the change that works end to end. For where the workflow documents live and how the user reviews them, read `planning-infra.md`.

## Working Style

- Ask the user one question at a time, each with your recommendation.
- Show options as pictures or as a diff of the plan.
- Keep messages short and plain.

## Keep Changes Small

- Aim for about 400 changed lines or fewer per PR, tests included.
- When a phase comes out too big, split it into numbered sub-PRs: 4.2.1, 4.2.2.
- Each PR merges on its own and carries its own unit tests, stories, and end-to-end tests for the UI it adds.
- Give every new export a real caller in the same PR.
- Ship dark behind a feature flag until the whole feature is ready.
- Design each PR so an automated risk reviewer can approve it: small, well tested, and away from startup and hot paths.

## Navigate Code Owners

- Before opening each PR, check its files against `CODEOWNERS` on the base branch.
- Put any code-owned change in its own smallest PR, before or after the main change, so the owner reviews only that piece.
- Prefer composing inside your own area over changing a shared library someone else owns.
- Choose human reviewers with the user: someone who knows the area.

## Keep Two Live PRs

- Have at most two PRs ready for review at once across all agents on the task.
- A PR that depends on another stays a draft until its parent merges.
- Merge the base branch into a PR branch only when the parent merged, when there is a conflict, or right before merging. Batch pushes.
- Update shared branches with `git merge --no-ff`, keeping their pushed history.
- Prefer a few independent PRs over a long stack, and mark what each PR truly depends on.
- Before asking anyone for review, get the PR as green as it can be: every pre-approval check passing, automated review findings resolved, and PR description checks passing.
- Some CI gates run only after approval. Confirm they ran, and re-run the right workflow run if they didn't.

## Name and Track Slices

- Name each slice by what it does.
- Keep one slice list as the single source of truth: number, name, PR links, and merged state.
- Show the plan as a table:

| # | Slice | Who can see it | Needs |
| --- | --- | --- | --- |
| 5.5 | Save drafts on the server | Flag on, staff only | 5.4 |
| 5.6 | Show draft status in the list | Flag on, staff only | 5.5 |

- Decisions live in the TDD. Slices link to them.

## Refer to PRs as Slice (PR)

Every message to the user that mentions a PR writes it as the slice number followed by the PR number in parentheses. Link the slice number to its heading on the review site and the PR number to the PR:

```markdown
[5.5](https://review.example.com/slices.html#slice-5-5) ([#1234](https://git.example.com/org/repo/pull/1234))
```

When the PR is still unopened, write "(no PR)" and link the slice number alone:

```markdown
[5.6](https://review.example.com/slices.html#slice-5-6) (no PR)
```
