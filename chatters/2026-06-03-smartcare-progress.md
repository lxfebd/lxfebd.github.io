---
title: SmartCare AI 模型训练进展
date: '2026-06-03 22:00:00'
tags:
- AI
- 项目
- 日常
mood: 开心
cover: /images/miku/cover.webp
description: ''
---

SmartCare 的 LSTM 预警模型终于调通了，之前一直卡在数据预处理上。

医疗时序数据真的很脏，缺失值、异常值、格式不统一，光清洗就花了一周。不过看到模型在测试集上 AUC 到了 0.85，还是挺开心的。

下一步是把模型部署到 FastAPI 后端，做成实时推理服务。争取这周搞完。
