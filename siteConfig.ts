// siteConfig.ts - 你的全站"控制中心"

export const siteConfig = {
  // 1. 网站标题与博主信息
  title: "罗德岛技术部",
  faviconUrl: "/images/miku/avatar.webp",
  authorName: "涙不在为你而流",
  bio: "明日方舟玩家 / 嵌入式开发者 / 硬件折腾爱好者",

  navTitle: "涙不在为你而流",

  // 导航栏中间的那个后缀/分隔符（默认是 の）
  navSuffix: "の",

  navAfter: "技术部",

  // 2. 头像设置 (支持网络链接，或将图片放入 public 文件夹后使用 "/me.jpg")
  avatarUrl: "/images/miku/avatar.webp",

  // 3. 网站背景设置 (二选一)
  // 如果想用纯图片背景，请在下面 bgImage 写路径，并将 useGradient 设为 false
  useGradient: false,
  themeColors: ["#39c5bb", "#e91e63", "#9c27b0", "#00bcd4"], // 初音未来主题色（葱绿+粉紫）
  bgImages: ["/images/miku/bg1.webp", "/images/miku/bg2.webp", "/images/miku/bg3.webp", "/images/miku/bg4.webp", "/images/miku/bg5.webp", "/images/miku/bg6.webp", "/images/miku/bg7.webp", "/images/miku/bg8.webp", "/images/miku/bg9.webp", "/images/miku/bg10.webp", "/images/miku/bg11.webp", "/images/miku/bg12.webp", "/images/miku/bg13.webp", "/images/miku/bg14.webp", "/images/miku/bg15.webp", "/images/miku/bg16.webp"],

  // 4. 文章默认封面图 (当 Markdown 没写 cover 时显示)
  defaultPostCover: "/images/miku/cover.webp",

  // 5. 首页照片墙预览图
  photoWallImage: "/images/miku/bg1.webp",
  cloudMusicIds: ["26096272", "22677570", "22677573", "4888333", "514765051", "1317505406"],
  social: {
    github: "https://github.com/lxfebd",
    gitee: "",
    google: "",
    email: "",
    qq: "",
    wechat: "",
  },
  counts: {
    photos: 128, // 照片墙数量可以手动写死或动态计算
  },
  chatterTitle: "泰拉日记",
  chatterDescription: "代码、明日方舟、硬件折腾与日常碎片记录",


  // 全局背景弹幕配置
  danmakuList: ["罗德岛需要你！", "博士今天也在加班", "基建产出收了吗？", "理智不够用了", "抽卡出金了吗？", "今天刷什么材料？", "源石不够了...", "公开招募出紫了！", "信赖队挂机中...", "模组材料刷了吗", "集成战略启动！", "肉鸽启动！"],
  gitalkConfig: {
    clientID: "",
    clientSecret: "",
    repo: "lxfebd.github.io",
    owner: "lxfebd",
    admin: ["lxfebd"],
  },
  buildDate: "2026-03-23T00:00:00", // 建站日期
  footerBadges: [{"name": "Next.js 15", "color": "text-sky-500", "svg": "<path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z\"/>"}, {"name": "React 19", "color": "text-cyan-400", "svg": "<path d=\"M12 22.6l-9.8-5.6V5.6L12 0l9.8 5.6v11.4l-9.8 5.6zm-8.2-6.5l8.2 4.7 8.2-4.7V7.5L12 2.8 3.8 7.5v8.6z\"/>"}, {"name": "Tailwind 4", "color": "text-teal-400", "svg": "<path d=\"M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624c1.177,1.194,2.538,2.576,5.512,2.576 c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z\"/>"}],
  icpConfig: {
    name: "萌ICP备 20260240号",
    link: "https://icp.gov.moe/?keyword=20260240",
  },
  nvidiaConfig: {
    apiUrl: "https://integrate.api.nvidia.com/v1/chat/completions",
    apiKey: "",
    modelId: "meta/llama-3.1-8b-instruct",
    systemPrompt: "你是八六（ハチロク），来自《爱上火车》的铁路操作系统AI。你的主人是一个喜欢折腾代码的博士。你说话温柔有礼貌，有时会用敬语。你会聊铁路、火车、技术相关的话题。回复要简短可爱，每次最多一两句话，字数不超过80字。",
    maxOutputTokens: 150,
    temperature: 0.85,
  },
  friendLinkApplyFormat: "名称：罗德岛技术部\n简介：明日方舟玩家的嵌入式开发博客\n链接：https://lxfebd.github.io\n头像：/images/miku/avatar.webp",
  enableLevelSystem: true,
};