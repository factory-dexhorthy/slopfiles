# Create a Technical Design Document

Turn the available product context into a technical design. Discuss **System Design** first, then **Program Design**, with a separate user approval for each.

Follow these steps in order, working with the user in the main conversation.

## 1. Read the Available Context

Read the selected workflow documents and named sources in full. A PRD is useful when present; a request plus research is enough to start. Reference the inputs rather than repeating them and ask about missing behavior when needed.

Use the research agents to establish facts or find code patterns that affect a decision. Wait for the findings and update the research document when present.

## 2. Read the Templates and Write a Small Starting Document

Read `$SKILLBASE/references/create-tdd/references/tdd_template.md`, `$SKILLBASE/references/decisions.md`, and `$SKILLBASE/references/show-me.md`.

Write `NN-tdd-<description>.md` using the next available number. Start with frontmatter, title, empty **System Design** and **Program Design** sections, and **Patterns to Follow**. Fill `repos` with relevant identifiers and SHAs, or use `repos: []`.

## 3. Discuss System Design

Describe how components interact: services, endpoints, schemas, queues, stores, and external systems. Show current behavior and the change within this section.

Use Mermaid for data flow, control flow, and sequences. Show the contracts that matter: endpoint or message shapes, high-level signatures, and schemas in the project's language or ORM.

Write every system-design decision following `decisions.md`, starting at D1. Ask the user to read **System Design** from the top and give feedback on any decision. Apply feedback as `decisions.md` describes, keeping the prose and diagrams a coherent description of the architecture.

When a diagram needs more room, save a focused `diagram-<description>.html` file in the task directory and link it beside its explanation. Use the project's visual conventions and real labels.

## 4. Get System Design Approval

Ask the user to review **System Design** from start to finish. Incorporate feedback and get their approval before moving to program design.

At each section review, offer to open the document in VS Code, Cursor, or the user's preferred editor or browser.

## 5. Discuss Program Design

Show the code shape that implements the system. Include concrete code views in the discussion: call trees, component trees with state and package boundaries, file-tree changes, dependency-injection maps, method signatures, or pseudocode.

Show each alternative as its own code block, like the chosen shape. Use focused diffs for changes to existing shapes and complete target shapes for new code. Choose the views that expose the decision; the outline will carry the detailed file list.

Write every program-design decision following `decisions.md`, continuing the numbers after system design. Take feedback the same way and rework **Program Design** in place. Use headers that state the main point, such as "D5. The worker receives a clock so retry timing is testable." Place each view beside its explanation.

Document patterns to follow with source paths and short examples. If a technical choice changes product scope or user experience, discuss it with the user and update the PRD and mockups when present.

## 6. Get Program Design Approval

Ask the user to review **Program Design** and approve the code shape. Incorporate their fixes.

## 7. Read the Final-Answer Template and Respond

After both sections are approved, read `$SKILLBASE/references/create-tdd/references/tdd_final_answer_resolved.md`. Offer an outline or direct implementation.
