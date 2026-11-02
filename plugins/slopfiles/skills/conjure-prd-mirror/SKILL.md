---
name: conjure-prd-mirror
description: Publish a Markdown PRD (with mock-ups, Mermaid diagrams and option pages) as a Conjure site that reviewers can comment on, then apply the comments they paste back. Use when the user wants a PRD shared as a web page, a Conjure mirror of a doc, or asks to read review comments from that page.
---

# conjure-prd-mirror

The Markdown file stays the source of truth. The Conjure site is a read-only mirror that you rebuild after every change. Reviewers comment on the site, copy their comments as XML, and paste the XML into chat.

This skill covers the mirror only. Write the PRD itself with the `rpi` skill (its `prose.md` and `show-me.md` references cover wording and mock-ups).

## Publish

1. Pick a site slug once, for example `prd-<topic>`, and reuse it so the URL never changes.
2. Run:

   ```bash
   scripts/publish.sh <slug> <path/to/prd.md> --label "PRD · <Topic>" [--intro "<one line>"] [--questions <dir>] [--pdf <file>]
   ```

   - `--questions <dir>`: each `*.md` in the folder becomes `<name>.html`. Link to it from the PRD by bare filename, such as `options-foo.html`.
   - `--pdf <file>`: adds a PDF button to the header.
   - `--source <text>`: replaces the footer's "Mirrors <file>" line.
3. Run `scripts/publish.sh` again after every edit to the PRD. Each deploy is a new Conjure version at the same URL.

If `conjure` reports an auth error, ask the user to run `conjure login`.

## What the builder expects from the Markdown

- `# Title` becomes the page title. Each `## Section` becomes a numbered card and a header nav link, so keep `##` headings short.
- An image followed straight away by a numbered list becomes a figure: image left, numbered notes right. Number the callouts in the image to match the list.
- A paragraph that is just a link starting "See the options" right after that list becomes a button under the image.
- `` ```mermaid `` fences render as diagrams.
- A question page that contains `> **Decided: …**` gets a "Decided" label; others get "Open question".
- Relative image and PDF links are copied into the site, so keep images next to the PRD (question pages fall back to the PRD's folder).
- YAML front matter is dropped.

## Sub-pages for decisions

Keep the main doc about the chosen design. When a decision comes up mid-review, put the comparison on its own page instead of in the PRD:

1. Write `<questions>/options-<topic>.md` with a `# Decision: <question>` title, one image per option, and your recommendation.
2. In the PRD, show the image of the current pick, then its numbered notes, then a paragraph that is only a link:

   ```markdown
   ![Reviewer picker](prd-reviewer-picker.png)

   1. Search by name.
   2. Avatars show who is already asked.

   [See the options we compared →](options-reviewer-picker.html)
   ```

   The builder puts that link as a button under the image, so readers can see which picture the decision belongs to.
3. Once the user decides, add `> **Decided: <option>. <one-line reason>.**` near the top of the sub-page, update the PRD's image and notes to match, and redeploy. The page label changes from "Open question" to "Decided".

Make a sub-page even for small calls, such as an icon or a default value. The record of what you compared then stays out of the PRD's prose but is still one click from the image it explains. Reviewers can comment on sub-pages too, and each page copies its own comments.

## Check before you share

The live site usually sits behind SSO, so a headless browser can't load it. Check the built folder instead, which is the exact set of files you deployed (`$TMPDIR/conjure-prd-mirror/<slug>/`, or build to a folder of your own with `node scripts/site.mjs <prd.md> <out>`):

- Every `missing asset:` warning from the build is a broken image on the site. Fix the path or copy the file, then rebuild.
- Open `index.html` with `agent-browser`. Confirm that each `pre.mermaid` has an `svg`, that no `img` has `naturalWidth` 0, and that clicking a block opens the comment box.

Give the user the Conjure URL.

## Read review comments

Reviewers hover a block, click it, and type a comment. Comments stay in their browser's `localStorage` per page, so each page (PRD or question page) is copied separately. "Copy N comments" in the header produces:

```xml
<prd-review page="https://…/index.html" reviewer="Ana" copied="2026-11-02T18:04:00Z">
  <comment section="Solution › Ask people for a review" kind="image" src="prd-review-request.png">
    <target>First 160 characters of the block, or the image alt text</target>
    <body>The reviewer's comment</body>
  </comment>
</prd-review>
```

`kind` is one of `heading`, `paragraph`, `list-item`, `table`, `code`, `diagram`, `quote` or `image`. When the user pastes this:

1. Find each target in the Markdown by `section` plus `target` text. For `kind="image"`, change the mock-up named in `src`, not the prose.
2. Treat each comment as a change request or a question. Change what is clear. Ask about the rest one at a time.
3. Rebuild and redeploy, then list each comment with what you changed or why you didn't.

Reviewers' comments don't clear after you deploy. Tell them to use Clear in the header once their comments are handled.
