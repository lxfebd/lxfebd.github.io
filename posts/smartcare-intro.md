---
title: "SmartCare - 医疗智能护理系统"
date: "2026-06-03 20:00:00"
description: "一个基于 AI 的医疗护理辅助系统，从架构到实现的完整记录"
cover: "/images/miku/cover.webp"
tags: ["AI", "医疗", "Flutter", "Python", "项目"]
---

## 项目简介

SmartCare 是一个医疗智能护理系统，旨在通过 AI 技术辅助医护人员日常工作。核心目标是：在患者病情恶化之前发出预警，让护士不用每半小时巡房一次。

## 解决的问题

传统护理模式下，护士需要定期巡房检查患者的生命体征。夜间巡检尤其辛苦——每隔一段时间就要挨个房间查看。SmartCare 的思路是：

1. **持续采集** - 通过医疗设备实时获取心率、血压、血氧等数据
2. **智能分析** - AI 模型分析历史趋势，预测可能的异常
3. **提前预警** - 在恶化前 15-30 分钟发出警报
4. **移动通知** - 护士通过手机 App 接收预警，不用频繁巡房

## 系统架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Flutter App │◄───►│  FastAPI    │◄───►│  AI Engine  │
│  (移动端)    │     │  (后端)     │     │  (预测模型)  │
└─────────────┘     └──────┬──────┘     └──────┬──────┘
                           │                    │
                    ┌──────▼──────┐     ┌──────▼──────┐
                    │  PostgreSQL │     │  InfluxDB   │
                    │  (业务数据)  │     │  (时序数据)  │
                    └─────────────┘     └─────────────┘
```

### 前端 - Flutter

Flutter 跨平台框架，一套代码同时运行在 Android、iOS 和 Web 上。主要页面包括：

- **患者列表** - 查看所有在院患者的基本信息
- **生命体征** - 实时心率、血压、血氧曲线图
- **预警中心** - 按优先级排列的预警信息
- **护理记录** - 电子化记录护理操作
- **药品管理** - 药品库存和用药提醒

Flutter 的 Material Design 组件和自定义动画让界面既专业又不难看。用 Provider 做状态管理，网络请求用 Dio。

### 后端 - FastAPI

Python FastAPI 提供 RESTful API，异步高性能。主要接口：

```python
# 预警接口示例
@app.get("/api/alerts/pending")
async def get_pending_alerts(nurse_id: int):
    alerts = await db.fetch_all(
        """SELECT * FROM alerts 
           WHERE assigned_nurse = :nurse_id 
           AND status = 'pending'
           ORDER BY priority DESC, created_at""",
        {"nurse_id": nurse_id}
    )
    return {"alerts": alerts}

# 接收生命体征数据
@app.post("/api/vitals")
async def receive_vitals(data: VitalsData):
    # 存入 InfluxDB
    await influx.write(data)
    # 触发 AI 分析
    await ai_engine.analyze(data.patient_id)
    return {"status": "ok"}
```

### AI 预警引擎

核心是一个基于 LSTM 的时序预测模型：

```python
# 模型结构
class VitalPredictor(nn.Module):
    def __init__(self):
        super().__init__()
        self.lstm = nn.LSTM(input_size=4, hidden_size=64, num_layers=2)
        self.fc = nn.Linear(64, 1)  # 输出：未来15分钟的风险评分

    def forward(self, x):
        # x: (batch, seq_len, 4) - 心率、血压、血氧、呼吸
        lstm_out, _ = self.lstm(x)
        risk_score = torch.sigmoid(self.fc(lstm_out[:, -1, :]))
        return risk_score
```

训练数据来自公开的医疗时序数据集，加上模拟数据增强。模型每 5 分钟对每个患者跑一次推理，输出未来 15 分钟的风险评分。超过阈值就触发预警。

## 技术栈

```
前端:  Flutter 3.x + Dart
后端:  Python 3.11 + FastAPI + Uvicorn
AI:    PyTorch + LSTM 时序模型
数据库: PostgreSQL (业务) + InfluxDB (时序)
部署:  Docker Compose
```

## 开发进度

- [x] 基础框架搭建
- [x] 用户认证模块（JWT）
- [x] 患者信息管理 CRUD
- [x] 生命体征数据采集接口
- [x] LSTM 预警模型训练
- [x] Flutter 基础页面
- [x] 预警通知推送
- [ ] 医疗设备协议对接（HL7/FHIR）
- [ ] 多科室权限管理
- [ ] 数据可视化大屏

## 遇到的挑战

1. **数据质量** - 医疗数据噪声大，需要大量清洗和预处理
2. **模型准确性** - 漏报和误报的平衡是个难题
3. **实时性** - 从数据采集到预警推送的全链路延迟要控制在秒级
4. **隐私合规** - 医疗数据涉及隐私，需要考虑数据脱敏和访问控制

## 未来规划

1. 接入更多医疗设备协议（HL7、FHIR）
2. 优化 AI 模型，引入 Transformer 架构
3. 添加语音交互功能
4. 与医院 HIS 系统对接
5. 申请医疗器械相关认证

---

*项目持续开发中...*
