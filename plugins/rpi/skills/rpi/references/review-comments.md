# Review Comments

How to walk the user through the open review comments on a PR, one at a time, when they ask for help digesting or understanding them. Write every message following `prose.md` and `show-me.md`. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Check Each Comment First

Before you show the user anything, do this for each comment:

- Read the comment and the code it points at on the PR's current head.
- Check whether this PR caused it or it already happens on the base branch. Check it yourself; don't just repeat what the PR's agent says. If you can't tell, say "unverified".
- Work out the smallest fix and roughly how many lines it is.

## Show One Comment at a Time

Show each comment in this order, briefly:

1. A title: "Issue <k> of <total>: <what goes wrong, in plain words>".
2. What the user would see: the steps that trigger it, as a short numbered list, or as a small sequence diagram if timing or order matters.
3. Today's code: a few lines of pseudocode with an arrow at the bad line. Name the file and line.
4. The fix as a diff of that same pseudocode, plus its size, such as "about 5 lines plus a test".
5. Whether this PR caused it (verified or unverified), and how likely it is to happen.
6. Your recommendation: fix it in this PR, defer it (reply, file a follow-up in the team's tracker, and resolve), or drop it (resolve with no fix and no follow-up). Then ask one question: fix, defer, or drop?

Keep it short. No preamble, no recap of earlier issues, no extra options.

## After Each Answer

- Pass the decision to the agent that owns the PR right away, and tell it start working but to hold all pushes until every comment is decided.
- Then show the next issue.

## When Every Comment Is Decided

Tell the owning agent to:

- Make each fix as a new commit. Never rebase, force-push, or rewrite someone else's commits.
- Add a test for each bug fix, and confirm it fails before the fix and passes after.
- Run lint, typecheck, unit tests, and the e2e spec locally, then push everything in one push.
- Reply on each fixed thread with the commit that fixes it, and on each deferred thread with why it's deferred and the follow-up issue link. Resolve every thread, including dropped ones, which get no fix and no follow-up.
- Update the PR description and screenshots if anything visible changed.
- Leave auto-merge off and report back with the new head SHA and the check results. Run a risk check on just the new changes before auto-merge goes back on.
