# Pstack-codex 交付说明

已按用户授权公开发布为 [Pstack-codex](https://github.com/Hirako-NoLabel/Pstack-codex)，当前版本 0.1.1。

## 范围和计数

上游锁定到 PStack **0.15.2 / 6ed0f7a**。完整保留 **158 个原始文件**及 Lauren Tan 的 MIT 版权。

按具名条目计算：**47 个主 Skills + 23 个 Playbook + 2 个 Agent 角色 + 3 个 Benny 操作 Skills = 75 项**。脚本及跨功能机制单列，避免重复计数。

| 分类 | 数量 |
|---|---:|
| A：原生等价方案 | 29 |
| B：替代实现 | 19 |
| C：部分兼容 | 26 |
| D：暂无已验证的原生等价能力 | 1 |
| 做过实际 Agent 工作流抽样的条目 | 12 |
| 未做完整工作流抽样执行的条目 | 63 |
| 已证明所有目标平台完全 1:1 复刻 | 0 |

这些类别是架构判断，不把“文件存在”“发现成功”或单元测试当作全面行为等价证明。

## 实际通过

- 官方插件校验、47/47 官方 Skill 校验、197 个插件内链接检查。
- 全新克隆、全新隔离配置中的安装、47 技能发现、重新加载、卸载、重装。
- PowerShell 与 Windows Git Bash 的真实本地 Git 快进更新及版本缓存核对。
- 统一测试入口：20 项便携脚本 + 30 项可执行验收回归全部通过；另有 57 项 Bun 测试及类型检查通过记录。
- Bug Fix/TDD 新一轮保留同步行为，先红后绿 8/8，并有独立调查与评审；旧 5 项样例保留历史记录；Feature 实测 6/6。
- Architect/Arena 四个独立候选、独立评审与综合实现，11/11 行为测试通过。
- 独立同模型评审、只读调查前后状态及文件哈希不变、Recall 状态恢复、Reflect 三并行镜头及独立汇总抽样。

## 非完全兼容能力

全部 26 个 C 类与 1 个 D 类条目逐项列在 [迁移矩阵](MIGRATION_MATRIX.md) 末尾；每个条目的验证状态也在表内。

主要限制包括：完整聊天历史、跨模型族评审、云 VM/嵌套深度、跨重启调度、真实 UI/录屏/性能负载、PR/合并服务、Benny 外部集成。唯一 D 类是 `make-bot-ui` 的 Cursor/Grok 原生 webhook 唤醒与秘密输入卡片，保留完整需求和外部配置替代方案，未虚构 OpenAI API。

Windows、macOS、Linux 的 GitHub Actions 检查均通过（50 项标准测试、57 项 Bun 测试及类型检查）。公开 GitHub 源的 Windows 安装、47 技能发现、卸载、重装和 0.1.0 → 0.1.1 更新已实测。macOS/Linux 的 Codex 原生安装与 ChatGPT Work 仍未实测；CI 不替代宿主兼容验收。

## 使用和维护

- [安装、更新、卸载、重装](INSTALL.md)
- [分平台兼容性](COMPATIBILITY.md)
- [具体测试证据与未验证项](VERIFICATION.md)
- [原始需求逐项验收](docs/acceptance/requirements-audit.md)
- [Reflect 完整待审提案](docs/acceptance/reflect/synthesis.md)
- [上游更新检测和审阅同步](UPSTREAM.md)
- [完整指南](plugins/pstack-codex/docs/guide/README.md)

本地安装运行 `install.ps1`，POSIX shell 使用 `sh install.sh`。安装后在新 Codex 任务中调用 `$poteto-mode`。GitHub 源安装步骤见 INSTALL.md；Windows 使用已处理长路径的 PowerShell 安装脚本。没有向你的真实 Codex 配置安装测试副本，也没有激活 Benny、发送外部消息或创建 PR。
