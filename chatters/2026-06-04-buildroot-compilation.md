---
title: Buildroot 编译环境折腾记
date: '2026-06-04 10:00:00'
tags:
- 嵌入式
- Linux
- 日常
mood: 一般
cover: /images/miku/cover.webp
description: ''
---

Buildroot 编译环境又出问题了，这次是 toolchain 的 glibc 版本和内核头文件不匹配。

花了半天时间排查，最后发现是 host 工具链没清理干净。make clean 后重新编译就好了。

嵌入式开发日常：80% 时间在配环境，20% 时间在写代码。

不过编译成功的那一刻还是很有成就感的。一条 make 出完整固件，烧录进去就能跑，这种从零到一的感觉真好。
