---
title: "DRM App - 嵌入式 Linux 零拷贝渲染实践"
date: "2026-06-02 14:00:00"
description: "电子通行证的核心显示程序，基于 DRM/KMS 直接操作帧缓冲的开发记录"
cover: "/images/miku/cover.webp"
tags: ["DRM", "Linux", "嵌入式", "C", "图形"]
---

## 为什么不用 X11

在嵌入式 Linux 上做图形显示，大多数人会想到 X11 或者 Wayland。但在资源有限的芯片上，这些桌面环境太重了——光启动 X Server 就要吃掉几十 MB 内存，帧率还不稳定。

DRM（Direct Rendering Manager）是 Linux 内核的显示框架，允许用户态程序直接操作显示硬件。配合 KMS（Kernel Mode Setting），可以不依赖任何桌面环境，直接在 framebuffer 上画图。

## DRM 核心概念

DRM 的架构包含几个关键对象：

```
    Connector (物理接口)
         │
    Encoder (编码器)
         │
     CRTC (显示控制器)  ←── FrameBuffer (帧缓冲)
         │
      Plane (叠加层)
```

- **Connector** - 物理显示接口（HDMI、DSI、VGA 等）
- **Encoder** - 将帧缓冲数据编码成信号
- **CRTC** - 显示控制器，负责扫描输出
- **FrameBuffer** - 图像数据存储

## 初始化流程

```c
#include <xf86drm.h>
#include <xf86drmMode.h>

int drm_init(int *fd, uint32_t *crtc_id, uint32_t *connector_id) {
    // 1. 打开 DRM 设备
    *fd = open("/dev/dri/card0", O_RDWR | O_CLOEXEC);

    // 2. 获取显示资源
    drmModeRes *res = drmModeGetResources(*fd);

    // 3. 找到可用的 Connector
    drmModeConnector *conn = NULL;
    for (int i = 0; i < res->count_connectors; i++) {
        conn = drmModeGetConnector(*fd, res->connectors[i]);
        if (conn->connection == DRM_MODE_CONNECTED) break;
        drmModeFreeConnector(conn);
        conn = NULL;
    }

    // 4. 选择合适的显示模式
    drmModeModeInfo *mode = &conn->modes[0]; // 通常第一个是最佳模式

    // 5. 获取 Encoder 和 CRTC
    drmModeEncoder *enc = drmModeGetEncoder(*fd, conn->encoder_id);
    *crtc_id = enc->crtc_id;
    *connector_id = conn->connector_id;

    return 0;
}
```

## 帧缓冲管理

DRM 使用 GEM（Graphics Execution Manager）管理图形缓冲区：

```c
// 创建帧缓冲
struct drm_buffer {
    uint32_t width, height;
    uint32_t stride;
    uint32_t handle;
    uint32_t fb_id;
    uint8_t *map;
};

int create_framebuffer(int fd, struct drm_buffer *buf, int width, int height) {
    // 1. 创建 GEM 对象
    struct drm_mode_create_dumb create = {
        .width = width,
        .height = height,
        .bpp = 32,
    };
    ioctl(fd, DRM_IOCTL_MODE_CREATE_DUMB, &create);

    // 2. 创建 framebuffer
    drmModeAddFB2(fd, width, height, DRM_FORMAT_ARGB8888,
                  &create.handle, &create.pitch, &create.offset,
                  &buf->fb_id, 0);

    // 3. 内存映射
    struct drm_mode_map_dumb map = { .handle = create.handle };
    ioctl(fd, DRM_IOCTL_MODE_MAP_DUMB, &map);
    buf->map = mmap(0, create.size, PROT_READ | PROT_WRITE,
                    MAP_SHARED, fd, map.offset);

    return 0;
}
```

## Page Flip 渲染

使用 Page Flip 机制实现无撕裂的画面更新：

```c
// 双缓冲
struct drm_buffer buffers[2];
int current_buf = 0;

// 提交新帧
void render_frame(int fd, uint32_t crtc_id) {
    // 绘制到后台缓冲
    draw_to_buffer(&buffers[1 - current_buf]);

    // Page Flip
    drmModePageFlip(fd, crtc_id, buffers[1 - current_buf].fb_id,
                    DRM_MODE_PAGE_FLIP_EVENT, &current_buf);

    // 等待 flip 完成
    drmEventContext ev = { .version = DRM_EVENT_CONTEXT_VERSION };
    drmHandleEvent(fd, &ev);

    current_buf = 1 - current_buf;
}
```

## 触控输入

通过 evdev 接口读取触控事件：

```c
#include <libevdev-1.0/libevdev/libevdev.h>

int touch_init(const char *device) {
    int fd = open(device, O_RDONLY | O_NONBLOCK);
    struct libevdev *dev = libevdev_new();
    libevdev_set_fd(dev, fd);
    return fd;
}

void touch_read(int fd, int *x, int *y, int *pressed) {
    struct input_event ev;
    while (libevdev_next_event(fd, LIBEVDEV_READ_FLAG_NORMAL, &ev) == LIBEVDEV_READ_STATUS_SUCCESS) {
        if (ev.type == EV_ABS && ev.code == ABS_X) *x = ev.value;
        if (ev.type == EV_ABS && ev.code == ABS_Y) *y = ev.value;
        if (ev.type == EV_KEY && ev.code == BTN_TOUCH) *pressed = ev.value;
    }
}
```

## 性能数据

在 Allwinner 芯片上测试：

| 指标 | X11 | DRM App |
|------|-----|---------|
| 内存占用 | ~80MB | ~8MB |
| 启动时间 | ~5s | ~0.5s |
| 帧率 | 15-20fps | 30-40fps |
| CPU 占用 | ~40% | ~15% |

DRM 方案的优势是碾压性的——内存占用只有 X11 的十分之一，帧率翻倍。

## 遇到的问题

1. **格式兼容** - 不同芯片支持的像素格式不同，需要做格式转换
2. **多显示器** - 多 Connector 时要正确选择目标输出
3. **权限问题** - `/dev/dri/card0` 需要 video 组权限或 udev 规则
4. **Page Flip 超时** - 驱动不支持时需要退回到 drmModeSetCrtc

## 参考资料

- [DRM 各对象解释](https://docs.kernel.org/gpu/drm-internals.html)
- [libdrm 文档](https://gitlab.freedesktop.org/mesa/drm)
- [Rockchip DRM 开发指南](https://opensource.rock-chips.com/wiki_Drm)

---

*直接操作帧缓冲的感觉，就像直接和硬件对话。*
