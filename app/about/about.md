---
title: 关于我
date: '2026-06-05'
tags: []
mood: ''
cover: /images/miku/cover.webp
description: ''
---

# 你好，我是「涙不在为你而流」

一个喜欢折腾代码和硬件的明日方舟玩家，集成电路设计与集成系统专业在读。

---

## 技术方向

**嵌入式开发**
- Linux 内核驱动开发（DRM/KMS 显示框架、EVDEV 触控输入）
- LVGL 图形界面设计与优化
- Buildroot 系统构建与定制
- Allwinner 芯片平台开发

**硬件设计**
- PCB 原理图与Layout设计
- 外设驱动调试（SPI、I2C、UART）
- 功耗优化与低功耗设计

**软件开发**
- C/C++ 嵌入式应用开发
- Python 工具脚本与后端服务
- Flutter 跨平台移动端开发
- Electron 桌面应用开发

**AI / 机器学习**
- TensorFlow / PyTorch 模型训练与部署
- NVIDIA NIM API 集成
- 嵌入式端模型推理优化

---

## 项目经历

### 罗德岛电子通行证

从零开始设计的明日方舟主题电子设备。硬件基于 Allwinner 芯片，软件从 u-boot 引导到 Linux 内核到 LVGL 界面全部自研。核心挑战在于 DRM/KMS 直接渲染——绕过 X11 和 Wayland，用 drmModeGetResources / drmModeAddFB2 直接操作帧缓冲，配合 libevdev 处理触控事件，在低端芯片上实现了 30fps 的流畅交互。整个系统通过 Buildroot 一键构建，从源码到可烧录固件全自动化。

### DRM App

电子通行证的核心显示程序。基于 Linux DRM（Direct Rendering Manager）和 KMS（Kernel Mode Setting）框架，直接与内核显示子系统通信。使用 GBM（Generic Buffer Management）分配图形缓冲区，通过 Page Flip 机制实现无撕裂的画面更新。触控输入走 evdev 接口，直接读取 /dev/input/eventX 的原始事件，延迟极低。整套方案不依赖任何桌面环境，在最小化 Linux 系统上即可运行。

### SmartCare 智能护理系统

医疗领域的 AI 辅助护理系统。前端使用 Flutter 实现跨平台（Android/iOS/Web），后端用 Python FastAPI 提供 RESTful API。核心是 AI 预警引擎：采集患者心率、血压、血氧等生命体征数据，通过 LSTM 时序模型预测异常趋势，在恶化前 15-30 分钟发出预警。系统还包含电子护理记录、药品管理和交接班功能，旨在减轻医护人员的夜间巡检负担。

### Neo AssetMaker

明日方舟二创素材制作工具。Electron 桌面应用，提供图形化界面来批量处理角色立绘、技能图标和 UI 组件。支持拖拽式操作、模板化导出和批量渲染，方便社区创作者快速生成统一风格的高质量素材。内置了方舟风格的滤镜和特效，可以一键生成符合游戏美术风格的图片。

### Buildroot 构建环境

电子通行证的四合一超级构建环境。把 u-boot 引导加载程序、Linux 内核、rootfs 根文件系统和 drmapp 用户态应用整合到一个 Buildroot 项目中，一条 make 命令就能编译出完整的可烧录固件。自定义了 defconfig 来精简系统，去掉了所有不需要的组件，最终镜像压缩后只有几十 MB。还写了增量编译脚本，日常开发时不用每次全量重建。

### AI-A05 服创大赛

2026 年软件创新大赛参赛项目。具体方向是结合 AI 能力解决实际问题，从需求分析、系统设计到前后端开发和模型训练，全流程参与。项目锻炼了团队协作能力和工程实践能力，也让我对 AI 在实际场景中的应用有了更深的理解。

---

## 兴趣爱好

- **明日方舟** - 罗德岛博士，基建管理大师，集成战略常客
- **硬件折腾** - 各种开发板爱好者，Allwinner / Rockchip / STM32 都玩
- **游戏** - 原神、星穹铁道、各种独立游戏
- **B站** - 偶尔刷刷番，写代码的时候偶尔看看

---

## 联系方式

- GitHub: [lxfebd](https://github.com/lxfebd)
- Email: (请通过 GitHub 联系)

---

*正在罗德岛技术部摸鱼...*
