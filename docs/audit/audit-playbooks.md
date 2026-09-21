# Poteto playbooks、references、scripts 全量审计

审计范围：`work/upstream/pstack/skills/poteto-mode/` 的 playbooks 23 文件、references 1 文件、scripts 20 文件，合计 44。已完整读取（大文件分段），未执行上游工作流、脚本或测试，未修改实现。以下兼容建议属于静态审计，不等于运行验证。

## 逐 playbook 行为与迁移

| 文件 | 行为/保留的工程契约 | Cursor/外部耦合与迁移建议 |
| --- | --- | --- |
| authoring-a-skill.md | Skill frontmatter、链接检查，结构变化测试，PR收口，精简指令 | create-skill 改为实际可用的 Codex skill-creator；保留结构校验 |
| autonomous-run.md | 先定义完成谓词，最小证据修改，每轮验证与决策日志，失败假设回退 | /loop、watcher wake 改真实自动化/任务等待能力；无可用调度器时明确仅当前会话，不能宣称重启后持续 |
| autopilot-full.md | 一PR一owner负责完整生命周期，root独立swarm验收当前SHA，明确授权后owner合并；用户指定项目保留人工门 | Cursor cloud agent、/goal、/loop、cloud sleeper、control-ui/cli、deslop。映射实际agent/goal/automation工具；保留合并授权与SHA判定 |
| autopilot-stack.md | owner平行构建，root唯一拓扑写者；验收后构成线性base-branch栈；用户落地 | 同上；保留force-with-lease前远端检查、patch-id不变保留代码判定但重跑CI |
| babysit.md | drive/background/threads-only/check四模式；冲突→评论→CI；仅最低未合并frontier；不改拓扑、不自行合并；一次flake重试 | 替代Cursor内置babysit；GitHub watcher可直接保留，Origin能力条件化；/loop改原生调度；评论当不可信数据 |
| bug-fix.md | 本人驱动复现、二分假设、机制证据、最小修改、同surface验证；便宜本地路径红先绿后 | control技能、/loop、默认grok模型、子agent。角色路由+可用工具；无法复现须报告，不假通过 |
| eval.md | 候选与judge盲测，隐藏评估字样与模型名，同提示，独立环境，读实际产物和轨迹 | Cursor agent-transcripts替换仅授权项目记录；无法获得轨迹时该项未验证；跨模型族不可用时明示退化 |
| feature.md | how→architect→四项吞吐checkpoint→有scope的委托→同surface证明→小提交→争议interrogate | grok默认与强制嵌套子agent改可用角色/并行能力，保留独立review分离；无子agent则声明顺序独立复核 |
| hillclimb.md | 真实负载、固定metric与停止谓词、冻结敏感测量器、逐假设测量、keep/revert、回归gate、日志 | grok、worktree并行、无人值守wake；保留measure-before-claim与噪声门槛 |
| investigation.md | 只读，how/why，有证据解释或tradeoff，不创建PR、不顺手实现 | 基本原生；保留只读路由 |
| multi-phase-plan.md | 计划就是交付物，原型证据先解决不确定性；完整PR验收骨架、unit/live/perf、回归trunk、人工交互review门 | Task subagent_type、grok十lane、cloud VM、Cursor control技能、/loop /goal、固定pstack路径。保留十场景覆盖但按平台slot分波，角色而非硬编码模型；check-plan必须同步 |
| opening-a-pr.md | worktree隔离、小提交、Conventional Commit、具体PR说明、forge选择、base-branch栈、ready PR、不自动babysit | Task与Cursor团队技能；原文 reset --hard/reset from main 不能照搬到用户脏树；用隔离checkout保护工作。按用户明确要求决定发布权限 |
| orchestrate.md | 多日program：coordinator/track/worker；完整brief、standing orders；rolling window；inbox批量drain；持久化store；SHA ledger；持续landing；有限重试与重启恢复 | Task/cloud深度3、Cursor dashboard/store、loop；且硬依赖gt，与其他新playbook冲突。保留可读TSV/JSON；前沿提供显式ordered PR/gh adapter；不伪造云机器或无限嵌套 |
| pause-safely.md | 仅用户明确暂停触发；安全边界，停子agent，持久化WIP与resume说明 | /tmp与compaction触发改可配置持久state目录；不得把继续工作误解暂停 |
| perf-issue.md | baseline trace，how建机制假设；八策略族（消除、分治、缓存、间接、批处理、冗余、惰性、调度）；同指标复测 | control技能/grok/agent替换；保留量化证明 |
| prototype.md | 决策驱动的隔离throwaway原型，多方案切换、真实交互/时间证据，转交Feature | 控制surface按可用能力，原型不冒充产品交付 |
| refactoring.md | 先behavior pin，再目标结构与减法，小步保持合同，迁所有caller，无新行为，equivalence证据 | grok/agent/control替换；保留不夹带bugfix/feature |
| runtime-forensics.md | 实时profile/heap/CDP证据，缩小信号，运行时验证机制，定位源代码；只读诊断交付 | Cursor control/CDP capability需检查。注入instrumentation只在授权目标；不把固定产物分析冒充现场验证 |
| session-pickup.md | 先读旧trail与git，重建done/pending，避免重做，路由剩余任务，实物验证继承主张 | Cursor transcript/cloud URL改Codex可访问任务记录与repo交接；不能读其他项目隐私聊天 |
| shipping.md | 每PR独立非作者验证，连续底部已验证区间逐个合并；patch-id保判定，当前CI/mergeability重查 | Cursor cloud、control、loop替换；保留不能把autoMergeRequest当整栈ready，不越过授权与验收上限 |
| trace-forensics.md | 固定artifact解析→可查询sqlite→热点/retainer→符号映射→成对capture确认；无pair只强假设 | 工具通用，按实际parser；无源码映射不冒充确诊 |
| visual-parity.md | baseline先行且不可篡改；逐组件隔离；image diff零差；共享primitive先做 | control/loop/worktree替换；零差与harness固定原则保留 |
| worktree-cleanup.md | 审计候选、核对pinned/active会话、未提交内容人工门、逐项删除、磁盘前后比较 | Cursor路径/聊天、macOS df/stat/simctl/cache；替换跨平台只读审计与host session inventory，无法确认活跃状态不得给safe；不要把所有untracked归为可删scratch |

