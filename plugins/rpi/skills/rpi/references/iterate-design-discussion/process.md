# Iterate a Design Discussion

Apply feedback to an existing design discussion or resume the user's review. Keep the document a coherent description of the agreed design.

Follow these steps in order.

## 1. Read the Discussion and Context

Read the selected discussion, relevant workflow documents, and named files in full in the main conversation. Read supporting resources as needed. Identify the decisions the user has reviewed, directly or by giving feedback on a later one.

## 2. Find Where the Feedback Lands

Use the user's feedback as the starting point and find the decision it targets. When resuming unfinished work, start at the first decision the user hasn't reviewed. For a finished discussion with no feedback, ask whether the user wants to change a choice or explore the design further.

## 3. Verify Facts That Affect the Choice

Read the relevant source and use the research agents when useful to check current behavior and existing patterns. Wait for their findings. Record new facts in the research document when present.

## 4. Read the Document Template and Visual Guidance

Read `$SKILLBASE/references/iterate-design-discussion/references/design_discussion_template.md`, `$SKILLBASE/references/decisions.md`, and `$SKILLBASE/references/show-me.md` before revising the discussion.

## 5. Apply the Feedback and Update the Document

Apply the feedback as `decisions.md` describes: change the decision it targets and any later ones that depend on it, and treat earlier ones as approved. When the feedback is unclear, ask before editing and keep the exchange in the conversation.

Update the existing file in place. Rework the current state, desired state, architecture, patterns, and scope as the decisions require, until the document says what the user wants.

Use headers that state the section's main point. Update diagrams and any linked HTML mockups beside the prose they support. Preserve document metadata and update the `repos` list when the researched repositories change.

## 6. Continue the Review or Hand Off

Offer to open the document for review in VS Code, Cursor, or the user's preferred editor or browser.

While the user is still reviewing, read `$SKILLBASE/references/iterate-design-discussion/references/design_discussion_final_answer.md` and name the first decision the user hasn't reviewed.

When the user approves the whole design, read `$SKILLBASE/references/iterate-design-discussion/references/design_discussion_final_answer_resolved.md` and suggest an outline or direct implementation.

For a requested early handoff, save the document, name the decisions the user hasn't reviewed, then follow the requested step.
