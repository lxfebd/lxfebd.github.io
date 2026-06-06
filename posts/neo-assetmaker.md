---
title: "Neo AssetMaker - 明日方舟二创素材工具"
date: "2026-05-28 16:00:00"
description: "为明日方舟社区创作者开发的素材制作工具，Electron 桌面应用"
cover: "/images/miku/cover.webp"
tags: ["明日方舟", "工具", "Electron", "二创"]
---

## 为什么做这个工具

明日方舟的社区二创很活跃，但制作素材的过程比较繁琐。角色立绘需要裁剪、调色、加特效，技能图标要统一尺寸和风格，UI 组件要符合游戏的视觉规范。每次都要开 Photoshop 手动处理，效率很低。

于是做了 Neo AssetMaker——一个专门面向明日方舟二创的素材制作工具，把重复性的操作自动化。

## 功能特性

### 角色立绘处理

- **智能裁剪** - 自动识别角色轮廓，去除背景
- **风格滤镜** - 内置方舟风格的色彩滤镜，一键生成游戏感
- **光效叠加** - 源石特效、技能光效等预设
- **批量导出** - 一次处理多个角色，统一输出尺寸

### 技能图标制作

- **模板系统** - 预设方舟风格的图标模板
- **自动排版** - 按照游戏规范自动排列技能图标
- **多分辨率** - 一次生成多种尺寸的图标
- **格式支持** - PNG、WebP、带透明通道

### UI 组件

- **对话框模板** - 方舟风格的对话框、提示框
- **按钮样式** - 各种状态的按钮预设
- **进度条/血条** - 游戏风格的进度条组件
- **字体匹配** - 自动匹配方舟使用的字体风格

## 技术实现

### Electron + Vue

前端使用 Vue 3 + TypeScript，通过 Electron 打包成桌面应用：

```
┌──────────────────────────────────┐
│         Electron 主进程           │
│  ├── 文件系统访问                 │
│  ├── 图像处理（sharp / jimp）     │
│  └── 导出打包                    │
├──────────────────────────────────┤
│         Vue 3 渲染进程            │
│  ├── 拖拽式操作界面              │
│  ├── Canvas 实时预览             │
│  └── 参数调节面板                │
└──────────────────────────────────┘
```

### 图像处理

使用 Sharp 库进行高性能图像处理：

```javascript
// 智能裁剪 - 去除背景
async function removeBackground(inputPath) {
    const image = sharp(inputPath);
    const { data, info } = await image
        .raw()
        .toBuffer({ resolveWithObject: true });

    // 简单的背景移除（实际用 AI 模型）
    for (let i = 0; i < data.length; i += 4) {
        if (isBackground(data[i], data[i+1], data[i+2])) {
            data[i+3] = 0; // 设为透明
        }
    }

    return sharp(data, { raw: info });
}

// 方舟风格滤镜
async function applyArknightsFilter(inputPath) {
    return sharp(inputPath)
        .modulate({ brightness: 0.95, saturation: 1.1 })
        .tint({ r: 240, g: 245, b: 255 }) // 冷色调
        .sharpen({ sigma: 1.5 })
        .png();
}
```

### 模板系统

模板用 JSON 配置，方便扩展：

```json
{
  "name": "技能图标模板",
  "size": [128, 128],
  "border": {
    "width": 3,
    "color": "#1a1a2e",
    "radius": 8
  },
  "background": {
    "type": "gradient",
    "colors": ["#2d3748", "#1a202c"]
  },
  "effects": [
    { "type": "glow", "color": "#4fd1c5", "intensity": 0.3 }
  ]
}
```

## 使用流程

1. **导入素材** - 拖拽角色立绘或图标到工作区
2. **选择模板** - 从预设模板中选择合适的样式
3. **调节参数** - 实时预览效果，微调各项参数
4. **批量处理** - 对多个素材应用相同的处理流程
5. **导出** - 选择格式和分辨率，一键导出

## 后续计划

- 接入 AI 模型实现更智能的背景移除
- 添加更多方舟风格的滤镜和特效
- 支持自定义模板导入
- 添加素材库管理功能

---

*为社区创作者提供便利。*