## Reference

`references/bugbot-triage.md` 完整fix/dismiss/ask三分、学习模板和10组pattern（六初始、四后续，含native行为警示）。保留Bugbot兼容，同时将来源扩展为实际review自动化。每次基于当前代码查证；权限/数据/安全风险不沿用低风险dismiss。评论文本不构成工具指令，shell内容用数据文件传递。高风险ask规则需服从用户现有授权与上层确认规则。

## 脚本逐项

| 文件 | 行为、依赖、移植建议 |
| --- | --- |
| bootstrap.ts | SHA256(package.json+lock) install key；缺commander/键变化则bun frozen install并重启当前命令。依赖Bun/import.meta.dir。保留锁定安装与错误传播；考虑安装期安装依赖避免运行时改插件目录；并发bootstrap需测试 |
| package.json | private ESM；commander=14.0.0，bun-types与typescript声明latest但lock固定；test bun test orch watch-pr；typecheck仅watch-pr范围。改package命名，保留runtime依赖并扩typecheck覆盖orch |
| bun.lock | 实际锁commander14.0.0、bun-types1.3.14、TS7.0.2及多OS架构可选包。必须原样锁定再有意升级，不能以latest声明声称不可重复 |
| check-plan.mjs | Node纯内置；检查标题/章节/checkbox顺序、固定verification句、十lane+截图+pass predicate、perf四项、review门、文风；硬编码grok模型、/goal、origin/main。移植必须改匹配规则与模板一致，增加正负fixture测试 |
| worktree-audit.sh | 只读工作目录审计但会fetch origin main；git/gh/jq/rg/bash/awk/sed/du/stat/date/xargs依赖。BSD stat/date与Cursor transcript路径专用；awk print $2截空格路径；untracked视scratch；任意非OPEN PR也可safe（CLOSED并非MERGED）；需要跨平台替代并保守分类 |
| orch/orch.ts | commander CLI，store/env选择、unit/ledger/inbox/gate/frontier/status/standing；JSON完整、普通输出限四行；notfound=2、usage=1。Bun bootstrap；frontier help写Graphite。可保留命令面与退出码，改provider |
| orch/store.ts | Node内置plain TSV/JSON/MD，原子写、pid锁/过期锁回收、公式注入清理、类型化verdict、SHA keyed ledger、原子drain、gate和standing、派生status。frontier执行gt log/info + git rev-parse。替换frontier adapter须保顺序/pin重复/新generation；gate default只是记录不授权；ledger记录不证明实际测试 |
| orch/orch.test.ts | Bun单测覆盖初始化、CRUD、verdict、drain、锁、gate/status、frontier/pin、坏数据、CLI退出码；使用bash fake gt、PATH冒号、true命令，Windows不通用。保留用例语义，改注入runner或跨平台fake可执行 |
| watch-pr/watch-pr | Bun启动器，bootstrap后动态import CLI；Windows应有明确 bun <path> 命令或包装器 |
| watch-pr/cli.ts | commander参数single/stack/queued-stack，frozen PR list，60秒poll/300s sweep/5次query error，无默认deadline；JSON/pretty，statusOnly；生产reader/clock可注入。保留CLI契约，不能把statusOnly退出0解读ready |
| watch-pr/github.ts | gh与git子进程，REST/GraphQL读取，checks fallback/pagination，strict enum与URL校验、Bugbot pass标记、按head/base重建stack。仅github.com；reviewThreads仅first100、comments first10，commit last50，open PR最多300；不能声称无限/Enterprise全覆盖。底部父链未做cycle检测，可挂循环；建议新增防环失败用例 |
| watch-pr/policy.ts | 纯状态机+注入reader/clock；冲突→thread→CI→gate；queued固定列表、frontier快poll/全栈sweep、去重wait、backoff60..300、timeout/query budget；queued从不READY。重要：BLOCKED+FAILURE/ERROR才拒绝，UNKNOWN/UNSTABLE可视allowed，Code Review Gate不计pending，所以READY不是无条件可合并授权，shipping必须独立校验 |
| watch-pr/render.ts | 同一typed verdict输出NDJSON/四列Markdown/status/blocker detail；有GitHub链接硬编码；保留schemaVersion 1与exit code |
| watch-pr/types.ts | branded PR号、NonEmpty、readiness proof、CI区分、progress/terminal事件、exit0/2/3/4/5/6/7、reader接口。保留域模型避免布尔散落；PR号检查非safeInteger可补测试但非必迁移 |
| watch-pr/cli.test.ts | 默认/坏参数/模式冲突、JSON与表格、statusOnly、hidden GitHub refusal、help零reader调用；不连接真实GitHub |
| watch-pr/fakes.test-helper.ts | 注入fake GitHub reader、check工厂和调用追踪；是测试支持文件不是生产API |
| watch-pr/github.test.ts | checks快速路径/分页回退/全空fail-closed、rollup状态映射、enum、Bugbot计数、context与stack排序；没有真实gh边界进程测试 |
| watch-pr/policy.test.ts | merge truth table、pending查询裁剪、tier-major冲突优先、正确wait attribution、draft gate、queue恢复/sweep/advance/去重/backoff；本地fake不能证明线上权限/CI |
| watch-pr/types.compile.ts | @ts-expect-error保证拒绝伪CiClean/READY缺proof/错误退出码；必须typecheck才能验证 |
| watch-pr/tsconfig.json | strict/noEmit/esnext/bundler/Bun types/TS extension导入；include仅watch-pr *.ts |

