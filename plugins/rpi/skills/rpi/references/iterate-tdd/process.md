# Iterate a Technical Design Document

Revise an existing TDD from feedback or resume the user's review of its system and program design. Keep the two concerns distinct and apply feedback in the main conversation.

Follow these steps in order.

## 1. Read the TDD and Context

Read the selected TDD, relevant workflow documents, and named sources in full. Read supporting resources as needed. Identify the settled system and program choices and any recorded approvals.

## 2. Establish the Next Technical Decision

Use the user's feedback and find the decision it targets, or resume at the first decision the user hasn't reviewed. For a finished TDD with no feedback, offer a choice between revising it and exploring further technical questions.

For a resumed review, get approval of system design before opening program design. Existing feedback can revise either section; changes to the architecture may also require the code shape to change.

## 3. Verify Current Behavior and Patterns

Read relevant code and use `codebase-locator`, `codebase-analyzer`, and `codebase-pattern-finder` where useful. Use external research when relevant. Wait for findings and add new facts to the research document when present.

## 4. Read the Templates and Visual Guidance

Read `$SKILLBASE/references/iterate-tdd/references/tdd_template.md`, `$SKILLBASE/references/decisions.md`, and `$SKILLBASE/references/show-me.md`.

## 5. Apply the Feedback and Update the TDD

Apply the feedback as `decisions.md` describes: change the decision it targets and any later ones that depend on it, and treat earlier ones as approved. Program-design decisions come after system design, so a system change can change them too. For system decisions, show diagrams or contracts across components. For program decisions, show code shapes, and each alternative, in separate code blocks. When the feedback is unclear, ask before editing.

Rework the affected sections in place, expressing current behavior and the change within **System Design** and the in-code structure within **Program Design**. Preserve the path and metadata, updating `repos` as needed.

Use headers that state the finding or agreed behavior, short paragraphs, and visuals beside their explanations. Keep linked HTML diagrams and patterns current. With the user's agreement, update the PRD and mockups when technical choices change product behavior.

## 6. Continue or Review the Design

At each section review, offer to open the document in VS Code, Cursor, or the user's preferred editor or browser.

For a continuing review, name the first decision the user hasn't reviewed. After a specific feedback change, hand control back to the user. Get approval for system design and then program design when finishing or revising those designs.

## 7. Read the Final-Answer Template and Respond

After the design is approved, read `$SKILLBASE/references/iterate-tdd/references/tdd_final_answer_resolved.md` and offer an outline or direct implementation.
