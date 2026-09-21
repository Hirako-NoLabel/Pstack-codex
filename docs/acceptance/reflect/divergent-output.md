1. **Principle:** 临时缺少独立评审资源，应形成待补的验证责任，而不是永久降低验收标准。  
   **Evidence:** 摘要第 5、7 项记录了槽位占满时采用同作者探索、顺序镜头，之后又补做独立评审和真实并行；最初的降级说明没有同时定义何时重新检查资源、补回原承诺。当前技能允许顺序执行并披露限制，但未明确这一补验闭环；同模型的独立执行也不能补成跨模型验证。  
   **Routing:** `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/SKILL.md` — Subagents：对原本承诺的独立验证记录待补项，并在最终验收前重新判断能否完成。

2. **Principle:** 恢复状态的操作必须比读取正常状态具有更弱的前置条件，否则恢复机制会继承它本应修复的故障。  
   **Evidence:** 摘要第 6 项明确指出，接收有效新 checkpoint 前先解析损坏旧状态，导致替换也失败；独立评审复现后才修复。当前实现已让新 checkpoint 绕过旧状态读取，并有损坏状态回归测试，因此这是已修复问题揭示的耐久原则，不是现存缺陷。技能说明尚未区分“读取旧状态失败”与“无法建立新状态”。  
   **Routing:** `outputs/pstack-openai/plugins/pstack-openai/skills/recall/SKILL.md` — 恢复辅助工具契约；优先保留为脚本和回归测试约束，避免仅增加文字提醒。

3. **Principle:** 审计证据本身也会被分发过程改变，因此工作区内的自洽不能替代接收端的真实性验证。  
   **Evidence:** 摘要第 10 项记录，原本用于证明来源完整性的字节哈希锁，会被 Git 换行转换破坏；直到从准确 Git 对象重建、保护文件属性并检验新 clone，才覆盖这一链路。此前的完整读取与本地哈希没有检验“证据经过分发后是否仍成立”。  
   **Routing:** `outputs/pstack-openai/plugins/pstack-openai/skills/poteto-mode/SKILL.md` — 制作与验证交付物的流程：涉及来源保真承诺时，将实际分发后的独立副本纳入验收，而不只重复检查生成证据的工作区。
