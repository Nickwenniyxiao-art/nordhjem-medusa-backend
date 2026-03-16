# ML FEATURE STORE

> 项目名称: [项目名称]  
> 创建日期: [YYYY-MM-DD]  
> 状态: Template  
> 负责人: [负责人]

# ML-FEATURE-STORE

## 特征库概览

- 在线特征：低延迟查询，服务实时推理
- 离线特征：批量计算，服务训练与分析
- 技术选型：[Feast/Tecton/自研平台]

## 特征注册

| 特征名 | 数据类型 | 来源 | 更新频率 | 描述 | 所有者 |
| --- | --- | --- | --- | --- | --- |
| [feature_1] | [int/float/string] | [table/topic/api] | [实时/小时/日] | [特征定义] | [Team/Owner] |
| [feature_2] | [int/float/string] | [table/topic/api] | [实时/小时/日] | [特征定义] | [Team/Owner] |

## 特征工程规范

- 命名规范：[domain_entity_feature_window]
- 版本管理：[特征 schema 与计算逻辑版本化]
- 依赖关系图：[上游数据源与下游模型映射]
- 废弃策略：[公告期、替代特征、迁移计划]

## 一致性保障

- 训练/推理一致性验证：[Training-Serving Skew 检测]
- 特征监控：[缺失率、分布漂移、异常值比例]
- 质量门禁：[上线前特征验收清单]

## 访问控制

- 特征权限管理：[RBAC/ABAC + 最小权限]
- 审计日志：[查询主体、查询时间、特征范围、审批记录]
