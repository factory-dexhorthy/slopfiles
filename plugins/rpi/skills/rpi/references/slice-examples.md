# Slice Examples

Horizontal and vertical slicings of the same work, graded bad, good, better, best. Each grade says when the first behavior you can watch arrives.

## Teach an agent to use tools it already has

The agent has task tools but rarely uses them. The goal is that it tracks its work in tasks without being told.

```text
bad: layers
  1  permissions   2  metrics   3  task ids on hand-offs   4  eval harness   5  all guidance + all evals
  first behavior you can watch: after step 5

good: one behavior per slice, each building all its plumbing first
  1  task ids on hand-offs + harness + "track delegated work"
  2  "update the task when the PR opens"
  first behavior: after slice 1, which is most of the plumbing

better: behaviors that need no new plumbing go first
  1  "update the task when the PR opens"     (tools exist, small harness)
  2  "close it when the PR merges"
  3  task ids on hand-offs + "track delegated work"   (plumbing arrives with the first behavior that needs it)
  first behavior: after a small slice 1

best: slice 1 is the smallest thing you can ask for and watch
  1  "make a task for this" -> it makes one   (one line of guidance, one eval)
  2+ as in better, ordered by what's demoable soonest
  first behavior: day one
```
## Add saved filters to a dashboard

Users rebuild the same filters every visit. The goal is that they can save a filter set and reapply it in one click.

```text
bad: layers
  1  saved_filters table + migration   2  CRUD API   3  client store   4  UI   5  flag on
  first behavior you can watch: after step 4

good: one behavior per slice, each full stack
  1  save a filter: table + API + store + button
  2  apply a saved filter
  3  rename and delete
  first behavior: after slice 1, which is most of the stack

better: the UI first, on local storage behind a flag
  1  save and apply filters in the browser (localStorage), behind a flag
  2  move storage to the server: table + API, same UI
  3  rename, delete, then flag on
  first behavior: after a small slice 1

best: slice 1 is the smallest thing you can click and watch
  1  a hardcoded "My filters" menu behind a flag; picking one filters the dashboard
  2  "Save current filters" adds to that menu (localStorage)
  3+ as in better
  first behavior: day one, and the menu's design gets feedback before any storage exists
```
## Move file uploads from the database to object storage

Uploads live as blobs in the main database, which keeps growing and slowing backups. The goal is that every upload is served from object storage.

```text
bad: layers
  1  bucket + config   2  dual-write   3  backfill every row   4  switch reads   5  drop the blob column
  first behavior you can watch: after step 4, for everyone at once

good: the standard steps, each verified as it lands
  1  bucket + dual-write new uploads, check the copies match
  2  backfill, with a count of rows done and mismatched
  3  switch reads, then drop the column
  first behavior: after slice 1, but nobody is served from the new store until slice 3

better: reads move first, one user at a time
  1  read from object storage when the file is there, else the database; copy on read
  2  dual-write new uploads
  3  backfill the rest, then drop the column
  first behavior: after slice 1, real traffic tests the new path as files move

best: slice 1 is one file you can load and watch
  1  copy one internal user's uploads by hand; behind a flag, serve that user from object storage
     (check load time, cache headers, permissions)
  2  widen the flag to staff, then to a percentage, with copy-on-read
  3+ as in better
  first behavior: day one, and the risky part (serving) is proven before any bulk copy
```

## Add an export command to a CLI

Users copy records out of the app by hand. The goal is that `tool export` writes a project's records to a file in JSON or CSV.

```text
bad: layers
  1  export service   2  JSON and CSV writers   3  pagination   4  flag parsing   5  wire up the command
  first behavior you can watch: after step 5

good: one format per slice, each complete
  1  `export --format json`: service, writer, pagination, flags, file output
  2  `--format csv`
  first behavior: after slice 1, which is nearly the whole command

better: the command first, on the simplest output
  1  `tool export` prints a small project's records as JSON to stdout
  2  pagination, so large projects work
  3  `--output <file>`, then `--format csv`
  first behavior: after a small slice 1

best: slice 1 is one command you can run and read
  1  a hidden `tool export` that prints the first page of records as JSON; run it and look
  2+ as in better, each adding one flag you can try
  first behavior: day one, and the output shape gets feedback before pagination or formats exist
```
