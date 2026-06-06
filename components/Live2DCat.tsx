"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeechBubble {
  text: string;
  id: number;
}

export default function Live2DCat() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const spriteRef = useRef<any>(null);

  const [speech, setSpeech] = useState<SpeechBubble | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speechIdRef = useRef(0);

  // 显示说话气泡
  const speak = useCallback((text: string, duration = 6000) => {
    const id = ++speechIdRef.current;
    setSpeech({ text, id });
    if (chatTimeoutRef.current) clearTimeout(chatTimeoutRef.current);
    chatTimeoutRef.current = setTimeout(() => {
      setSpeech(prev => prev?.id === id ? null : prev);
    }, duration);
  }, []);

  // 播放动作
  const playMotion = useCallback(async (group: string) => {
    if (!spriteRef.current) return;
    try {
      const motions = spriteRef.current.getMotions();
      const groupMotions = motions.filter((m: any) => m.group === group);
      if (groupMotions.length > 0) {
        const motion = groupMotions[Math.floor(Math.random() * groupMotions.length)];
        spriteRef.current.playMotion(motion.group, motion.index);
      }
    } catch (e) {
      console.warn('Motion play failed:', e);
    }
  }, []);

  // 初始化 Live2D
  useEffect(() => {
    let disposed = false;
    let app: any = null;

    async function initLive2D() {
      if (!canvasRef.current || disposed) return;

      try {
        // 动态导入
        const pixi = await import('pixi.js');
        const easyLive2d = await import('easy-live2d');

        if (disposed) return;

        console.log('Live2D: Starting initialization...');

        // 创建 PixiJS 应用
        app = new pixi.Application();

        const canvas = canvasRef.current!;
        const width = canvas.clientWidth || 200;
        const height = canvas.clientHeight || 200;

        await app.init({
          canvas: canvas,
          width: width,
          height: height,
          backgroundAlpha: 0,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        });

        if (disposed) {
          app.destroy(true);
          return;
        }

        console.log('Live2D: PixiJS app initialized');

        // 加载模型
        const modelUrl = '/live2d-model/Yulia.model3.json';
        const response = await fetch(modelUrl);
        const modelJSON = await response.json();

        if (disposed) {
          app.destroy(true);
          return;
        }

        console.log('Live2D: Model JSON loaded');

        // 创建模型设置
        const modelSetting = new easyLive2d.CubismSetting({ modelJSON });

        // 重定向资源路径
        modelSetting.redirectPath(({ file }: { file: string }) => {
          const url = new URL(file, window.location.origin + modelUrl);
          return url.toString();
        });

        // 创建 Live2D Sprite
        const sprite = new easyLive2d.Live2DSprite({
          modelSetting: modelSetting,
          ticker: app.ticker,
        });

        if (disposed) {
          sprite.destroy();
          app.destroy(true);
          return;
        }

        // 添加到舞台
        app.stage.addChild(sprite as any);

        console.log('Live2D: Sprite created, waiting for ready...');

        // 等待模型加载完成
        await sprite.ready;

        if (disposed) {
          sprite.destroy();
          app.destroy(true);
          return;
        }

        console.log('Live2D: Model ready!');

        // 适配大小
        const modelSize = sprite.getModelCanvasSize();
        if (modelSize && modelSize.width > 0 && modelSize.height > 0) {
          const scale = Math.min(width / modelSize.width, height / modelSize.height);
          sprite.width = modelSize.width * scale;
          sprite.height = modelSize.height * scale;
          sprite.x = (width - sprite.width) / 2;
          sprite.y = height - sprite.height;
        }

        sprite.onResize();

        appRef.current = app;
        spriteRef.current = sprite;
        setIsLoaded(true);
        setError(null);

        // 播放待机动画
        playMotion('Idle');
        speak("主人您好，我是八六~", 5000);

        console.log('Live2D: Initialization complete!');

      } catch (err: any) {
        console.error('Live2D init failed:', err);
        setError(err.message || 'Failed to load Live2D model');
        if (app) {
          try { app.destroy(true); } catch (e) {}
        }
      }
    }

    // 延迟初始化，确保 Cubism Core 已加载
    const timer = setTimeout(initLive2D, 100);

    return () => {
      disposed = true;
      clearTimeout(timer);
      if (appRef.current) {
        try {
          appRef.current.destroy(true);
        } catch (e) {}
        appRef.current = null;
      }
      spriteRef.current = null;
    };
  }, [playMotion, speak]);

  // 随机待机语录
  useEffect(() => {
    const randomBarks = [
      "主人，今天也要加油哦~",
      "代码写得顺利吗？",
      "想喝杯茶休息一下吗？",
      "今天的列车准点运行呢~",
      "DRM驱动调好了吗？",
      "八六在这里陪着您哦。",
      "需要八六帮忙看看代码吗？",
      "铁路沿线的风景很美呢...",
    ];
    const randomTalkInterval = setInterval(() => {
      if (!speech && !showInput && !isThinking && Math.random() > 0.85) {
        const randomMsg = randomBarks[Math.floor(Math.random() * randomBarks.length)];
        speak(randomMsg, 5000);
        playMotion('Idle');
      }
    }, 25000);

    return () => clearInterval(randomTalkInterval);
  }, [speech, showInput, isThinking, speak, playMotion]);

  // 点击交互
  const handlePetCat = () => {
    if (isThinking) return;
    speak("主人...这样会让八六害羞的...", 2500);
    playMotion('Complete');
  };

  // 模拟回复库
  const mockReplies: Record<string, string[]> = {
    feed: [
      "谢谢主人...八六很喜欢...",
      "小鱼干最好吃了...嘿嘿...",
      "主人对八六真好...",
      "吃饱了才有力气帮博士工作呢...",
      "这是今天最开心的事！",
    ],
    greeting: [
      "おはようございます...博士今天也辛苦了呢...",
      "博士...八六一直在等你...",
      "欢迎回来...今天想聊些什么？",
      "八六刚刚在检查系统...一切正常！",
    ],
    tech: [
      "DRM/KMS 直接渲染...八六也觉得这个方案很优雅...",
      "Buildroot 构建系统...定制化程度好高...",
      "LVGL 的触控响应延迟很低呢...",
      "嵌入式开发需要耐心...八六会陪着博士的...",
    ],
    arknights: [
      "博士...今天要刷什么材料？",
      "集成战略...八六也想一起玩...",
      "基建产出收了吗？别忘了哦...",
      "公开招募出紫了！好运气！",
      "理智不够用了...休息一下吧...",
    ],
    default: [
      "八六明白了...还有什么需要帮忙的吗？",
      "收到...八六会努力的！",
      "博士说得对...八六记住了...",
      "嗯嗯...八六在认真听呢...",
      "这个问题...让八六想想...",
      "八六的线路很通畅...随时待命！",
      "了解...八六会尽力协助博士的...",
      "好的...八六已经记录下来了...",
    ],
  };

  const getMockReply = (message: string): string => {
    const lower = message.toLowerCase();
    if (lower.includes("喂") || lower.includes("鱼") || lower.includes("吃")) {
      const replies = mockReplies.feed;
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (lower.includes("你好") || lower.includes("在吗") || lower.includes("hello")) {
      const replies = mockReplies.greeting;
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (lower.includes("代码") || lower.includes("开发") || lower.includes("驱动") || lower.includes("linux")) {
      const replies = mockReplies.tech;
      return replies[Math.floor(Math.random() * replies.length)];
    }
    if (lower.includes("方舟") || lower.includes("博士") || lower.includes("理智") || lower.includes("材料")) {
      const replies = mockReplies.arknights;
      return replies[Math.floor(Math.random() * replies.length)];
    }
    const replies = mockReplies.default;
    return replies[Math.floor(Math.random() * replies.length)];
  };

  // 喂食交互
  const handleFeed = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThinking) return;

    setShowInput(false);
    setIsThinking(true);
    playMotion('Thinking');

    await new Promise(r => setTimeout(r, 1000));
    const reply = getMockReply("喂鱼干");
    speak(reply, 6000);
    playMotion('Complete');
    setIsThinking(false);
  };

  // 聊天提交
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    const userMessage = inputValue;
    setInputValue('');
    setShowInput(false);
    setIsThinking(true);
    playMotion('Thinking');

    await new Promise(r => setTimeout(r, 800));
    const reply = getMockReply(userMessage);
    speak(reply, 8000);
    playMotion('Complete');
    setIsThinking(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.02, cursor: "grabbing" }}
      className="fixed bottom-10 right-10 z-[9999] flex flex-row items-end gap-1 cursor-grab active:cursor-grabbing"
    >
      {/* 交互按钮 - 放在左侧 */}
      <div className="flex flex-col gap-1.5 mb-2">
        {/* 聊天按钮 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInput(!showInput);
          }}
          className="bg-white/90 dark:bg-slate-700/90 p-1.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-pink-200 dark:border-slate-600 text-pink-500 hover:text-pink-600 flex items-center justify-center backdrop-blur-sm"
          title="聊天"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
          </svg>
        </button>

        {/* 喂食按钮 */}
        <button
          onClick={handleFeed}
          disabled={isThinking}
          className={`bg-white/90 dark:bg-slate-700/90 p-1.5 rounded-full shadow-md hover:scale-110 active:scale-95 transition-transform border border-pink-200 dark:border-slate-600 flex items-center justify-center backdrop-blur-sm ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="投喂点心"
        >
          <span className="text-xs font-bold leading-none">餌</span>
        </button>
      </div>

      {/* 右侧：气泡 + 模型 */}
      <div className="flex flex-col items-center">
        {/* 说话气泡 */}
        <div className="relative w-full flex justify-center mb-2">
          <AnimatePresence>
            {speech && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className="absolute bottom-0 bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-gray-200 px-3 py-2 rounded-xl shadow-lg border border-pink-200 dark:border-slate-700 text-xs max-w-[180px] break-words text-center leading-relaxed backdrop-blur-sm"
                style={{ pointerEvents: 'none', transformOrigin: 'bottom center' }}
              >
                {speech.text}
                <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white/95 dark:bg-slate-800/95 border-b border-r border-pink-200 dark:border-slate-700 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Live2D Canvas */}
        <div
          className="w-[200px] h-[200px] relative cursor-pointer"
          onClick={handlePetCat}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ touchAction: 'none' }}
          />
          {!isLoaded && !error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-pink-400 text-xs animate-pulse">八六正在启动...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-red-400 text-xs text-center px-2">{error}</div>
            </div>
          )}
        </div>
      </div>

      {/* 聊天输入框 */}
      <AnimatePresence>
        {showInput && (
          <motion.form
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            onSubmit={handleChatSubmit}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 p-1 rounded-full shadow-lg flex items-center border border-pink-200 dark:border-slate-700 w-48 z-20"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="和八六说点什么吧..."
              className="bg-transparent border-none outline-none text-xs px-2 py-1 w-full dark:text-white placeholder-gray-400"
              disabled={isThinking}
              autoFocus
            />
            <button
              type="submit"
              disabled={isThinking || !inputValue.trim()}
              className={`rounded-full p-1.5 ml-1 flex items-center justify-center transition-colors ${
                isThinking || !inputValue.trim() ? 'bg-gray-300 text-gray-500' : 'bg-pink-500 hover:bg-pink-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
              </svg>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
