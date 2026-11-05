# slopfiles

Dex's personal Droid plugins.

| Plugin | What it is |
| --- | --- |
| [`slopfiles`](plugins/slopfiles/README.md) | General-purpose skills, hand-maintained here. |
| [`rpi`](plugins/rpi) | Fork of the `rpi` plugin from [humanlayer/skills](https://github.com/humanlayer/skills) (MIT), customized here. |

```bash
droid plugin marketplace add https://github.com/factory-dexhorthy/slopfiles
droid plugin install slopfiles@slopfiles --scope user
droid plugin install rpi@slopfiles --scope user
```

## rpi fork

Copied verbatim from humanlayer/skills at commit `4d69d20` (rpi 1.1.0), then edited here. Each implementer file exists twice: `plugins/rpi/agents/outline-implementer-agent.md` (loaded as a droid) and `plugins/rpi/skills/rpi/references/subagents/outline-implementer-agent.md` (read by the skill). Keep both copies identical. The same holds for the other four subagents.
