> OpenAI edition: examples use Codex `$skill-name`. In ChatGPT Work use `@skill-name` only when that skill is installed and shown by the host; availability and tool access are host-dependent. Plain chat can read supplied instructions but does not thereby gain repository tools, background execution, or subagents. See [runtime boundaries](../../references/openai-runtime.md).

# Set up pstack

Install the plugin, configure supported roles, and run one small verified task.

## Install the plugin

Follow the repository [installation guide](../../../../INSTALL.md). The distribution contains a native plugin at `plugins/pstack-codex`; the repository scripts install through the host's supported marketplace mechanism (marketplace name `personal`). Restart or refresh the host as the installer instructs, then verify that `$poteto-mode` is discoverable in a fresh task. A file copied to disk is not proof of discovery.

## Configure roles

Run `$setup-pstack` in Codex. Start with `inherit-parent` for code, judgment, investigator and reviewer roles. Only select a concrete model when the current host reports it as available and exposes a supported override. A skill cannot force a parent conversation to switch models. `auto` is an alias for omitting an optional model override, never a model identifier.

Independent reviewer roles remain useful on a single model; they are not a claim of cross-family diversity. Configure panel size within the host's actual concurrency limits and queue extra work. Follow the [runtime contract](../../references/openai-runtime.md) for configuration and tool boundaries.

## Accept the verification offer, or don't

At the end of setup, `$setup-pstack` looks for a way to prove app behavior in your project, either a `verify-*` skill or an existing harness. If it finds neither, it offers once to generate one with [`$create-verification-skill`](../../skills/create-verification-skill/SKILL.md).

Say yes and it writes `.agents/skills/verify-<app>/`, a project-local skill that teaches agents to drive your app the way a user does. It proves the skill works once before handing it over. Say no and setup moves on. You can run `$create-verification-skill` yourself any time. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers when it earns its place.

After setup, start a fresh task and verify discovery and the selected role configuration.

## Run your first task

Pick something real but small, and describe it the way you'd describe it to a colleague:

```text
$poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.
```

Watch the todo list. Its first items are the matched playbook's steps copied in, the Feature playbook for this prompt. If `$poteto-mode` skips a step, the step stays in the list with `skip: <reason>`, so you can see what it chose not to do.

From here you can type normal follow-ups. `$poteto-mode` is sticky. It stays on for the conversation until you opt out by saying so.

Next: [Route work through `$poteto-mode`](./02-poteto-mode.md).
