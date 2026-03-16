# ML DATA LINEAGE

> 项目名称: [项目名称]  
> 创建日期: [YYYY-MM-DD]  
> 状态: Template  
> 负责人: [负责人]

# ML-DATA-LINEAGE

## 数据血缘概览

描述从原始数据采集到模型预测输出的完整链路，并标注关键控制点与审计节点。

## 数据源注册

| 数据源 | 类型 | 更新频率 | 所有者 | 质量评级 |
| --- | --- | --- | --- | --- |
| [source_a] | [DB/API/文件/流] | [实时/小时/日] | [Team/Owner] | [A/B/C] |
| [source_b] | [DB/API/文件/流] | [实时/小时/日] | [Team/Owner] | [A/B/C] |

## 转换与处理

按 ETL 步骤记录：
1. **Step-1**：输入 [Input] → 转换逻辑 [Transform] → 输出 [Output] → 质量检查 [DQ Rules]
2. **Step-2**：输入 [Input] → 转换逻辑 [Transform] → 输出 [Output] → 质量检查 [DQ Rules]

## 版本追踪

- 数据版本管理工具：[DVC/Delta Lake/LakeFS/etc]
- 数据快照策略：[每日快照/版本标签/关键发布留存]
- 追溯规则：[模型版本 ↔ 数据版本双向映射]

## 合规与隐私

- PII 标记策略：[字段级标签与分类分级]
- 脱敏规则：[哈希化/掩码化/Tokenization]
- 数据访问审计日志：[访问主体、时间、操作类型、审批记录]
