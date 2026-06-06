// 照片墙数据
export interface Photo { url: string; caption?: string; }
export interface Album { id: string; title: string; description: string; cover: string; date: string; photos: Photo[]; }

export const albums: Album[] = [
  {
    "id": "arknights",
    "title": "明日方舟",
    "description": "泰拉大陆的日常记录",
    "cover": "/images/miku/bg1.webp",
    "date": "2026",
    "photos": [
      {
        "url": "/images/miku/bg1.webp",
        "caption": "罗德岛"
      },
      {
        "url": "/images/miku/bg2.webp",
        "caption": "泰拉大陆"
      }
    ]
  }
];
