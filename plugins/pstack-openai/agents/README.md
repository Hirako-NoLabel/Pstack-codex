# Agent role templates

These Markdown files are portable role prompts. Their presence in this plugin does not register a named agent. Pass the complete prompt to the native subagent tool and resolve the plugin path explicitly. Subagent availability, parallel limits, isolation, model overrides and resume behavior depend on the active host.

Optional TOML templates in `templates/` use Codex custom-agent fields. Setup may copy a selected template to a project's `.codex/agents/` only after checking the host supports custom agents and the user wants it. This plugin never changes global agent configuration automatically. Replace the absolute plugin root placeholder before installation. Model and reasoning are omitted so the agent inherits its parent.
