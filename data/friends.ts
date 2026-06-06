// 友情链接数据
export interface Friend { id: string; name: string; url: string; description: string; avatar: string; themeColor: string; }

export const friendsData: Friend[] = [
  {
    "id": "prts",
    "name": "PRTS Wiki",
    "description": "明日方舟wiki，记录泰拉大陆的各项数据",
    "avatar": "https://prts.wiki/w/favicon.ico",
    "url": "https://prts.wiki/",
    "themeColor": "rgba(16, 185, 129, 0.5)"
  },
  {
    "id": "hypergryph",
    "name": "鹰角网络",
    "description": "明日方舟开发商官网",
    "avatar": "https://www.hypergryph.com/favicon.ico",
    "url": "https://www.hypergryph.com/",
    "themeColor": "rgba(239, 68, 68, 0.5)"
  },
];
