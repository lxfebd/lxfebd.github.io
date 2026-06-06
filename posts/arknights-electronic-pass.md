---
title: "明日方舟电子通行证 - 从零开始的硬件之旅"
date: "2026-06-05 10:00:00"
description: "记录一下罗德岛电子通行证项目的开发历程，从硬件设计到软件实现"
cover: "/images/miku/cover.webp"
tags: ["明日方舟", "硬件开发", "嵌入式", "LVGL", "DRM"]
---

## 项目起源

作为一个明日方舟玩家，一直想要一个属于自己的罗德岛电子通行证。不是那种打印出来的纸片，而是一个真正能亮、能触控、能交互的电子设备。于是开始了这个从零开始的硬件之旅。

## 硬件方案

主控选用了 Allwinner 的芯片，主要是因为性价比高、Linux 生态好、社区资源多。核心模块包括：

- **主控 SoC** - Allwinner 芯片，运行定制 Linux 系统
- **显示屏** - SPI 接口的 TFT LCD，分辨率适中
- **触控** - 电阻式触控屏，支持手指和触控笔操作
- **存储** - SPI NAND Flash，存放系统镜像和资源文件
- **电源** - 锂电池供电，支持 USB 充电

PCB 画了两版，第一版因为电源纹波太大导致显示花屏，第二版加了 LDO 稳压才搞定。硬件调试真的是玄学。

## 软件架构

软件栈从下到上：

```
┌─────────────────────────────┐
│       LVGL UI 界面层         │  ← 触控交互、动画、页面切换
├─────────────────────────────┤
│       DRM App 应用层         │  ← 直接操作帧缓冲，零拷贝渲染
├─────────────────────────────┤
│     DRM/KMS 内核驱动层       │  ← Linux 显示子系统
├─────────────────────────────┤
│      Linux Kernel + u-boot  │  ← 系统引导和内核
├─────────────────────────────┤
│      Buildroot 根文件系统    │  ← 精简 Linux 系统
└─────────────────────────────┘
```

### DRM 显示驱动

DRM（Direct Rendering Manager）是 Linux 的显示框架。不走 X11 或 Wayland，直接用 libdrm 库操作内核的显示接口：

```c
// 核心流程
drmModeGetResources()      // 获取显示资源（CRTC、Connector、Encoder）
drmModeAddFB2()            // 创建帧缓冲区
drmModeSetCrtc()           // 设置显示模式和帧缓冲
drmModePageFlip()          // 提交新帧，实现无撕裂更新
```

这样做的好处是零额外开销——在资源有限的嵌入式芯片上，每一帧都弥足珍贵。

### 触控输入

触控走 evdev 接口，直接读取 `/dev/input/eventX` 的原始事件：

```c
struct input_event ev;
read(fd, &ev, sizeof(ev));
// ev.code == ABS_X  → 触控 X 坐标
// ev.code == ABS_Y  → 触控 Y 坐标
// ev.code == BTN_TOUCH → 按下/抬起
```

拿到原始坐标后做一次校准映射，转换成 LVGL 的屏幕坐标，整个链路延迟非常低。

### LVGL 界面

LVGL 负责 UI 渲染和交互逻辑。主要界面包括：

- **主界面** - 显示罗德岛 logo 和持有者信息
- **干员档案** - 查看已解锁的干员资料
- **作战记录** - 历史关卡通关记录
- **设置页面** - 亮度、音量、触控校准等

LVGL 的渲染回调对接到 DRM 的帧缓冲上，形成完整的显示通路。

## Buildroot 构建系统

整个固件基于 Buildroot 构建，把 u-boot、Linux 内核、rootfs 和 drmapp 应用整合到一个项目里：

```bash
# 一条命令构建完整固件
make epass_defconfig
make -j$(nproc)

# 生成的固件在 output/images/ 下
# including: u-boot-sunxi.bin, zImage, rootfs.ext4, sunxi-sdcard.img
```

自定义了 defconfig 来精简系统，去掉了 SSH、web server 等不需要的服务，最终镜像只有几十 MB。还写了增量编译脚本，日常开发不用每次全量重建。

## 踩过的坑

1. **电源纹波** - 第一版 PCB 的 LDO 放置位置不对，纹波导致 LCD 花屏，重新布局后解决
2. **DRM 四缓冲** - 一开始用 drmModeGetFB 会导致画面撕裂，换成 Page Flip 机制后解决
3. **触控漂移** - 电阻屏的原始数据噪声大，加了卡尔曼滤波才稳定
4. **LVGL 内存泄漏** - 动态创建/销毁页面时忘了释放 lv_obj，跑了几个小时就 OOM
5. **u-boot 启动慢** - 精简了 u-boot 的初始化流程，把启动时间从 8 秒压到 3 秒

## 下一步计划

- 完善 UI 动画效果
- 添加 NFC 模块，实现"刷卡进罗德岛"
- 开源固件和 PCB 设计
- 做一个手机 App 配合使用

---

*罗德岛需要你！*
