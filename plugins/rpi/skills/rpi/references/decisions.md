# Decisions

How to write the decisions in a design discussion, PRD, or TDD, and how to update them from feedback.

## Order Decisions by What They Depend On

List decisions from the most fundamental to the least. Each one may depend only on decisions above it: D2 can build on D1, never on D3. Number them D1, D2, D3 so the user can point at one.

## Say What We'll Do

Write each decision as what we'll do, in plain prose, following `prose.md` and `show-me.md`. Don't frame it as a question. Don't call it a proposal, option, recommendation, or decision. Use a header that states the result, such as "D2. Comments stay in the browser, one set per page."

Put the alternatives in a `<details>` block right after the decision. Give each alternative the same detail and the same kind of view as the chosen approach, then say why we chose the approach above instead. Leave a blank line after `</summary>` so the Markdown inside renders. Leave the block out when there is no real alternative.

````markdown
### D2. Comments stay in the browser, one set per page

Each page saves its comments in `localStorage` under its path. Nothing leaves the reader's machine until they copy the comments into the chat.

```text
on(save comment)
  comments[location.pathname].push(comment)
  mark the block
```

<details>
<summary>Alternatives and motivation (1)</summary>

#### Comments go to a small server

```text
on(save comment)
  POST /comments { page, block, body }
  mark the block
```

This lets several reviewers see each other's comments, but every published page would need a server and sign-in. One reviewer pasting into the chat doesn't need either.

</details>
````

## Update From Feedback

Keep one document that always says what we'll do. Don't split it into open and settled sections. Update it in place until it says what the user wants.

- Feedback on D3 changes D3 and any later decision that depends on it. Leave D1 and D2 alone.
- Feedback on D3 approves D1 and D2, unless the user later comments on them.
- When the user picks an alternative, swap it in: it becomes the body, and the old approach moves into the `<details>` block with the reason the user gave.
- When a change makes a decision depend on a later one, reorder and renumber.
- Keep the other sections, diagrams, and mockups in step with the decisions.
