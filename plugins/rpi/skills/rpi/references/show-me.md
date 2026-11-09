---
name: show-me
description: Help the user understand the current topic visually with concise diagrams, code-shape sketches, and focused HTML artifacts.
---

Help the user understand the current topic of conversation visually. Skip the preamble and keep prose brief. Pick the smallest view that makes the key point clear.

- Show logic or an algorithm as pseudocode:

```text
on(save)
  if content is unchanged
    return cached result
  write new content
  return fresh result
```

- Show runtime control flow as a call tree:

```text
submitForm
  createSession
    persistPrompt
    launchAgent
  navigateToSession
```

- Show UI structure as a component tree, including state and module boundaries that matter:

```tsx
<SessionPage> (apps/example/src/routes/session.tsx)
  useSessionEvents()
  <SessionToolbar>
    <RunSkillButton> (packages/ui)
```

- Show file responsibility or a broad refactor as a shallow file tree:

```text
src/
├── commands/       # parses user actions
├── sessions/       # owns session state
└── transport/      # sends API requests
```

- Show component interaction, control flow, or data flow with Mermaid:

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Daemon
    User->>UI: choose command
    UI->>Daemon: send expanded prompt
    Daemon-->>UI: stream result
```

- Use `diff` when the point is what changes and the surrounding shape already exists. Match the diff shape to the topic.

For a component change:

```diff
 <SessionPage>
   useSessionEvents()
   <SessionToolbar>
+    <RunSkillButton />
   <SessionTimeline>
+    <SkillResultCard />
```

For a file-layout change:

```diff
 src/
 ├── commands/
+│   └── show-me.ts       # expands the slash command
 ├── sessions/
-└── transport.ts
+└── transport/
+    ├── client.ts
+    └── stream.ts
```

For a call-tree or call-stack change:

```diff
 submitForm
   createSession
     persistPrompt
+    expandSkillMention
     launchAgent
-  navigateToSession
+  navigateToSession
+    subscribeToEvents
```

For a state or control-flow change:

```diff
 on(save)
-  write content
+  if content is unchanged
+    return cached result
+  write new content
+  invalidate cache
```

- Show the whole block when most of it is new, when omitted context would hide ownership or order, or when the user needs a copyable target shape:

```ts
function expandSkill(command: string): string {
  const skillName = command.slice(1)
  return `use the ${skillName} skill`
}
```

- For a visual UI, layout, state comparison, or concept too dense for Mermaid, write one focused HTML file — a diagram, an infographic, or a short slide deck, whichever fits the point. Match the product's colors, type, spacing, and components; use real labels and data; support desktop and mobile. Then open it for the user:

```
Bash(open path/to/show-me-{description}.html)
```

### Render Visuals in the Terminal

`<json-render>` blocks render in assistant messages in the chat, showing tables, timelines, charts, and status cards inline. Use one when the visual materially helps understanding.

Use it only in assistant messages, the one place it renders. In static sites, PR descriptions, shared documents, and other files, show the same content as a Markdown table, a Mermaid diagram, raw HTML, or an image.

The examples below sit in code fences so they display as syntax. In a reply, emit each one raw and unfenced, on a single line.

Compare options with a recommendation:

```text
<json-render>{"root":"opts","elements":{"opts":{"type":"Box","props":{"flexDirection":"column","gap":1},"children":["opts-title","opts-table"]},"opts-title":{"type":"Heading","props":{"text":"Where to store drafts","level":"h2"},"children":[]},"opts-table":{"type":"Table","props":{"columns":[{"header":"Option","key":"option"},{"header":"Changed lines","key":"lines"},{"header":"Risk","key":"risk"}],"rows":[{"option":"A: extend the existing queue (recommended)","lines":"~250","risk":"Low"},{"option":"B: add a new scheduler","lines":"~900","risk":"High"}],"headerColor":"cyan"},"children":[]}}}</json-render>
```

Show slice and PR status:

```text
<json-render>{"root":"slices","elements":{"slices":{"type":"Timeline","props":{"items":[{"title":"5.4 Add the drafts table (#1233)","description":"Merged","status":"completed"},{"title":"5.5 Save drafts on the server (#1234)","description":"In review","status":"current"},{"title":"5.6 Show draft status in the list (no PR)","description":"Needs 5.5","status":"upcoming"}]},"children":[]}}}</json-render>
```

Compare sizes:

```text
<json-render>{"root":"size","elements":{"size":{"type":"Box","props":{"flexDirection":"column"},"children":["size-title","size-chart"]},"size-title":{"type":"Heading","props":{"text":"Changed lines per slice","level":"h3"},"children":[]},"size-chart":{"type":"BarChart","props":{"data":[{"label":"5.4","value":180},{"label":"5.5","value":340},{"label":"5.6","value":260,"color":"yellow"}],"showPercentage":false},"children":[]}}}</json-render>
```

Summarize one PR:

```text
<json-render>{"root":"pr","elements":{"pr":{"type":"Card","props":{"title":"5.5 (#1234) Save drafts on the server","padding":1},"children":["pr-size","pr-owners","pr-checks","pr-review"]},"pr-size":{"type":"KeyValue","props":{"label":"Changed lines","value":"340"},"children":[]},"pr-owners":{"type":"KeyValue","props":{"label":"Code-owned files","value":"0"},"children":[]},"pr-checks":{"type":"StatusLine","props":{"text":"All pre-approval checks pass","status":"success"},"children":[]},"pr-review":{"type":"StatusLine","props":{"text":"One automated review finding to resolve","status":"warning"},"children":[]}}}</json-render>
```

### guidance

Place each visual next to the short text it supports. Keep only the calls, files, props, states, and boundaries needed to answer the user's current question or the options to resolve the current discussion point.

You may use one of these, you may use several, it is unlikely you will use all of them. Use your judgement and don't overwhelm the user.
