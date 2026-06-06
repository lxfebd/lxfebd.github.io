"use client";
import { useState, useEffect } from 'react';
import { siteConfig } from '../siteConfig';

export default function BackgroundSlider() {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));
  const images = siteConfig.bgImages;

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % images.length;
        // 预加载下一张和下下张
        setLoaded((prev) => {
          const next2 = (next + 1) % images.length;
          return new Set([...prev, next, next2]);
        });
        return next;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [images.length]);

  // 只渲染已加载的图片，避免同时请求所有图片
  const visibleImages = images.filter((_, i) => loaded.has(i));

  return (
    <div className="absolute inset-0 z-[-10] overflow-hidden">
      {visibleImages.map((img, vi) => {
        const i = images.indexOf(img);
        return (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out transform-gpu"
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: i === index ? 1 : 0,
              visibility: Math.abs(i - index) <= 1 || (i === images.length - 1 && index === 0) ? 'visible' : 'hidden'
            }}
          />
        );
      })}
    </div>
  );
}