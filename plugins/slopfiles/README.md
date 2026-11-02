# slopfiles

General-purpose skills.

| Skill | What it does | Source |
| --- | --- | --- |
| `conjure-prd-mirror` | Publishes a Markdown PRD as a Conjure site with click-to-comment review. Reviewers copy their comments as XML and paste them back to the agent. | Hand-maintained in this repo. |

## conjure-prd-mirror

`scripts/site.mjs` builds the site, `scripts/review.js` is the comment layer, and `scripts/publish.sh` builds and deploys in one step. The first build installs `marked`, `mermaid` and `geist` into `~/.cache/conjure-prd-mirror`. Deploying needs the `conjure` CLI, logged in.

## Install

```bash
droid plugin marketplace add https://github.com/factory-dexhorthy/slopfiles
droid plugin install slopfiles@slopfiles --scope user
```
