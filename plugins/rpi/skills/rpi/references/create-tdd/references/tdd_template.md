---
type: design-tdd
repos:
  - identifier: <Repository identifier>
    sha: <Commit SHA>
---

# <Technical Design Title>

<Write each choice in both sections as described in `$SKILLBASE/references/decisions.md`. Number them in one sequence: system design first, then program design.>

## System Design

<Draft first. Explain cross-component behavior and how it changes from today's system. Place diagrams, contracts, message shapes, and schemas beside the explanation.>

### D1. <What the system will do, stated as the result>

<What we'll do and why, with the diagram or contract that makes it clear.>

<details>
<summary>Alternatives and motivation (<N>)</summary>

#### <Alternative>

<The same detail and the same kind of view as D1, and why we chose D1 instead.>

</details>

## Program Design

<Draft after system design approval. Show the in-code shape with call trees, component trees, file-tree changes, dependency-injection maps, signatures, and pseudocode. Keep the views selective.>

### D<N>. <What the code will look like, stated as the result>

<What we'll do and why, with the code view that makes it clear. Show each alternative as its own code block.>

## Patterns to Follow

<Existing patterns with source paths and short examples, including test seams.>

## Scope

<Technical boundaries agreed during the discussion, when useful.>
