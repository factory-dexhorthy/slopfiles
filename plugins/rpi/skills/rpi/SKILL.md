---
name: rpi
description: Only use when the user explicitly invokes this skill by name.
---

# Research, Design, and Implement

Help the user research a change, work through its design, and implement it. Follow their requested step, using the phase instructions below.

`$SKILLBASE` means the directory containing this `SKILL.md`.

`<rpi-invocation>` in templates means the host's skill command: `$rpi` in Codex, `/rpi` in Claude Code, or its plugin-qualified name when the host exposes one. Render next commands with that native invocation.

## Choose the Step

Follow the user's requested step. Read `$SKILLBASE/references/workflow.md` when choosing or explaining a flow or what comes next.

For a task description with no requested step, start with research questions. Ask which flow the user wants: research followed by design discussion, PRD, or TDD, or research only. Wait for their choice before starting the phase, then carry it into suggested next commands.

When asking the user to choose a flow, read `$SKILLBASE/references/workflow-choice.md` and show its box-and-line chart with the question.

Create writes a new document; iterate updates an existing document in place using the user's feedback or resumes the workflow for a partially finished document.

Load the matching process from `$SKILLBASE/references/<step>/process.md`:

| Request | Step |
| --- | --- |
| Research questions | `create-research-questions` or `iterate-research-questions` |
| Research | `create-research` or `iterate-research` |
| Design discussion | `create-design-discussion` or `iterate-design-discussion` |
| Product requirements / PRD | `create-prd` or `iterate-prd` |
| Technical design / TDD | `create-tdd` or `iterate-tdd` |
| Implementation outline | `create-structure-outline` or `iterate-structure-outline` |
| Implement | `implement-outline` |
| Implementation feedback or fixes | `iterate-implementation` |

Update an existing document by default; create one when needed or requested. When several match, use the newest and name the chosen file.

## Work With the User

- Ask the user one question at a time, each with your recommendation.
- Never use the AskUserQuestion tool (or any similar multiple-choice question tool) unless the user requests it. Ask in plain text instead.
- Show options as pictures or as a diff of the plan.
- Keep messages short and plain.
- Write every PR as slice (PR), linking the slice number to its heading on the review site and the PR number to the PR: `[5.5](https://review.example.com/slices.html#slice-5-5) ([#1234](https://git.example.com/org/repo/pull/1234))`, or `[5.6](https://review.example.com/slices.html#slice-5-6) (no PR)` before it opens.
- Link straight to the slice or decision heading you mean.
- The user chooses human reviewers. Never request or re-request reviewers yourself.
- For a tool that needs a CLI login, run it in a tmux session and share the login URL before you ask the user to approve.
- Bring the user a review request only once the PR is ready, as in Ready for Review in `$SKILLBASE/references/shepherding-prs.md`, and show any message to another person before it's sent.

## Use the Task Directory

Use the directory supplied by the user.

Otherwise, look for existing task directories in `.agents/artifacts/` whose names and workflow filenames match the request or current task branch. Reuse an obvious match without asking. If a directory looks close but could belong to a different task, or several directories look plausible, ask the user which to use before writing. Read only documents allowed by the selected phase when checking a match.

When no existing directory fits, use `.agents/artifacts/<branch-name>` with `/` replaced by `-` if the branch identifies the task. On `main`, or when no branch identifies the task, choose a short kebab-case slug from the request and use `.agents/artifacts/<task-slug>` without asking for approval. State the selected path and reuse or create the directory as needed.

Save at the selected path. If the sandbox blocks writes there, ask for scoped write access or a writable task directory and wait for the user's choice.

The RPI framework authors recommend not committing the artifacts.

Number new workflow documents using the next available `NN-` prefix in the task directory. Keep the existing path when updating a document. Save supporting mockups and diagrams beside the documents and link them as ordinary local files.

Workflow document frontmatter includes `repos`, a list of zero or more repositories with `identifier` and `sha` for each entry. Use `repos: []` when none apply. Quote string values as needed for valid YAML.

## Review the Document

After writing or updating a workflow document, read `$SKILLBASE/references/prose.md` and `$SKILLBASE/references/show-me.md`, then review the document against both. For a design discussion, PRD, or TDD, also check its decisions against `$SKILLBASE/references/decisions.md`. Make it shorter, more visual, and easier for a person to digest: cut words and sections that do not earn their place, replace dense prose with the smallest view that makes the point, and keep each visual beside the short text it supports.

## Suggest the Next Step

Use the phase's handoff instructions and `$SKILLBASE/references/workflow.md` to choose what comes next. Users run each phase in a separate context window by default. When suggesting a next command, include the task directory and chosen flow. Say they can run it here, after compaction, or in a new session.

Use artifact filenames to locate the current phase when asked what's next, then read its document for unfinished work and settled choices. Recognize `prd` or `product-requirements`, `tdd` or `tech-design`, and `structure-outline` or `outline`.

## Ship in Slices

Read `$SKILLBASE/references/slicing.md` when planning or reordering slices, in an outline or anywhere else.

Read `$SKILLBASE/references/shipping.md` when opening or stacking PRs or handling review findings.

To push open PRs toward merge on each tick, read `$SKILLBASE/references/shepherding-prs.md`.

When a PR has review comments, read `$SKILLBASE/references/review-comments.md`: have the owning agent fix P0 and P1 findings and reply on P2 threads, then tell the user how many replies need their review.

## Share and Review Documents

Read `$SKILLBASE/references/planning-infra.md` when several agents share the workflow documents.

Before you publish any workflow document as a web page (a static site, a hosted page, or an HTML export), read `$SKILLBASE/references/planning-infra.md`. Build it on the org's design system from the start. Every published page includes `$SKILLBASE/assets/review-comments.js`.

A published page isn't done until clicking a block opens a comment box and Copy produces a `<page-review>` block.

## Use Subagents

Use the bundled agent instructions for `codebase-locator`, `codebase-analyzer`, `codebase-pattern-finder`, `web-search-researcher`, and `outline-implementer-agent` as directed by each phase.

<important if="you do not have an Agent() or Task() or other tool for running subagents">
  read the subagent instructions from $SKILLBASE/references/subagents/SUBAGENT_NAME.md
</important>

<important if="you have a tool for running subagents or delegated sessions, but the named subagents are not available">
  read the subagent instructions from $SKILLBASE/references/subagents/SUBAGENT_NAME.md and pass them into the subagent with your main prompt, with
<instructions>
REFERENCE_CONTENTS
</instructions>
<message>
YOUR_MESSAGE ON WHAT TO LOOK FOR OR BUILD
</message>
</important>

## Delegate Phases

When handing a phase to another agent or session:
- Give each phase its own fresh agent. Never let the agent that wrote the request or questions also run research.
- Pass only the documents that phase may read (see the table below), plus the task directory and the phase name. Don't summarize the task, the user's goal, or what the user has or hasn't said.
- Don't mention the request document, or that a desired change exists, to a research agent.

| Phase | May read |
| --- | --- |
| Research questions | the user's message and named sources |
| Research | the research-questions document and the sources it points to |
| Design / PRD / TDD | request, research, earlier design documents |
| Outline / Implement | everything |

## Docs and Comments

Many RPI workflows rely on document-based interactions (plans, descriptions, proposals). If a user sends comments on docs, infer they likely want you to update the doc, instead of or in addition to replying to the thread. If the request is straightforward, update the doc and resolve the comment.
