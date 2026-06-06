// 项目数据

export type Project = {
  id: string;
  name: string;
  description: string;
  icon: string;
  githubUrl: string;
  tags: string[];
};

export const projectsData: Project[] = [
  {
    "id": "epass",
    "name": "罗德岛电子通行证",
    "githubUrl": "https://github.com/lxfebd/hardware",
    "description": "基于 Allwinner 芯片的明日方舟主题电子设备。从 PCB 设计到 Linux 内核驱动，从 DRM 显示到 LVGL 界面，全流程自研。支持触控交互、动态 UI 和离线运行，是一个完整的嵌入式软硬件一体项目。",
    "icon": "EP",
    "tags": ["硬件", "LVGL", "嵌入式", "DRM", "Allwinner"]
  },
  {
    "id": "drm-app",
    "name": "DRM App",
    "githubUrl": "https://github.com/lxfebd/drm_app",
    "description": "电子通行证的核心应用程序，基于 Linux DRM/KMS 显示框架直接操作帧缓冲。绕过 X11/Wayland，实现零拷贝渲染，配合 EVDEV 触控事件处理，保证在低端芯片上也能流畅运行 30fps+ 的 LVGL 界面。",
    "icon": "DR",
    "tags": ["DRM", "Linux", "C", "帧缓冲", "触控"]
  },
  {
    "id": "smartcare",
    "name": "SmartCare",
    "githubUrl": "https://github.com/lxfebd/smartcare",
    "description": "医疗智能护理系统，Flutter 跨平台前端 + Python FastAPI 后端 + AI 预警引擎。实时采集患者生命体征数据，通过机器学习模型预测异常趋势并自动通知医护人员，减少夜间巡检负担。",
    "icon": "SC",
    "tags": ["AI", "医疗", "Flutter", "Python", "FastAPI"]
  },
  {
    "id": "neo-assetmaker",
    "name": "Neo AssetMaker",
    "githubUrl": "https://github.com/lxfebd/neo-assetmaker",
    "description": "明日方舟二创素材制作工具，Electron 桌面应用。提供图形化界面来批量处理角色立绘、技能图标和 UI 组件，支持模板化导出，方便社区创作者快速生成高质量素材。",
    "icon": "NA",
    "tags": ["明日方舟", "工具", "Electron", "二创"]
  },
  {
    "id": "buildroot",
    "name": "Buildroot 构建环境",
    "githubUrl": "https://github.com/lxfebd/buildroot",
    "description": "电子通行证的四合一超级构建环境：u-boot 引导 + Linux 内核 + rootfs 根文件系统 + drmapp 应用，一键编译出完整固件。基于 Buildroot 定制，精简到最小系统镜像，从源码到可烧录固件全流程自动化。",
    "icon": "BR",
    "tags": ["Buildroot", "嵌入式", "Linux", "u-boot", "固件"]
  },
  {
    "id": "ai-a05",
    "name": "AI-A05 服创大赛",
    "githubUrl": "https://github.com/lxfebd/AI-A05",
    "description": "2026 年软件创新大赛参赛项目。结合 AI 能力解决实际问题，涵盖需求分析、系统设计、前后端开发和模型训练全流程，锻炼团队协作和工程实践能力。",
    "icon": "AI",
    "tags": ["AI", "比赛", "创新", "全栈"]
  }
];
