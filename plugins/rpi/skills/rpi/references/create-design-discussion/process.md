# Create a Design Discussion

Use the research and the user's request to discuss what should change and how the pieces will fit together. Keep design choices with the user.

Follow these steps in order.

## 1. Read the Context

Read the selected task directory's workflow documents and the user's named files in full in the main conversation. Use the completed research to understand current behavior and the request to understand the desired result. Read supporting mockups and diagrams as needed.

Carry settled choices forward from the user's latest instructions and later design documents. Use live code to verify current behavior. If the desired change is missing, ask what result the user wants before drafting the design.

## 2. Fill Research Gaps

When a choice depends on facts that the research has not established, use `codebase-locator`, `codebase-analyzer`, or `codebase-pattern-finder` to investigate. Use `web-search-researcher` for relevant external sources. Wait for the findings and verify the relevant code before presenting options. Fold new facts into the research document when one exists.

## 3. Read the Templates and Visual Guidance

Read `$SKILLBASE/references/create-design-discussion/references/design_discussion_template.md`, `$SKILLBASE/references/decisions.md`, and `$SKILLBASE/references/show-me.md`.

Use focused before-and-after diagrams, trees, contracts, or pseudocode to explain the current system, the end state, and each decision. Place each view beside the short explanation it supports.

Use `diff` blocks when the main point is what changes. Show the complete target shape when it makes ownership or order clearer.

## 4. Write the Initial Discussion

Write `NN-design-discussion-<description>.md` in the task directory using the next available number. Fill its `repos` entries with the relevant repository identifiers and SHAs, or use `repos: []`.

Describe the current experience, desired result, scope, design, and existing patterns to follow. Include file locations and short examples of those patterns, along with the existing testing approach.

Describe the current and desired experience in terms of what users see and can do. Use the design and patterns sections for code structure, source references, and implementation examples.

Write every design choice under **Design**, following `decisions.md`. Ground each decision and its alternatives in the codebase. Write choices the user already settled the same way.

Use section headers that state the main point so the reader can understand the change by skimming them.

## 5. Revise Until the Document Says What the User Wants

In the main conversation, ask the user to read **Design** from the top and give feedback on any decision. Answer clarifying questions there.

Apply each piece of feedback as `decisions.md` describes: change the decision it targets and any later ones that depend on it, and treat earlier ones as approved. Rework the other sections in place to match. Then name the first decision the user hasn't reviewed.

For visual choices, save a focused HTML mockup or diagram beside the document and provide an ordinary local link. Match the project's visual conventions and use real labels.

## 6. Read the Appropriate Final-Answer Template

Offer to open the document for review in VS Code, Cursor, or the user's preferred editor or browser.

While the user is still reviewing, read `$SKILLBASE/references/create-design-discussion/references/design_discussion_final_answer.md` and fill it with the document path and the first decision the user hasn't reviewed.

When the user approves the whole design, read `$SKILLBASE/references/create-design-discussion/references/design_discussion_final_answer_resolved.md`. Use `$SKILLBASE/references/workflow.md` for the next command. Offer an outline or direct implementation.

For a requested early handoff, save the document, name the decisions the user hasn't reviewed, then follow the requested step.
