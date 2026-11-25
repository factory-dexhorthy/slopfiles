# Automations

Milestones in a task that start an automation, and the automation each one starts. Create each automation once per task with the host's scheduler, named after the task directory so you can find it again. Tell the user when you create or cancel one.

## First PR Opens

Keep at most one PR automation at once. If one already exists, keep it instead of creating another.

When the task's first PR opens, create an automation that pings the orchestrator's session:

- **When:** every 30 minutes, Monday to Friday, 9:00 to 18:00 Pacific. Automations only take UTC, so use `*/30 0-1,16-23 * * 1-6`. It covers that window in both daylight and standard time, and the prompt skips the extra ticks.
- **Prompt:**

```text
If it's outside 9:00 to 18:00 Monday to Friday in America/Los_Angeles, end your turn without saying anything.
Check the open PRs following <rpi-invocation> shipping.md, shepherding-prs.md, and review-comments.md.
If nothing changed since the last check, end your turn without saying anything.
If any PRs are green, resolved, and ready for review, output the Slack block for all of them, as in Ready for Review in shepherding-prs.md.
```

Cancel it when the task's last PR merges or the user stops the task.
