# Automations

Milestones in a task that start an automation, and the automation each one starts. Create each automation once per task with the host's scheduler, named after the task directory so you can find it again. Tell the user when you create or cancel one.

## First PR Opens

Keep at most one set of PR automations at once. If they already exist, keep them instead of creating more.

When the task's first PR opens, create three automations that ping the orchestrator's session, all with the prompt below. Automations only take UTC, and Pacific evenings fall on the next day in UTC:

- **Work hours, 9:00 to 18:00 Pacific, Monday to Friday, every 30 minutes:**
  - `*/30 16-23 * * 1-5` for mornings and afternoons.
  - `*/30 0-1 * * 2-6` for evenings.
- **Weekday off hours, every 3 hours:** `0 3-15/3 * * 1-5`.
- **Prompt:**

```text
Check the open PRs following <rpi-invocation> shipping.md, shepherding-prs.md, and review-comments.md.
If nothing changed since the last check, end your turn without saying anything.
If any PRs are green, resolved, and ready for review, output the Slack block for all of them, as in Ready for Review in shepherding-prs.md.
```

Cancel all three when the task's last PR merges or the user stops the task.
