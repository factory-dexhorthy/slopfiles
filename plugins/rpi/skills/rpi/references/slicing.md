# Slice the Work

How to divide the work into slices, from an agreed design or straight from a request. The outline holds the slice plan when there is one, and `shipping.md` gets each slice merged:

```text
design    what should change, and why       the request, or PRD / TDD decisions
outline   in what order we make it real     slices, each making tangible progress (this file)
shipping  how each slice gets merged        PR size, stacking, review, tracking (shipping.md)
```

## Every Slice Makes Tangible Progress

When a slice merges, you can run something new and judge it.

Ask of every slice: "After this merges, what can we run that we couldn't before?" If the answer is "nothing yet", the slice is a layer. Fold it into the first slice that uses it.

## Work Backward From Fake Data

Start from the outside: the thing the user will see or judge. Fake whatever sits underneath it, behind a feature flag if needed, so the user can judge that first. Then make the fake parts real, one slice at a time, working inward.

## Start With a Walking Skeleton

Slice 1 is the thinnest change that shows the result end to end, even if it's crude. Use the PRD's success measure when there is one, or what the request asked for when there isn't. Each later slice adds one case or behavior, plus whatever it needs underneath.

Look for the smallest thing the user can ask for and watch happen. It often needs far less than the design implies.

## Optimize for the Shortest Path to a Demo

Plan for the fewest lines of code and the fewest PRs between now and the next thing the user can test or demo. That's the measure for each slice and for the order of slices.

A tangible slice may still ship as several PRs (`shipping.md`) when that makes review easier. Those PRs don't each need to be tangible, but together they land the slice, and nothing outside it rides along. Prefer a thinner slice over more PRs.

Keep a code-owned change inside its slice, as its own commit, so the owner reviews only that commit. Give it its own PR only when the owner asks or the slice can't merge otherwise.

## Call Out Plans That Delay the Result

A design decision or slice order that holds the user-visible or measured result until the last slice changes how the work ships. Say so plainly, show the slice order it produces, and get the user's explicit OK.

## Recheck While Shipping

After each merge, check that it made tangible progress. If two merges in a row haven't, stop and show the user the remaining order before continuing.
