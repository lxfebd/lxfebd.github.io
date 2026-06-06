---
title: "Buildroot 构建环境 - 四合一固件构建指南"
date: "2026-06-01 12:00:00"
description: "电子通行证的 Buildroot 构建环境，从 u-boot 到应用层的完整构建流程"
cover: "/images/miku/cover.webp"
tags: ["Buildroot", "嵌入式", "Linux", "u-boot", "构建系统"]
---

## 什么是 Buildroot

Buildroot 是一个简单的、高效的、易于使用的工具，用于生成嵌入式 Linux 系统。它通过交叉编译生成目标系统的所有组件，包括工具链、根文件系统、Linux 内核和 bootloader。

相比 Yocto，Buildroot 更简单直接，适合中小型嵌入式项目。电子通行证项目就把 u-boot、Linux 内核、rootfs 和应用层全部整合到一个 Buildroot 项目中。

## 项目结构

```
buildroot/
├── board/
│   └── epass/           # 板级支持文件
│       ├── genimage.cfg  # 镜像生成配置
│       ├── post_build.sh # 构建后脚本
│       └── u-boot.env    # U-Boot 环境变量
├── configs/
│   └── epass_defconfig  # 默认配置
├── package/
│   └── drmapp/          # 自定义应用包
│       ├── Config.in
│       ├── drmapp.mk
│       └── drmapp.conf
├── linux/
│   └── linux-6.x.config # 内核配置补丁
└── Makefile
```

## defconfig 配置

```bash
# configs/epass_defconfig
# 架构
BR2_arm=y
BR2_cortex_a7=y

# 工具链
BR2_TOOLCHAIN_EXTERNAL=y
BR2_TOOLCHAIN_EXTERNAL_CUSTOM=y
BR2_TOOLCHAIN_EXTERNAL_PATH="$(HOST_DIR)/arm-buildroot-linux-gnueabihf"

# 内核
BR2_LINUX_KERNEL=y
BR2_LINUX_KERNEL_CUSTOM_VERSION=y
BR2_LINUX_KERNEL_VERSION="6.6"
BR2_LINUX_KERNEL_USE_CUSTOM_CONFIG=y
BR2_LINUX_KERNEL_CUSTOM_CONFIG_FILE="board/epass/linux-6.6.config"

# Bootloader
BR2_TARGET_UBOOT=y
BR2_TARGET_UBOOT_BUILD_SYSTEM_KCONFIG=y
BR2_TARGET_UBOOT_CUSTOM_VERSION=y
BR2_TARGET_UBOOT_VERSION="2024.04"

# 文件系统
BR2_TARGET_ROOTFS_EXT2=y
BR2_TARGET_ROOTFS_EXT2_4="ext4"
BR2_TARGET_ROOTFS_EXT2_SIZE="64M"

# 应用
BR2_PACKAGE_DRMAPP=y
BR2_PACKAGE_LIBDRM=y
BR2_PACKAGE_LIBEVDEV=y
BR2_PACKAGE_LIBPNG=y
BR2_PACKAGE_FREETYPE=y

# 去掉不需要的
# BR2_PACKAGE_OPENSSH is not set
# BR2_PACKAGE_NGINX is not set
# BR2_PACKAGE_PHP is not set
```

## 自定义应用包

在 Buildroot 中添加自己的应用：

```makefile
# package/drmapp/drmapp.mk
DRMAPP_VERSION = 1.0
DRMAPP_SITE = $(BR2_EXTERNAL_epass_PATH)/package/drmapp
DRMAPP_SITE_METHOD = local
DRMAPP_DEPENDENCIES = libdrm libevdev libpng freetype lvgl

define DRMAPP_BUILD_CMDS
    $(MAKE) -C $(@D) \
        CC="$(TARGET_CC)" \
        CFLAGS="$(TARGET_CFLAGS)" \
        LDFLAGS="$(TARGET_LDFLAGS)" \
        PKG_CONFIG="$(PKG_CONFIG_HOST_BINARY)"
endef

define DRMAPP_INSTALL_TARGET_CMDS
    $(INSTALL) -D -m 0755 $(@D)/drmapp $(TARGET_DIR)/usr/bin/drmapp
endef

$(eval $(generic-package))
```

## 镜像生成

使用 genimage 生成可烧录的 SD 卡镜像：

```bash
# board/epass/genimage.cfg
image boot.vfat {
    vfat {
        files = {
            "u-boot-sunxi.bin",
            "sunxi-spl.bin",
            "zImage",
            "dtb"
        }
    }
    size = 64M
}

image rootfs.ext4 {
    ext4 {
        label = "rootfs"
    }
    size = 256M
}

image sdcard.img {
    hdimage {
        partition-table-type = "msdos"
    }
    partition boot {
        partition-type = 0x0C
        image = "boot.vfat"
    }
    partition rootfs {
        partition-type = 0x83
        image = "rootfs.ext4"
    }
}
```

## 构建流程

```bash
# 1. 配置
make epass_defconfig

# 2. 构建（首次全量编译约 20-30 分钟）
make -j$(nproc)

# 3. 输出固件在 output/images/
ls output/images/
# rootfs.ext4    - 根文件系统
# zImage         - 内核镜像
# u-boot-sunxi.bin - 引导加载程序
# sdcard.img     - 完整 SD 卡镜像

# 4. 烧录到 SD 卡
sudo dd if=output/images/sdcard.img of=/dev/sdX bs=4M status=progress
```

## 增量编译

日常开发时不需要每次全量重建：

```bash
# 只修改了应用代码
make drmapp-rebuild

# 只修改了内核
make linux-rebuild

# 只修改了文件系统内容
make target-finalize

# 增量编译脚本
#!/bin/bash
# quick-build.sh
make drmapp-rebuild 2>&1 | tail -5
make rootfs-ext2 2>&1 | tail -5
echo "Done! Flash output/images/sdcard.img"
```

## 系统精简

最终镜像压缩后只有几十 MB：

```
u-boot:     ~1MB
内核:        ~3MB
设备树:      ~50KB
根文件系统:  ~30MB
应用+库:    ~15MB
总计:        ~50MB
```

精简措施：
- 去掉 SSH、web server 等不需要的服务
- 使用 musl libc 替代 glibc（更小）
- 裁剪内核模块，只保留需要的驱动
- 使用 UPX 压缩可执行文件

## 调试技巧

1. **串口日志** - 通过 UART 查看内核启动日志和应用输出
2. **NFS 挂载** - 开发时用 NFS 挂载根文件系统，不用每次都烧录
3. **Buildroot OOT** - 使用 `BR2_PRIMARY_SITE` 缓存下载的包
4. **ccache** - 启用 ccache 加速交叉编译

---

*一条 make 命令，从源码到固件。*
