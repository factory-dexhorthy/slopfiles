# Review Comments

How to handle review comments on a PR. The agent that owns the PR fixes P0 and P1 findings and replies on each P2 thread. You send it that work, then point the user at the replies. Write every reply and message following `prose.md` and `show-me.md`. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Send the Owning Agent

When a PR has open review comments, tell the agent that owns the PR to:

- Check each comment first (below).
- Fix every P0 and P1 finding, following Push Fixes.
- Reply on each P2 or lower thread with the explanation and fix outline below. Don't fix it yet, and leave the thread open.
- Report back with the fixed threads, the new head SHA, and how many P2 threads got a reply.

## Check Each Comment First

Before replying or fixing, for each comment:

- Read the comment and the code it points at on the PR's current head.
- Check whether this PR caused it or it already happens on the base branch. Check it yourself; don't just repeat what the review bot says. If you can't tell, say "unverified".
- Work out the smallest fix and roughly how many lines it is.
- Be skeptical of "function has no production caller" findings. Work is split over many small PRs, so the caller often lands in a later slice.

## Reply on P2 Threads

Each reply, briefly, in this order:

1. What goes wrong, in plain words: the steps that trigger it, as a short numbered list, or as a small sequence diagram if timing or order matters.
2. Today's code: a few lines of pseudocode with an arrow at the bad line. Name the file and line.
3. The fix as a diff of that same pseudocode, plus its size, such as "about 5 lines plus a test".
4. Whether this PR caused it (verified or unverified), and how likely it is to happen.
5. A recommendation: fix it in this PR, defer it to a later cleanup slice, or drop it.

No preamble and no extra options.

## Tell the User

Write the PR as in `SKILL.md`: slice (PR).

- If the PR has review comments with no fix or reply yet, say so and offer to send the owning agent: "[5.5](...) ([#1234](...)) has 4 unanswered review comments. Want me to have the agent fix the P1s and reply to the P2s?"
- Once the agent reports back, say what it fixed and send the user to the PR to read the replies: "[5.5](...) ([#1234](...)): fixed 1 P1 in `abc1234`. 3 comments have replies that need your review." Link to the PR's conversation tab.

Don't walk through the comments in chat unless the user asks. If they do, show one reply at a time and ask one question: fix, defer, or drop?

## After the User Decides

For each P2 the user decides on, on the PR or in chat, pass the decision to the owning agent:

- Fix: make the fix, following Push Fixes, then reply with the commit and resolve.
- Defer: file a follow-up for a later cleanup slice in the TDD and the team's tracker, reply with the issue link or number, and resolve.
- Drop: reply with why, and resolve with no fix and no follow-up.

## Push Fixes

Tell the owning agent to:

- Make each fix as a new commit. Never rebase, force-push, or rewrite someone else's commits.
- Add a test for each bug fix, and confirm it fails before the fix and passes after.
- Run lint, typecheck, unit tests, and the e2e spec locally, then push in one batch.
- Reply on each fixed thread with the commit that fixes it, and resolve it.
- Update the PR description and screenshots if anything visible changed.
- Leave auto-merge off and report back with the new head SHA and the check results. Run a risk check on just the new changes before auto-merge goes back on.
