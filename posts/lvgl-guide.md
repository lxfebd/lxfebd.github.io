---
title: "LVGL 入门 - 嵌入式 GUI 开发指南"
date: "2026-06-04 15:00:00"
description: "LVGL 图形库的基础使用方法和踩坑记录"
cover: "/images/miku/cover.webp"
tags: ["LVGL", "嵌入式", "GUI", "教程"]
---

## 什么是 LVGL

LVGL（Light and Versatile Graphics Library）是一个开源的嵌入式图形库，专为资源受限的微控制器设计。它提供了丰富的 UI 组件、流畅的动画效果和低内存占用，非常适合在嵌入式设备上做图形界面。

在电子通行证项目中，我用 LVGL 做了整套交互界面，从主界面到各个功能页面，跑在 Allwinner 芯片上能稳定 30fps。

## 环境搭建

```bash
# 克隆 LVGL
git clone https://github.com/lvgl/lvgl.git
cd lvgl

# 复制配置模板
cp lv_conf_template.h lv_conf.h

# 修改 lv_conf.h
# - 启用 LV_USE_WIN32 或对应平台
# - 设置颜色深度 LV_COLOR_DEPTH
# - 启用需要的组件
```

关键配置项：

```c
// lv_conf.h
#define LV_COLOR_DEPTH     16      // 16bit RGB565，嵌入式最常用
#define LV_MEM_CUSTOM      0       // 使用内置内存管理
#define LV_MEM_SIZE        (48 * 1024)  // 48KB 内存池
#define LV_DISP_DEF_REFR_PERIOD  33    // 33ms = 30fps
#define LV_USE_ANIMATION    1      // 启用动画
```

## 基础用法

### 创建一个按钮

```c
#include "lvgl.h"

void create_ui(void) {
    // 创建按钮
    lv_obj_t *btn = lv_btn_create(lv_scr_act());
    lv_obj_set_size(btn, 120, 50);
    lv_obj_center(btn);

    // 添加点击事件
    lv_obj_add_event_cb(btn, btn_click_handler, LV_EVENT_CLICKED, NULL);

    // 按钮上放标签
    lv_obj_t *label = lv_label_create(btn);
    lv_label_set_text(label, "Hello!");
    lv_obj_center(label);
}

void btn_click_handler(lv_event_t *e) {
    // 处理点击
    LV_LOG_USER("Button clicked!");
}
```

### 样式系统

LVGL 的样式类似 CSS，可以给组件设置各种属性：

```c
// 定义样式
static lv_style_t style;
lv_style_init(&style);
lv_style_set_bg_color(&style, lv_palette_main(LV_PALETTE_BLUE));
lv_style_set_bg_opa(&style, LV_OPA_COVER);
lv_style_set_radius(&style, 10);
lv_style_set_shadow_width(&style, 20);
lv_style_set_shadow_color(&style, lv_palette_main(LV_PALETTE_GREY));

// 应用样式
lv_obj_add_style(btn, &style, LV_PART_MAIN | LV_STATE_DEFAULT);
```

### 动画

```c
lv_anim_t a;
lv_anim_init(&a);
lv_anim_set_var(&a, obj);
lv_anim_set_values(&a, 0, 100);
lv_anim_set_time(&a, 500);
lv_anim_set_exec_cb(&a, (lv_anim_exec_xcb_t)lv_obj_set_x);
lv_anim_set_path_cb(&a, lv_anim_path_ease_in_out);
lv_anim_start(&a);
```

## 常用组件

| 组件 | 说明 | 用途 |
|------|------|------|
| lv_btn | 按钮 | 触控交互入口 |
| lv_label | 标签 | 文字显示 |
| lv_textarea | 文本输入 | 用户输入 |
| lv_list | 列表 | 信息展示 |
| lv_img | 图片 | 图标和封面 |
| lv_bar | 进度条 | 进度/电量显示 |
| lv_spinner | 加载动画 | 等待状态 |
| lv_tabview | 标签页 | 多页面切换 |
| lv_calendar | 日历 | 日期选择 |

## 和 DRM 对接

LVGL 需要一个显示驱动来把渲染结果输出到屏幕。在嵌入式 Linux 上，通常对接 DRM：

```c
// 显示驱动回调
static void disp_flush(lv_disp_drv_t *drv, const lv_area_t *area, lv_color_t *buf) {
    // 把 LVGL 的像素缓冲写入 DRM 帧缓冲
    uint32_t stride = crtc_info->pitch;
    uint8_t *dst = mapped_ptr + area->y1 * stride + area->x1 * 4;

    for (int y = area->y1; y <= area->y2; y++) {
        memcpy(dst, buf, (area->x2 - area->x1 + 1) * sizeof(lv_color_t));
        dst += stride;
        buf += (area->x2 - area->x1 + 1);
    }

    // 通知 LVGL 刷新完成
    lv_disp_flush_ready(drv);
}

// 触控驱动回调
static void touchpad_read(lv_indev_drv_t *drv, lv_indev_data_t *data) {
    struct input_event ev;
    // 读取 evdev 事件，转换为 LVGL 坐标
    data->point.x = calibrate_x(ev.value);
    data->point.y = calibrate_y(ev.value);
    data->state = is_pressed ? LV_INDEV_STATE_PRESSED : LV_INDEV_STATE_RELEASED;
}
```

## 性能优化

在低端芯片上跑 LVGL，性能优化是关键：

1. **减少全屏刷新** - 只刷新脏区域，不要每帧都重绘整个屏幕
2. **使用双缓冲** - 一个缓冲用于渲染，另一个用于 DMA 传输
3. **降低色深** - 16bit RGB565 比 32bit ARGB8888 省一半内存和带宽
4. **禁用不用的组件** - 在 lv_conf.h 中关闭不需要的功能
5. **合理设置刷新率** - 30fps 对大多数嵌入式场景足够

## 踩坑记录

1. **内存管理** - LVGL 的内存池要根据实际需求设置，太小会崩溃，太大会浪费
2. **刷新频率** - tick 中断频率要和 LV_DISP_DEF_REFR_PERIOD 匹配，否则动画卡顿
3. **触控事件** - 电阻屏的数据需要滤波，否则坐标跳动
4. **字体加载** - 中文字体文件很大，要裁剪用到的字符
5. **图片解码** - 大图片会占用大量内存，建议用 LV_IMG_CF_TRUE_COLOR_ALPHA 并压缩

## 参考资料

- [LVGL 官方文档](https://docs.lvgl.io)
- [LVGL GitHub](https://github.com/lvgl/lvgl)
- [LVGL 示例](https://github.com/lvgl/lvgl/tree/master/examples)

---

*嵌入式 GUI 开发，从 LVGL 开始。*
