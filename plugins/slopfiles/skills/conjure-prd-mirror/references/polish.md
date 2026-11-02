# Polish

Display feedback from reviewers of past PRD sites. The `rpi` show-me reference already covers the basics (visual beside its text, product colors, real labels, Mermaid). This file adds what reviewers still asked for after that.

## The page

- Keep the builder's Factory look: black background, orange accent, Geist. Don't restyle per PRD.
- Leave nothing on the site that only makes sense somewhere else, such as "this viewer doesn't render images". Wrap those notes in `site:hide` markers.
- Give the page a one-line `--intro`. Keep `##` sections few and short so the header nav fits on one row.
- Under each heading, write one sentence that says what the section is about or what makes it hard, then show the image.

## Mock-ups

- **Every product statement gets a picture.** Use the full screen with the relevant area ringed in orange, or a zoomed crop of just the control. When several statements share one surface, use one image with numbered callouts.
- **Callouts must match notes.** Put numbered orange dots in an image only when the numbered list right after it explains each one. Reviewers found unexplained numbers confusing.
- **Copy the real app.** Before you draw a surface, ask for a screenshot of it as it ships today, and build from the repo's design tokens and component names. Reviewers spot invented chrome (wrong tabs, wrong header) at once.
- **Component first, then placement.** Before showing where a control sits on the page, show a small tight image of the control alone, with its states (for a comment thread: many replies, edit and delete controls, a deleted first comment).
- **Use realistic content.** Show a heading, a few bullets and real-looking names, not one placeholder line. Ring the thing under discussion in orange so the eye lands on it.
- **Match details across images.** Avatars the same size and aligned between comments and the reply box. No box around an input unless the app draws one. Small mismatches pull review comments away from the design.
- Build mock-ups as HTML with the product's tokens and render them to PNG at 2x. Name them `prd-<area>-<detail>.png` and link them by bare filename, so the same Markdown works in the shared folder and on the site.

## Diagrams

- Use Mermaid. Inline JSON-render blocks and ASCII art didn't render well on past sites.
- Label edges for work that won't ship "out of scope for now", not "later".

## Option pages

- Show every option as its own image, labeled A, B, C, so the user can decide by looking. State your recommendation under the images.
- Keep option pages after a decision; the PRD links to them from the image of the pick (see "Sub-pages for decisions" in `SKILL.md`).

## Sharing

- Local image paths often don't render in chat. Always give the Conjure URL, with `#section` anchors when pointing at one part.
- Do the prose review from the `rpi` skill before every publish, so the site always carries reviewed text.
- When the Markdown also lives elsewhere (a shared folder), sync it in the same step as the deploy, so the source and the site never drift.
- Prefer Conjure over Notion for mirrors: Notion can't take local images without a public host.
