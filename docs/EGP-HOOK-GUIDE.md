# EGP Hook Guide — gh-issue-gate.py

> Engineering Governance Protocol (EGP) local enforcement layer.
> This hook ensures every GitHub write operation has an audit trail.

---

## What It Does

The EGP Hook intercepts all `gh` CLI write commands before execution. If a command lacks an Issue reference (`# AI-Decision: #NNN`), the hook blocks it with exit code 2.

This is **Layer 1** of the dual-gate system. Layer 2 is GitHub Branch Protection (server-side).

---

## Location

| Item | Path |
|------|------|
| Hook script | `~/.claude/hooks/gh-issue-gate.py` |
| Hook config | `~/.claude/settings.json` (PreToolUse > Bash) |

---

## How It Works

1. Claude Code fires a `PreToolUse` event before every Bash tool call
2. The hook reads the command from stdin (JSON with `tool_input.command`)
3. It strips heredoc content to avoid false positives on quoted `gh` commands
4. It checks if the command matches any GitHub write operation pattern
5. If it's a write operation, it requires `# AI-Decision: #NNN` or `# Issue: #NNN`
6. If the reference is missing, the command is blocked (exit 2)

---

## Intercepted Operations

| Category | Commands |
|----------|----------|
| PR operations | `gh pr create`, `merge`, `edit`, `close`, `review`, `ready`, `reopen` |
| Issue operations | `gh issue edit`, `close`, `delete`, `reopen` |
| Run operations | `gh run delete`, `cancel` |
| Workflow operations | `gh workflow disable`, `enable` |
| Release operations | `gh release create` |
| Label operations | `gh label create`, `edit`, `delete` |
| API operations | `gh api` with `POST`, `PATCH`, `PUT`, `DELETE` |

### Exempt Operations

- **`gh issue create`** — Creating an Issue IS the audit trail, so it does not need a reference.
- **All read operations** — `gh pr list`, `gh issue view`, `gh api GET`, etc.

---

## Correct Usage

Every write command must end with an Issue reference comment:

```bash
# Standard format
gh pr merge 617 --squash  # AI-Decision: #620

# Also accepted
gh run delete 12345678  # Issue: #625

# Multiple commands — each gh write needs its own reference
gh issue close 100 # AI-Decision: #100 && gh pr merge 200 --squash # AI-Decision: #100
```

### Workflow

```
1. Create a GitHub Issue (this is your audit record)
   gh issue create --title "..." --label "ai-decision"

2. Reference that Issue in every write operation
   gh pr merge 617 --squash  # AI-Decision: #628

3. The Issue becomes the permanent audit trail for that operation
```

---

## Configuration

The hook is configured in `~/.claude/settings.json`:

```json
{
  "PreToolUse": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "python3 ~/.claude/hooks/gh-issue-gate.py",
          "statusMessage": "EGP Gate: checking GitHub issue reference..."
        }
      ]
    }
  ]
}
```

### To disable temporarily (not recommended)

Remove or comment out the hook entry in `settings.json`. This removes Layer 1 protection entirely — Layer 2 (Branch Protection) still applies on the server side.

---

## Error Message

When blocked, the hook outputs:

```
EGP Gate — GitHub write operation blocked
Every GitHub write operation must reference an Issue.
Add a comment to your command: # AI-Decision: #NNN
Example: gh pr merge 617 --squash # AI-Decision: #620
```

---

## Technical Details

- **Language**: Python 3
- **Input**: JSON from stdin (`tool_input.command`)
- **Heredoc stripping**: The hook strips heredoc content (`<<EOF...EOF`) before pattern matching to prevent false positives when `gh` commands appear inside heredoc strings (e.g., in PR body text)
- **Pattern matching**: Case-insensitive regex against known write operation patterns
- **Exit codes**: 0 = allow, 2 = block
