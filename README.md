# Andy's Portfolio

A portfolio that opens as a fake shell. Visitors type `whoami`, `ls projects`, `cat resume.pdf` — and
anyone who would rather not type hits **GUI mode** for a normal, skimmable site. Both views render from
the same data, so nothing goes stale in one place and not the other.

## Features
- **Working shell** — a virtual filesystem you can `ls`, `cd`, `cat`, and `tree` through
- **Inline suggestions** — dim ghost text shows the rest of the match as you type; `→` accepts it
- **Completion menu** — Tab opens a zsh-style menu of commands, paths, project slugs, and themes, each
  with a description. Tab / Shift+Tab / arrows cycle, Enter accepts, Esc reverts, click works too
- **Command history** — ↑ / ↓ to recall, plus a `history` command
- **Shell keybindings** — Ctrl+L clear, Ctrl+C cancel, Ctrl+U kill line
- **GUI mode** — a persistent button (and `gui` command) that swaps in a conventional portfolio page
- **Four themes** — `theme green | amber | blue | mono`, remembered between visits
- **Easter eggs** — `sudo hire andy`, `matrix`, `coffee`, `vim`, `sl`, `rm -rf /`, and a hidden file

## Run locally
No build step:
```bash
open index.html
```
Or serve it:
```bash
npx serve .
```

## Commands
`help` lists everything. Highlights:

| Command | What it does |
| --- | --- |
| `whoami` | Who I am, in one screen |
| `projects` | Every project, with demo and source links where public |
| `experience` | Work history |
| `ls` · `cd` · `cat` · `tree` | Move around the filesystem |
| `resume` | Opens the PDF |
| `open <project>` | Jumps straight to a demo or repo |
| `gui` | Leaves the terminal for the standard site |
| `sudo hire andy` | The important one |

## Tech
Vanilla JS, CSS, and no dependencies — no framework, no build, no 3D engine. Roughly 40 KB of source.