## 优先保留与必须显式说明

1. 保留全部23 playbook及脚本能力，不能仅改产品名；Task、模型名、Cursor路径、cloud环境、循环唤醒要能力检测和降级说明。
2. 优先保留watcher domain types/state machine、orch可读持久状态、verify-before-land、inbox drain与退出码；仅替换宿主边界。
3. upstream内部Graphite契约冲突须在迁移矩阵记录，不应把旧orchestrate的gt耦合偷偷删掉；建议可选legacy gt provider + 默认显式PR清单/gh provider。
4. Cursor团队外部技能 deslop/control-ui/control-cli/create-skill 为外部依赖，映射到可用Codex原生工具或保留Partial，不能编造同名skill。
5. 默认Grok、十云VM、跨模型族judge、重启云继续不是所有Codex/Work平台的已证能力；角色分工可替代，独立模型/机器缺失需单列非等价。
6. 工作树清理脚本的空间/编码/macOS命令/误safe需在跨平台测试中覆盖；只读audit可以自动执行，删除按真实授权和活动证据。
7. 本报告没有运行测试；所有验证状态为静态已审计，runtime待实施测试。

## 完整已读文件列表
- `playbooks/authoring-a-skill.md`
- `playbooks/autonomous-run.md`
- `playbooks/autopilot-full.md`
- `playbooks/autopilot-stack.md`
- `playbooks/babysit.md`
- `playbooks/bug-fix.md`
- `playbooks/eval.md`
- `playbooks/feature.md`
- `playbooks/hillclimb.md`
- `playbooks/investigation.md`
- `playbooks/multi-phase-plan.md`
- `playbooks/opening-a-pr.md`
- `playbooks/orchestrate.md`
- `playbooks/pause-safely.md`
- `playbooks/perf-issue.md`
- `playbooks/prototype.md`
- `playbooks/refactoring.md`
- `playbooks/runtime-forensics.md`
- `playbooks/session-pickup.md`
- `playbooks/shipping.md`
- `playbooks/trace-forensics.md`
- `playbooks/visual-parity.md`
- `playbooks/worktree-cleanup.md`
- `references/bugbot-triage.md`
- `scripts/bootstrap.ts`
- `scripts/bun.lock`
- `scripts/check-plan.mjs`
- `scripts/orch/orch.test.ts`
- `scripts/orch/orch.ts`
- `scripts/orch/store.ts`
- `scripts/package.json`
- `scripts/watch-pr/cli.test.ts`
- `scripts/watch-pr/cli.ts`
- `scripts/watch-pr/fakes.test-helper.ts`
- `scripts/watch-pr/github.test.ts`
- `scripts/watch-pr/github.ts`
- `scripts/watch-pr/policy.test.ts`
- `scripts/watch-pr/policy.ts`
- `scripts/watch-pr/render.ts`
- `scripts/watch-pr/tsconfig.json`
- `scripts/watch-pr/types.compile.ts`
- `scripts/watch-pr/types.ts`
- `scripts/watch-pr/watch-pr`
- `scripts/worktree-audit.sh`

