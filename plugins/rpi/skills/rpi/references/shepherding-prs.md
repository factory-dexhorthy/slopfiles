# Shepherding PRs

How to push open PRs to merge without a human. Run this checklist on every tick, for each open PR you own. Most PRs use auto-merge, so a PR that passes this checklist merges on its own once it's approved. Write every reply and message following `prose.md` and `show-me.md`.

## On Each Tick

For each open PR, in order:

1. **Refresh its state.** Read the head SHA, mergeability, approvals, labels, auto-merge, each check's conclusion, and every unresolved thread, noting the ones that are new since the last tick.
2. **Read CI one check at a time.** GitHub's overall status counts a cancelled run as a failure. A run cancelled because a newer run of the same check started isn't a failure; read the newer run. Know which checks are required and which are advisory. Some checks, such as e2e, only run after approval.
3. **Merge the base branch only when needed:** on a conflict, when a required check needs it, or right before merge. Do it at most once per tick. Each merge starts a new review bot round and new CI runs, and it can turn auto-merge off. After the merge, run lint, format, and any generated-file checks (an API spec, for example) locally, because merges often break them.
4. **Fix failing required checks.** Read the failing run's log, fix the cause, and confirm the fix locally.
5. **Fix P0 and P1 review findings.** Check each one first and fix it, following `review-comments.md`.
6. **Reply to P2 findings** with the explanation and fix outline in `review-comments.md`, and leave the thread open for the user. When the user has decided a thread, carry out the decision as in After the User Decides.
7. **Leave threads that ask a specific person for input.** Don't answer for them. List them for the user.
8. **Answer factual questions** from reviewers when the code shows the answer, such as the format of an id. Leave product and scope questions for the user.
9. **Push once per tick.** Batch every fix into one push.
10. **Add `e2e:run` if you pushed after an approval,** so the e2e checks run on the new head. Add it once; don't remove and re-add it.
11. **Keep the PR current.** Make sure the title, ticket link, description, and evidence (screenshots, output) still match the head.
12. **Keep auto-merge on.** If a push turned it off, turn it back on once this tick's checks pass. After review fixes, follow Push Fixes in `review-comments.md` instead.
13. **Look for anything else** that blocks the merge and that you can do alone, and do it.

## Ready for Review

A PR is ready for review when:

- every required check passes,
- every thread you can address has a reply and is resolved, or waits on the user's fix/defer/drop call,
- every non-review thread comment/question has an answer
- it isn't a draft, and
- no automated review is still running.

When a PR is ready but not approved, give the user a Slack message they can paste to request review, in a ```text block, with up to 3 PRs:

```text
- [slice number](link to the review site heading) - short description - (+N / -M) - full PR url
```

Leave out PRs with failing checks, open review findings, or automated review still running.

## Report to the User

After each tick, give one line per PR: what you changed, and what it waits on and from whom. Name the PR as slice (PR), as in `SKILL.md`. Point the user to the PR for P2 replies and for threads that ask a specific person, as in Tell the User in `review-comments.md`. Don't ask about open findings, and don't mention findings that don't have a reply yet.

## Never

- Choose, request, or re-request reviewers. The user picks reviewers.
- Send Slack messages or ping people. Draft the message and give it to the user.
- Force-push or rewrite pushed history.
- Merge sibling PR branches into each other. Merge a parent into its child only after the parent merges.
- Turn auto-merge off, unless the user asks.
