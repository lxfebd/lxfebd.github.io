---
title: "AI-A05 - 2026 软件创新大赛记录"
date: "2026-05-25 18:00:00"
description: "参加 2026 年软件创新大赛的项目经历和收获"
cover: "/images/miku/cover.webp"
tags: ["AI", "比赛", "创新", "全栈"]
---

## 比赛背景

2026 年软件创新大赛，主题是用 AI 技术解决实际问题。我们团队选择了结合 AI 能力做某个方向的应用（具体方向待定），从需求分析到系统设计到前后端开发到模型训练，全流程参与。

## 团队分工

作为技术负责人，主要负责：
- 系统架构设计
- AI 模型选型和训练
- 后端 API 开发
- 前端界面实现

## 技术选型

```
前端:  Vue 3 + TypeScript + Vite
后端:  Python + FastAPI
AI:    PyTorch + Hugging Face Transformers
数据库: PostgreSQL + Redis
部署:  Docker + Nginx
```

## 开发过程

### 需求分析阶段

花了大概一周时间做调研，看了很多论文和竞品，确定了技术方案的可行性。这个阶段最重要的输出是需求文档和技术方案书。

### 原型开发阶段

用两周时间搭了一个能跑的 MVP（Minimum Viable Product）。前端用 Vue 3 快速搭界面，后端用 FastAPI 写 API，AI 部分先用预训练模型跑通流程。

### 模型训练阶段

根据实际需求微调模型。这一步花的时间最多——数据清洗、数据增强、超参数调优、评估指标选择，每一步都有坑。

```python
# 模型微调示例
from transformers import AutoModelForSequenceClassification, Trainer

model = AutoModelForSequenceClassification.from_pretrained(
    "bert-base-chinese",
    num_labels=num_classes
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=eval_ds,
    compute_metrics=compute_metrics,
)
trainer.train()
```

### 联调和测试阶段

前后端联调、AI 模型集成、性能优化、Bug 修复。这个阶段最痛苦的是各种环境问题——不同机器上的依赖版本不一致、GPU 驱动兼容性等。

## 收获

1. **工程能力** - 从零到一做一个完整项目，对系统设计有了更深的理解
2. **AI 实践** - 不只是调 API，而是真正理解了模型训练的全流程
3. **团队协作** - 学会了用 Git 协作开发，写了技术文档
4. **时间管理** - 比赛有 deadline，逼着自己提高效率

## 遇到的困难

- **数据不足** - 一开始训练数据太少，模型效果很差，后来用数据增强和迁移学习解决
- **性能瓶颈** - 推理速度太慢，通过模型量化和 ONNX Runtime 加速
- **前后端联调** - 接口文档写得不够详细，联调时反复修改
- **部署问题** - GPU 服务器的 CUDA 版本和本地不一致，折腾了很久

## 下一步

比赛还在进行中，后续还要：
- 完善产品细节
- 准备答辩材料
- 争取拿到好成绩

---

*比赛是次要的，学到东西才是最重要的。*
