# Planning Infrastructure

Where the workflow documents live when several agents or machines work on one task, and how the user reads and comments on them in the browser. For how to talk with the user, follow the Work With the User section in `SKILL.md`.

## Share the Documents

Keep the workflow documents in the shared docs folder so every agent can read them.

- Use numbered documents: request, research questions, research, PRD, TDD, slices, a build document for each big slice, and an implementation log that also holds the standing working rules.
- Give each document one owning agent.
- Edit through the shared-folder tool.
- Replace a whole body only from the version you just read, passing that version as the expected version, so every other agent's change is kept. Prefer small text edits.
- Store images and PDFs as documents in an `images/` subfolder and link them from the documents.
- Record each user decision with its date where it applies.
- Read code from the up-to-date base branch before citing it. A stale checkout leads to wrong claims.

## Publish a Review Site

Publish the PRD, TDD, and slices as one static site, built from the shared documents, so the user can read and comment in the browser.

### Structure the Site

- Give the PRD, TDD, and slices one page each, shown as tabs under a shared header and tab bar. Each page has its own section nav.
- Put per-slice build documents in extra tabs, or in pages linked from the slices tab.
- Include the comment script on every tab.

### Deploy and Check

- One agent owns deploys. It redeploys after the other agents finish their document changes, and batches changes into one deploy.
- After each deploy, check that links resolve to real headings and images load, then report the site version.
- Agents work from the source documents, since the site may sit behind a sign-in meant for people.

### Ask Hard Decisions on Subpages

Make a subpage for a decision that is hard to ask in chat: one with several options, layouts or visuals to compare, or more context than a chat message holds.

- Show the options side by side with pictures, give your recommendation, and state the question in one line.
- Link the subpage from the document section that needs the decision, and give the subpage a back link to that section.
- Ask the user in chat with a link to the subpage.
- Once the user decides, record the decision in the document and keep the subpage as history.

## Build the Comment System

Give the review site a comment layer so the user can comment on any block of any page and hand every comment to the agent in one paste.

### Keep Comments in the Browser

- Ship the layer as one client-only script included on every generated page. It runs entirely in the browser.
- Store comments in `localStorage`, one key per page. Save the reviewer's name once, on their first comment.
- The script works behind a sign-in and keeps every comment on the reviewer's machine. Each reviewer's comments stay in their own browser.

### Comment on Any Block

- Clicking any block opens a small popover: a heading, paragraph, list item, table, code block, diagram, or image.
- The popover shows the block's kind and a short snippet, the existing comments each with a Delete button, and a text box.
- Cmd/Ctrl+Enter saves. Esc closes.
- Hovering outlines the block. Plain links keep navigating as usual.
- A commented block shows a count badge. For diagrams, tables, code, and images, put the badge in a wrapper around the element, so renderers that parse the element's text keep working.
- A header bar shows "Click any block to comment", a "Copy N comments" button, and "Clear".

### Copy Comments as One Block

Copy puts one XML-style block on the clipboard: the page URL, the reviewer, and the copy time, then each comment in page order with its section path (H2 › H3), block kind, image `src` for images, the target snippet, and the body. When the clipboard API is unavailable, fall back to `document.execCommand('copy')`.

```xml
<page-review page="https://review.example.com/prd.html" reviewer="Reviewer A" copied="2026-01-15T10:30:00Z">
  <comment section="Goals › Success measure" kind="paragraph">
    <target>Reviewers finish a pass in under ten minutes…</target>
    <body>Name the baseline we compare against.</body>
  </comment>
  <comment section="Design › Flow" kind="image" src="images/flow.png">
    <target>Flow from draft to publish</target>
    <body>Add the retry path.</body>
  </comment>
</page-review>
```

### Run the Review Loop

1. The user comments, clicks Copy, and pastes the block into the agent chat.
2. The agent works through each comment in the source documents, redeploys, and reports.
3. The user clicks Clear.

- Comments are stored by block position, so copy and send them before the next deploy.
- Match each comment to the document by its section path and snippet, since positions shift when content changes.
- Keep the elements the script attaches to, the header bar container and the content wrapper, in every page template, so comments work on every page and tab.
