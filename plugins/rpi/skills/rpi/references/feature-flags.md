# Feature Flags

When to put a change behind a feature flag, and when to take the flag out. For how the slices are planned, read `slicing.md`; for how they merge, read `shipping.md`.

## Flag Large Changes

Put a large change behind a feature flag, so its slices can merge before it's ready for everyone.

## Gate Logically

Gate the entry point, not every piece behind it. Code that can only be reached through something already gated is gated too, and doesn't need its own flag. For example, UI that only appears through a custom model tool is gated by whether that tool is exposed to the harness. Flag the tool, and let the UI follow.

## Clean Up the Flag

For a big ship, end the slice plan with one more item: once every PR has merged and the flag is on for everyone, remove the flag from the code. Delete the checks and the off path, so the code is simpler.
