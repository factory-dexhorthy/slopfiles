# Iterate a Product Requirements Document

Revise an existing PRD from feedback or resume the user's review, in the main conversation.

Follow these steps in order.

## 1. Read the PRD and Context

Read the selected PRD, related workflow documents, and named sources in full. Read linked mockups when they affect the current decision. Identify the problem, success measure, agreed solution, and parts still unfinished.

## 2. Find Where the Feedback Lands

Use the user's feedback and find the decision it targets. For unfinished work, start at the first decision the user hasn't reviewed. For a complete PRD with no feedback, offer a choice between revising it and exploring further product questions.

Keep the PRD about user experience, functionality, and behavior. Record implementation questions under **Deferred to TDD**.

## 3. Verify the Context Needed for the Decision

Check factual claims against relevant code and docs. Use the research agents when useful and wait for their findings before editing. Add new facts to the research document when present.

## 4. Read the Templates and Visual Guidance

Read `$SKILLBASE/references/iterate-prd/references/prd_template.md`, `$SKILLBASE/references/decisions.md`, and `$SKILLBASE/references/show-me.md`.

## 5. Apply the Feedback and Rework the PRD

Apply the feedback as `decisions.md` describes: change the decision it targets and any later ones that depend on it, and treat earlier ones as approved. When the feedback is unclear, ask one question and wait.

Edit the PRD in place so it describes the current agreed solution. Keep its original path and metadata, updating `repos` as needed. Reflect changes in the problem, success, solution, and scope where relevant.

Use headers that state the main point and keep paragraphs short. For visual decisions, update the focused HTML mockups and their local links beside the explanation.

After applying feedback, name the first decision the user hasn't reviewed and hand control back to the user.

## 6. Review and Hand Off

Offer to open the document for review in VS Code, Cursor, or the user's preferred editor or browser.

When the solution is ready, ask the user to review **Solution Details** as a whole and approve it. After approval, read `$SKILLBASE/references/iterate-prd/references/prd_final_answer_resolved.md` and use it for the handoff to TDD, an outline, or direct implementation.
