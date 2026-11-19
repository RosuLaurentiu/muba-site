@AGENTS.md

## Backlog (Claude Code)

1. At the start of work, load the Backlog MCP tools (ToolSearch "backlog") and check the project: task IDs start with MS.
2. Before editing files, name the task (`task_view` with `compact: true`) or create one (`task_prepare`, then `task_create`).
3. End every requested change that edits files with one save: `task_edit` with a `checkpointResult`, or `task_log` for small work.
4. Without the MCP tools, run the same commands through `.\Backlog.ps1` (for example `task log`, `task edit`).
