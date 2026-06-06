---
title: DRM 框架学习笔记
date: '2026-06-02 16:00:00'
tags:
- Linux
- 嵌入式
- 图形
mood: 一般
cover: /images/miku/cover.webp
description: ''
---

花了两天时间啃 DRM 的文档，终于搞明白了 CRTC、Connector、Encoder 这几个对象之间的关系。

之前一直以为 DRM 就是 Direct Rendering Manager，应该和 OpenGL 有关。实际上它更多是内核侧的显示管理框架，和 Mesa 的 GPU 渲染是两回事。

在嵌入式上直接用 DRM 操作帧缓冲，不走 X11/Wayland，性能确实好很多。内存占用从 80MB 降到 8MB，帧率从 15fps 涨到 30fps。
