# Planning Infrastructure

Where the workflow documents live when several agents or machines work on one task, and how the user reads and comments on them in the browser. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Share the Documents

When several agents or machines work on one task, keep the workflow documents in the shared docs folder.

## Publish a Review Site

Publish the PRD, TDD, and slices as one static site, built from the shared documents, with a tab for each.

### Ask Hard Decisions on Subpages

Make a subpage for a decision that is awkward to ask in chat. Show the options side by side with pictures and your recommendation, then ask the user in chat with a link to the subpage.

## Build the Comment System

Give the review site a client-only comment layer.

- Store comments in `localStorage`, one key per page.
- Clicking any block opens a box to comment on it.
- "Copy N comments" puts every comment on the clipboard as one block for the user to paste into the agent chat.
- The agent addresses each comment, then the user clicks Clear.

```xml
<page-review page="https://review.example.com/prd.html">
  <comment section="Goals › Success measure" kind="paragraph">
    <target>Reviewers finish a pass in under ten minutes…</target>
    <body>Name the baseline we compare against.</body>
  </comment>
</page-review>
```
